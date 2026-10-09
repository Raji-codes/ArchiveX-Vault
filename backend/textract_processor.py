"""
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
