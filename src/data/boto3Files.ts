export interface Boto3File {
  path: string;
  name: string;
  language: string;
  description: string;
  content: string;
}

export const BOTO3_BACKEND_FILES: Boto3File[] = [
  {
    path: 'src/lambda_handler.py',
    name: 'lambda_handler.py',
    language: 'python',
    description: 'Main AWS Lambda orchestrator triggered by S3 ObjectCreated events via EventBridge.',
    content: `"""
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
`
  },
  {
    path: 'src/textract_processor.py',
    name: 'textract_processor.py',
    language: 'python',
    description: 'AWS Textract wrapper handling AnalyzeDocument API, layout parsing, and key-value mapping.',
    content: `"""
DocuSense - AWS Textract Document Extraction Module
Wraps Boto3 Textract APIs for tables, form fields, and confidence scores.
"""
import logging
import boto3

logger = logging.getLogger(__name__)
textract_client = boto3.client("textract")


def analyze_document_with_textract(bucket_name: str, object_key: str) -> dict:
    """
    Executes synchronous AnalyzeDocument with TABLES and FORMS feature types.
    For multi-page PDFs exceeding synchronous limits (>1 page for images/PDFs in sync mode),
    production apps switch to start_document_analysis.
    """
    logger.info("Calling Textract analyze_document for s3://%s/%s", bucket_name, object_key)

    try:
        response = textract_client.analyze_document(
            Document={
                "S3Object": {
                    "Bucket": bucket_name,
                    "Name": object_key
                }
            },
            FeatureTypes=["TABLES", "FORMS", "LAYOUT"]
        )
    except textract_client.exceptions.UnsupportedDocumentException:
        # Fallback to DetectDocumentText for simple text
        logger.warning("AnalyzeDocument failed, falling back to detect_document_text")
        response = textract_client.detect_document_text(
            Document={"S3Object": {"Bucket": bucket_name, "Name": object_key}}
        )

    blocks = response.get("Blocks", [])
    
    # 1. Parse raw text lines and calculate average confidence
    lines = []
    total_conf = 0.0
    conf_count = 0

    block_map = {b["Id"]: b for b in blocks}

    for b in blocks:
        if b.get("BlockType") == "LINE":
            text = b.get("Text", "")
            lines.append(text)
            total_conf += b.get("Confidence", 0.0)
            conf_count += 1

    avg_confidence = round(total_conf / max(1, conf_count), 2)
    raw_text = "\\n".join(lines)

    # 2. Extract Key-Value Pairs from FORM blocks
    key_values = _extract_form_key_values(blocks, block_map)

    # 3. Extract Table structures
    tables = _extract_tables(blocks, block_map)

    return {
        "raw_text": raw_text,
        "key_values": key_values,
        "tables": tables,
        "avg_confidence": avg_confidence,
        "block_count": len(blocks)
    }


def _extract_form_key_values(blocks: list, block_map: dict) -> dict:
    """Extracts Key-Value entity pairs identified in Textract KEY_VALUE_SET blocks."""
    kvs = {}
    key_blocks = [b for b in blocks if b.get("BlockType") == "KEY_VALUE_SET" and "KEY" in b.get("EntityTypes", [])]

    for k_block in key_blocks:
        key_text = _get_text_for_block(k_block, block_map)
        val_text = ""

        # Find linked VALUE block via Relationships
        for rel in k_block.get("Relationships", []):
            if rel.get("Type") == "VALUE":
                for val_id in rel.get("Ids", []):
                    v_block = block_map.get(val_id)
                    if v_block:
                        val_text += _get_text_for_block(v_block, block_map) + " "

        clean_key = key_text.strip().rstrip(":")
        clean_val = val_text.strip()
        if clean_key and clean_val:
            kvs[clean_key] = clean_val

    return kvs


def _extract_tables(blocks: list, block_map: dict) -> list:
    """Extracts structured 2D table matrices."""
    tables = []
    table_blocks = [b for b in blocks if b.get("BlockType") == "TABLE"]

    for t_block in table_blocks:
        rows = {}
        for rel in t_block.get("Relationships", []):
            if rel.get("Type") == "CHILD":
                for cell_id in rel.get("Ids", []):
                    cell = block_map.get(cell_id)
                    if cell and cell.get("BlockType") == "CELL":
                        r_idx = cell.get("RowIndex", 1)
                        c_idx = cell.get("ColumnIndex", 1)
                        cell_text = _get_text_for_block(cell, block_map)
                        if r_idx not in rows:
                            rows[r_idx] = {}
                        rows[r_idx][c_idx] = cell_text

        table_data = []
        for r_idx in sorted(rows.keys()):
            row_cells = [rows[r_idx].get(c, "") for c in sorted(rows[r_idx].keys())]
            table_data.append(row_cells)

        if table_data:
            tables.append(table_data)

    return tables


def _get_text_for_block(block: dict, block_map: dict) -> str:
    """Recursively extracts text from child WORD blocks."""
    text = ""
    for rel in block.get("Relationships", []):
        if rel.get("Type") == "CHILD":
            for child_id in rel.get("Ids", []):
                word = block_map.get(child_id)
                if word and word.get("BlockType") == "WORD":
                    text += word.get("Text", "") + " "
    return text.strip()
`
  },
  {
    path: 'src/smart_tagger.py',
    name: 'smart_tagger.py',
    language: 'python',
    description: 'Auto-generation of smart tags (#invoice, #total, #receipt, etc.) and monetary entity parsing.',
    content: `"""
DocuSense - Smart Document Tagging & Entity Recognition
Analyzes OCR text and form fields to automatically generate searchable tags.
"""
import re
from typing import Dict, List, Set, Any


def generate_smart_tags(raw_text: str, key_values: Dict[str, str], filename: str) -> List[str]:
    """
    Evaluates linguistic markers, file naming patterns, and key-value pairs
    to auto-assign high-confidence tags with '#' prefix.
    """
    tags: Set[str] = set()
    content = f"{filename} {raw_text} {' '.join(key_values.keys())} {' '.join(key_values.values())}".lower()

    # 1. Invoice detection (#invoice)
    invoice_keywords = ["invoice", "inv-", "bill to", "remit to", "payment due", "terms: net"]
    if any(kw in content for kw in invoice_keywords):
        tags.add("#invoice")

    # 2. Receipt detection (#receipt)
    receipt_keywords = ["receipt", "cashier", "subtotal", "order summary", "store #", "tip:"]
    if any(kw in content for kw in receipt_keywords):
        tags.add("#receipt")

    # 3. Total amount detection (#total)
    total_keywords = ["total", "amount due", "balance due", "total charged", "grand total"]
    has_total_currency = re.search(r"[$€£]\\s*[0-9,]+\\.[0-9]{2}", raw_text)
    if any(kw in content for kw in total_keywords) or has_total_currency:
        tags.add("#total")

    # 4. Contract & Legal (#contract, #nda, #legal)
    contract_keywords = ["agreement", "by and between", "governing law", "jurisdiction", "in witness whereof"]
    if any(kw in content for kw in contract_keywords):
        tags.add("#contract")
        tags.add("#legal")

    if "non-disclosure" in content or "mutual nda" in content or "proprietary information" in content:
        tags.add("#nda")
        tags.add("#confidential")

    # 5. Tax & Compliance (#tax, #w9)
    if "internal revenue service" in content or "form w-9" in content or "taxpayer identification" in content:
        tags.add("#tax")
        tags.add("#compliance")

    # 6. Medical & Healthcare (#medical, #health)
    if "medical record" in content or "patient" in content or "clinic" in content or "physician" in content:
        tags.add("#medical")
        tags.add("#health")
        tags.add("#confidential")

    # 7. Vendor / Domain specific tags
    if "amazon web services" in content or "aws" in content:
        tags.add("#aws")
        tags.add("#cloud-ops")
    if "uber" in content or "lyft" in content or "airport" in content:
        tags.add("#travel")
        tags.add("#expense")
    if "starbucks" in content or "coffee" in content or "restaurant" in content:
        tags.add("#dining")
        tags.add("#expense")

    # 8. High-value tag
    monetary = extract_monetary_summary(raw_text, key_values)
    if monetary.get("total_amount", 0) > 1000.0:
        tags.add("#high-value")
        tags.add("#financial")

    if not tags:
        tags.add("#document")

    return sorted(list(tags))


def extract_monetary_summary(raw_text: str, key_values: Dict[str, str]) -> Dict[str, Any]:
    """
    Extracts numerical total amount, currency code, and vendor name.
    """
    total_amount = None
    currency = "USD"
    vendor = None

    # Check key-values first
    for k, v in key_values.items():
        k_low = k.lower()
        if any(term in k_low for term in ["total", "amount due", "balance"]):
            num_match = re.search(r"[0-9,]+\\.[0-9]{2}", v)
            if num_match:
                try:
                    total_amount = float(num_match.group().replace(",", ""))
                    break
                except ValueError:
                    pass

    # Regex scan for total line in raw text if not found
    if total_amount is None:
        total_line_match = re.search(r"(?:total|amount due|total charged)[^\\d\\n]*[$€£]?\\s*([0-9,]+\\.[0-9]{2})", raw_text, re.IGNORECASE)
        if total_line_match:
            try:
                total_amount = float(total_line_match.group(1).replace(",", ""))
            except ValueError:
                pass

    # Find potential vendor name from top of text
    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    if lines:
        vendor = lines[0][:50]

    return {
        "total_amount": total_amount,
        "currency": currency,
        "vendor": vendor
    }
`
  },
  {
    path: 'src/dynamodb_service.py',
    name: 'dynamodb_service.py',
    language: 'python',
    description: 'Amazon DynamoDB client handling document persistence, querying by tag, and metadata updates.',
    content: `"""
DocuSense - DynamoDB Storage Service
Provides atomic item creation and query methods for documents.
"""
import os
import logging
from decimal import Decimal
import boto3

logger = logging.getLogger(__name__)

TABLE_NAME = os.environ.get("DOCUMENTS_TABLE_NAME", "DocuSenseDocuments")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def _convert_floats_to_decimal(obj):
    """DynamoDB requires Decimal types rather than standard python floats."""
    if isinstance(obj, float):
        return Decimal(str(obj))
    elif isinstance(obj, dict):
        return {k: _convert_floats_to_decimal(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_convert_floats_to_decimal(v) for v in obj]
    return obj


def save_document_metadata(item: dict) -> None:
    """Stores a processed document record into DynamoDB."""
    logger.info("Saving document metadata to DynamoDB table: %s (id: %s)", TABLE_NAME, item.get("document_id"))
    sanitized_item = _convert_floats_to_decimal(item)
    table.put_item(Item=sanitized_item)


def get_document_metadata(document_id: str) -> dict:
    """Fetches a document item by partition key."""
    response = table.get_item(Key={"document_id": document_id})
    return response.get("Item", {})


def query_documents_by_tag(tag: str) -> list:
    """Queries documents with Global Secondary Index 'TagIndex'."""
    response = table.query(
        IndexName="TagIndex",
        KeyConditionExpression="tag = :t",
        ExpressionAttributeValues={":t": tag}
    )
    return response.get("Items", [])
`
  },
  {
    path: 'src/opensearch_indexer.py',
    name: 'opensearch_indexer.py',
    language: 'python',
    description: 'OpenSearch Service client with AWS SigV4 auth, BM25 indexing, and highlighted snippet search.',
    content: `"""
DocuSense - Amazon OpenSearch Full-Text & Highlight Search
Indexes raw OCR text and executes BM25 search queries with highlighted snippet extraction.
"""
import os
import logging
import boto3
from opensearchpy import OpenSearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth

logger = logging.getLogger(__name__)

OPENSEARCH_ENDPOINT = os.environ.get("OPENSEARCH_ENDPOINT", "search-docusense.us-east-1.es.amazonaws.com")
INDEX_NAME = "docusense-ocr-index"
REGION = os.environ.get("AWS_REGION", "us-east-1")


def get_opensearch_client() -> OpenSearch:
    """Initializes OpenSearch client authenticated with AWS IAM SigV4."""
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(
        credentials.access_key,
        credentials.secret_key,
        REGION,
        "es",
        session_token=credentials.token
    )

    return OpenSearch(
        hosts=[{"host": OPENSEARCH_ENDPOINT, "port": 443}],
        http_auth=awsauth,
        use_ssl=True,
        verify_certs=True,
        connection_class=RequestsHttpConnection
    )


def index_document_in_opensearch(document_id: str, document_body: dict) -> None:
    """Indexes a document for real-time full-text search."""
    client = get_opensearch_client()

    # Ensure index exists with appropriate mapping
    if not client.indices.exists(index=INDEX_NAME):
        client.indices.create(
            index=INDEX_NAME,
            body={
                "settings": {"number_of_shards": 1, "number_of_replicas": 1},
                "mappings": {
                    "properties": {
                        "document_id": {"type": "keyword"},
                        "file_name": {"type": "text"},
                        "raw_text": {"type": "text", "analyzer": "standard"},
                        "tags": {"type": "keyword"},
                        "vendor": {"type": "text"},
                        "total_amount": {"type": "float"},
                        "created_at": {"type": "date"}
                    }
                }
            }
        )

    response = client.index(
        index=INDEX_NAME,
        id=document_id,
        body=document_body,
        refresh=True
    )
    logger.info("OpenSearch index response: %s", response.get("result"))


def search_documents_with_snippets(query_text: str, tag_filter: str = None) -> list:
    """
    Searches documents using BM25 across raw_text and file_name,
    returning highlighted text snippets with <mark> tags.
    """
    client = get_opensearch_client()

    must_clauses = [
        {
            "multi_match": {
                "query": query_text,
                "fields": ["raw_text^2", "file_name", "vendor"],
                "fuzziness": "AUTO"
            }
        }
    ]

    if tag_filter:
        must_clauses.append({"term": {"tags": tag_filter}})

    body = {
        "query": {"bool": {"must": must_clauses}},
        "highlight": {
            "fields": {
                "raw_text": {
                    "fragment_size": 150,
                    "number_of_fragments": 3,
                    "pre_tags": ["<mark>"],
                    "post_tags": ["</mark>"]
                }
            }
        }
    }

    results = client.search(index=INDEX_NAME, body=body)
    hits = results.get("hits", {}).get("hits", [])

    formatted_matches = []
    for hit in hits:
        source = hit.get("_source", {})
        highlights = hit.get("highlight", {}).get("raw_text", [])
        formatted_matches.append({
            "document_id": source.get("document_id"),
            "file_name": source.get("file_name"),
            "score": hit.get("_score"),
            "snippets": highlights,
            "tags": source.get("tags", []),
            "total_amount": source.get("total_amount")
        })

    return formatted_matches
`
  },
  {
    path: 'src/presigned_url_generator.py',
    name: 'presigned_url_generator.py',
    language: 'python',
    description: 'Generates secure S3 presigned URLs for client-side direct uploads without exposing AWS credentials.',
    content: `"""
DocuSense - S3 Presigned URL Generator
Enables browsers and clients to upload directly to S3 with cryptographic presigned signatures.
"""
import os
import boto3
from botocore.exceptions import ClientError

s3_client = boto3.client("s3")
VAULT_BUCKET = os.environ.get("S3_VAULT_BUCKET", "docusense-production-vault-us-east-1")


def generate_upload_url(object_key: str, content_type: str = "application/pdf", expiration: int = 900) -> dict:
    """
    Generates a presigned PUT URL allowing clients to upload a document directly to S3.
    Default expiration is 15 minutes (900 seconds).
    """
    try:
        url = s3_client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": VAULT_BUCKET,
                "Key": object_key,
                "ContentType": content_type,
                "ServerSideEncryption": "aws:kms"
            },
            ExpiresIn=expiration,
            HttpMethod="PUT"
        )
        return {
            "upload_url": url,
            "bucket": VAULT_BUCKET,
            "key": object_key,
            "expires_in_seconds": expiration
        }
    except ClientError as e:
        return {"error": str(e)}


def generate_download_url(object_key: str, expiration: int = 3600) -> dict:
    """
    Generates a secure presigned GET URL for viewing or downloading original documents.
    """
    try:
        url = s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": VAULT_BUCKET,
                "Key": object_key
            },
            ExpiresIn=expiration
        )
        return {"download_url": url, "expires_in_seconds": expiration}
    except ClientError as e:
        return {"error": str(e)}
`
  },
  {
    path: 'template.yaml',
    name: 'template.yaml',
    language: 'yaml',
    description: 'AWS SAM / CloudFormation Infrastructure as Code template defining S3, Lambda, Textract, and DynamoDB.',
    content: `AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: >
  DocuSense Serverless Architecture - S3 Uploads, Textract OCR Extraction,
  Smart Tag Engine, DynamoDB Metadata Storage, and OpenSearch Search Engine.

Globals:
  Function:
    Timeout: 60
    MemorySize: 1024
    Runtime: python3.12
    Architectures:
      - arm64
    Environment:
      Variables:
        DOCUMENTS_TABLE_NAME: !Ref DocuSenseDocumentsTable
        OPENSEARCH_ENDPOINT: !GetAtt DocuSenseOpenSearchDomain.DomainEndpoint

Resources:
  # 1. Primary S3 Document Storage Vault
  DocuSenseVaultBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'docusense-production-vault-\${AWS::AccountId}-\${AWS::Region}'
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: aws:kms
      CorsConfiguration:
        CorsRules:
          - AllowedHeaders: ['*']
            AllowedMethods: [GET, PUT, POST, HEAD]
            AllowedOrigins: ['*']
            MaxAge: 3600
      NotificationConfiguration:
        EventBridgeConfiguration:
          EventBridgeEnabled: true

  # 2. Main Lambda Ingestion Function
  DocuSenseIngestWorker:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/
      Handler: lambda_handler.lambda_handler
      Policies:
        - S3ReadPolicy:
            BucketName: !Sub 'docusense-production-vault-\${AWS::AccountId}-\${AWS::Region}'
        - DynamoDBCrudPolicy:
            TableName: !Ref DocuSenseDocumentsTable
        - Statement:
            - Sid: AllowTextractOCR
              Effect: Allow
              Action:
                - textract:AnalyzeDocument
                - textract:DetectDocumentText
              Resource: '*'
            - Sid: AllowOpenSearchAccess
              Effect: Allow
              Action:
                - es:ESHttpPost
                - es:ESHttpPut
                - es:ESHttpGet
              Resource: !Sub 'arn:aws:es:\${AWS::Region}:\${AWS::AccountId}:domain/docusense-search/*'
      Events:
        S3NewDocumentUpload:
          Type: EventBridgeRule
          Properties:
            Pattern:
              source:
                - aws.s3
              detail-type:
                - Object Created
              detail:
                bucket:
                  name:
                    - !Ref DocuSenseVaultBucket

  # 3. DynamoDB Metadata & Tag Storage
  DocuSenseDocumentsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: DocuSenseDocuments
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: document_id
          AttributeType: S
        - AttributeName: created_at
          AttributeType: S
      KeySchema:
        - AttributeName: document_id
          KeyType: HASH
      GlobalSecondaryIndexes:
        - IndexName: CreatedAtIndex
          KeySchema:
            - AttributeName: created_at
              KeyType: HASH
          Projection:
            ProjectionType: ALL

  # 4. OpenSearch Domain for Full-Text Search
  DocuSenseOpenSearchDomain:
    Type: AWS::OpenSearchService::Domain
    Properties:
      DomainName: docusense-search
      EngineVersion: OpenSearch_2.11
      ClusterConfig:
        InstanceType: t3.small.search
        InstanceCount: 1
      EBSOptions:
        EBSEnabled: true
        VolumeType: gp3
        VolumeSize: 20
      NodeToNodeEncryptionOptions:
        Enabled: true
      EncryptionAtRestOptions:
        Enabled: true

Outputs:
  VaultBucketName:
    Description: S3 Vault Bucket for uploaded documents
    Value: !Ref DocuSenseVaultBucket
  IngestWorkerArn:
    Description: Lambda worker ARN
    Value: !GetAtt DocuSenseIngestWorker.Arn
  DynamoDBTableName:
    Description: DynamoDB Table Name
    Value: !Ref DocuSenseDocumentsTable
  OpenSearchEndpoint:
    Description: OpenSearch Domain Endpoint
    Value: !GetAtt DocuSenseOpenSearchDomain.DomainEndpoint
`
  },
  {
    path: 'requirements.txt',
    name: 'requirements.txt',
    language: 'text',
    description: 'Python package dependencies for Boto3, OpenSearch, and validation.',
    content: `boto3>=1.34.80
botocore>=1.34.80
opensearch-py>=2.4.2
requests>=2.31.0
requests-aws4auth>=1.2.3
pydantic>=2.7.0
python-dotenv>=1.0.1
`
  },
  {
    path: '.env.example',
    name: '.env.example',
    language: 'bash',
    description: 'Environment variable configuration template.',
    content: `# DocuSense AWS Backend Configuration
AWS_REGION=us-east-1
S3_VAULT_BUCKET=docusense-production-vault-us-east-1
DOCUMENTS_TABLE_NAME=DocuSenseDocuments
OPENSEARCH_ENDPOINT=search-docusense-search-xyz.us-east-1.es.amazonaws.com
`
  },
  {
    path: 'deploy.sh',
    name: 'deploy.sh',
    language: 'bash',
    description: 'Automated bash script for building and deploying the SAM application.',
    content: `#!/usr/bin/env bash
set -euo pipefail

echo "======================================================="
echo "   DocuSense Serverless AWS Pipeline Deployment        "
echo "======================================================="

# Verify AWS CLI and SAM CLI
command -v aws >/dev/null 2>&1 || { echo "AWS CLI is required but not installed."; exit 1; }
command -v sam >/dev/null 2>&1 || { echo "AWS SAM CLI is required but not installed."; exit 1; }

echo "[1/4] Validating AWS credentials..."
aws sts get-caller-identity

echo "[2/4] Building SAM artifacts..."
sam build --use-container

echo "[3/4] Deploying CloudFormation stack..."
sam deploy \\
  --stack-name docusense-ocr-stack \\
  --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \\
  --resolve-s3 \\
  --no-confirm-changeset

echo "[4/4] Deployment complete! Stack outputs:"
aws cloudformation describe-stacks \\
  --stack-name docusense-ocr-stack \\
  --query "Stacks[0].Outputs" \\
  --output table
`
  },
  {
    path: 'tests/test_pipeline.py',
    name: 'test_pipeline.py',
    language: 'python',
    description: 'Pytest unit test suite verifying OCR entity extraction and smart tagging.',
    content: `"""
DocuSense - Pytest Unit Test Suite
Verifies regex field extractors, smart tagging heuristics, and payload structures.
"""
import pytest
from src.smart_tagger import generate_smart_tags, extract_monetary_summary


def test_smart_tags_for_invoice():
    sample_invoice_text = """
    AMAZON WEB SERVICES, INC.
    INVOICE SUMMARY
    Invoice Number: INV-2026-9812
    Total Amount Due: $4,829.40 USD
    Payment Due: October 15, 2026
    """
    key_values = {"Invoice Number": "INV-2026-9812", "Total": "$4,829.40"}
    tags = generate_smart_tags(sample_invoice_text, key_values, "AWS_Invoice.pdf")

    assert "#invoice" in tags
    assert "#total" in tags
    assert "#aws" in tags
    assert "#high-value" in tags


def test_smart_tags_for_receipt():
    sample_receipt_text = """
    STARBUCKS STORE #14092
    Order: 4912
    Subtotal: $16.75
    Total Amount: $18.75 USD
    Cashier: John
    """
    key_values = {"Total Amount": "$18.75 USD"}
    tags = generate_smart_tags(sample_receipt_text, key_values, "Coffee_Receipt.jpg")

    assert "#receipt" in tags
    assert "#total" in tags
    assert "#dining" in tags


def test_monetary_summary_extraction():
    sample_text = "The balance due is $1,240.00 within 30 days."
    summary = extract_monetary_summary(sample_text, {})

    assert summary["total_amount"] == 1240.00
    assert summary["currency"] == "USD"
`
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    description: 'Complete architecture guide, local invocation commands, and API documentation.',
    content: `# DocuSense Python Boto3 Backend

DocuSense is a production-grade serverless document ingestion and OCR pipeline built with **AWS Boto3**, **AWS Textract**, **Amazon DynamoDB**, **Amazon OpenSearch**, and **Amazon S3**.

## Architecture Flow

1. **Client Browser / App**: Generates a presigned S3 URL and uploads the document directly to Amazon S3.
2. **Amazon EventBridge**: Captures the \`s3:ObjectCreated\` event and routes it to the Lambda worker.
3. **AWS Lambda Ingest Worker**:
   - Calls **AWS Textract** (\`analyze_document\`) with \`TABLES\`, \`FORMS\`, and \`LAYOUT\`.
   - Runs **Smart Tagging Engine** to classify into tags like \`#invoice\`, \`#total\`, \`#receipt\`, \`#contract\`.
   - Writes document metadata to **Amazon DynamoDB** (single-digit millisecond latency).
   - Indexes raw OCR tokens and metadata into **Amazon OpenSearch** for sub-second highlighted snippet search.

## Quickstart & Local Testing

\`\`\`bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run unit tests
pytest tests/

# 3. Test Lambda locally with sample event
sam local invoke DocuSenseIngestWorker -e tests/sample_s3_event.json
\`\`\`

## Deploying to AWS

\`\`\`bash
# Make deploy script executable
chmod +x deploy.sh

# Run automated deployment
./deploy.sh
\`\`\`
`
  }
];
