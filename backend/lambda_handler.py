"""
DocuSense - AWS Serverless OCR & Ingestion Pipeline
Main Lambda Entrypoint: lambda_handler.py
Runtime: Python 3.12 (AWS Graviton3 / arm64)
"""
import json
import logging
import os
import urllib.parse
from datetime import datetime
import boto3

from textract_processor import analyze_document_with_textract
from smart_tagger import generate_smart_tags, extract_monetary_summary
from dynamodb_service import save_document_metadata
from opensearch_indexer import index_document_in_opensearch

# Setup structured logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3_client = boto3.client("s3")


def lambda_handler(event, context):
    """
    Handles S3 ObjectCreated events (either directly or routed via Amazon EventBridge).
    Extracts OCR text, builds key-value entities, creates smart tags,
    and updates both DynamoDB and OpenSearch.
    """
    logger.info("Received event: %s", json.dumps(event))

    results = []

    # Handle EventBridge envelope or direct S3 event
    records = []
    if "Records" in event:
        records = event["Records"]
    elif event.get("source") == "aws.s3" and "detail" in event:
        # Standard EventBridge schema
        records = [{
            "s3": {
                "bucket": {"name": event["detail"]["bucket"]["name"]},
                "object": {"key": event["detail"]["object"]["key"], "size": event["detail"]["object"].get("size", 0)}
            }
        }]

    if not records:
        logger.warning("No S3 records found in event payload.")
        return {"statusCode": 400, "body": json.dumps({"error": "No S3 records detected"})}

    for record in records:
        bucket_name = record["s3"]["bucket"]["name"]
        raw_key = record["s3"]["object"]["key"]
        object_key = urllib.parse.unquote_plus(raw_key)
        object_size = record["s3"]["object"].get("size", 0)

        logger.info("Processing object: s3://%s/%s (%d bytes)", bucket_name, object_key, object_size)

        try:
            # 1. Inspect Object Metadata from S3
            head_resp = s3_client.head_object(Bucket=bucket_name, Key=object_key)
            content_type = head_resp.get("ContentType", "application/octet-stream")

            # 2. Invoke AWS Textract for Document OCR & Key-Value extraction
            ocr_result = analyze_document_with_textract(bucket_name, object_key)

            raw_text = ocr_result.get("raw_text", "")
            key_values = ocr_result.get("key_values", {})
            tables = ocr_result.get("tables", [])
            avg_confidence = ocr_result.get("avg_confidence", 95.0)

            # 3. Generate Smart Tags (#invoice, #total, #receipt, etc.)
            smart_tags = generate_smart_tags(raw_text, key_values, object_key)
            monetary_data = extract_monetary_summary(raw_text, key_values)

            # 4. Generate Unique Document ID
            filename = os.path.basename(object_key)
            document_id = f"doc_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{filename.replace('.', '_')}"

            metadata_item = {
                "document_id": document_id,
                "file_name": filename,
                "s3_bucket": bucket_name,
                "s3_key": object_key,
                "file_size": object_size,
                "content_type": content_type,
                "ocr_confidence": avg_confidence,
                "tags": smart_tags,
                "monetary_data": monetary_data,
                "key_values": key_values,
                "tables_count": len(tables),
                "created_at": datetime.utcnow().isoformat() + "Z",
                "status": "PROCESSED"
            }

            # 5. Persist Document Record to Amazon DynamoDB
            save_document_metadata(metadata_item)

            # 6. Index into Amazon OpenSearch for High-Speed Snippet & Full-Text Search
            index_document_in_opensearch(document_id, {
                "document_id": document_id,
                "file_name": filename,
                "s3_key": object_key,
                "tags": smart_tags,
                "total_amount": monetary_data.get("total_amount"),
                "vendor": monetary_data.get("vendor"),
                "raw_text": raw_text,
                "created_at": metadata_item["created_at"]
            })

            logger.info("Successfully ingested document: %s with tags: %s", document_id, smart_tags)
            results.append({
                "document_id": document_id,
                "status": "SUCCESS",
                "tags": smart_tags,
                "total_amount": monetary_data.get("total_amount")
            })

        except Exception as e:
            logger.error("Error processing s3://%s/%s: %s", bucket_name, object_key, str(e), exc_info=True)
            results.append({
                "s3_key": object_key,
                "status": "ERROR",
                "error": str(e)
            })

    return {
        "statusCode": 200,
        "body": json.dumps({"processed_count": len(results), "results": results})
    }
