"""
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
