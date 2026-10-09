"""
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
