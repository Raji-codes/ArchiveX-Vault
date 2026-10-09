"""
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
