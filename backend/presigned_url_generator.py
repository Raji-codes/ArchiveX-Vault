"""
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
