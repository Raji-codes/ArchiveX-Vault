"""
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
