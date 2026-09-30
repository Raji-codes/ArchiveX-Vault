import { DocumentItem, ExtractedMetadata, TextractBlock, LineItem } from '../types/document';

interface ProcessingCallback {
  onPhaseChange?: (phase: string, progress: number) => void;
}

export async function processDocumentUpload(
  file: File,
  callbacks?: ProcessingCallback
): Promise<DocumentItem> {
  const fileContent = await readFileAsTextOrFallback(file);
  
  // Phase 1: S3 Upload Simulation
  callbacks?.onPhaseChange?.('Generating S3 Presigned URL & PUT to s3://archivex-vault...', 15);
  await delay(350);

  // Phase 2: EventBridge routing
  callbacks?.onPhaseChange?.('EventBridge matching s3:ObjectCreated filter -> Triggering Lambda...', 35);
  await delay(250);

  // Phase 3: Textract OCR extraction
  callbacks?.onPhaseChange?.('AWS Textract AnalyzeDocument running (TABLES, FORMS, LAYOUT)...', 65);
  await delay(600);

  // Parse text & extract fields
  const extracted = extractFieldsFromText(fileContent, file.name);
  const tags = generateSmartTags(extracted, fileContent, file.name);
  const textractBlocks = generateSimulatedBlocks(fileContent, extracted.lineItems);

  // Phase 4: DynamoDB & OpenSearch
  callbacks?.onPhaseChange?.('Persisting DynamoDB metadata & indexing in OpenSearch cluster...', 90);
  await delay(300);

  callbacks?.onPhaseChange?.('Ingestion pipeline complete! Document indexed & searchable.', 100);
  await delay(150);

  const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
  const prefix = tags.includes('#invoice') ? 'invoices' : tags.includes('#receipt') ? 'receipts' : tags.includes('#contract') ? 'contracts' : 'documents';

  const doc: DocumentItem = {
    id: docId,
    name: file.name,
    size: file.size,
    mimeType: file.type || 'application/octet-stream',
    s3Key: `${prefix}/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${file.name}`,
    s3Bucket: 'archivex-vault',
    s3Region: 'ap-southeast-2',
    storageClass: 'STANDARD',
    uploadedAt: new Date().toISOString(),
    status: 'ready',
    tags,
    rawText: fileContent,
    summary: generateDocumentSummary(extracted, file.name),
    extracted,
    textractBlocks,
    metrics: {
      s3UploadMs: Math.floor(80 + Math.random() * 50),
      lambdaWorkerMs: Math.floor(30 + Math.random() * 20),
      textractOcrMs: Math.floor(550 + Math.random() * 400),
      dynamoDbWriteMs: Math.floor(10 + Math.random() * 8),
      openSearchIndexMs: Math.floor(20 + Math.random() * 15),
      totalLatencyMs: 0
    },
    thumbnailColor: pickColorForTags(tags)
  };

  doc.metrics.totalLatencyMs = 
    doc.metrics.s3UploadMs + 
    doc.metrics.lambdaWorkerMs + 
    doc.metrics.textractOcrMs + 
    doc.metrics.dynamoDbWriteMs + 
    doc.metrics.openSearchIndexMs;

  return doc;
}

export function generateSmartTags(
  extracted: ExtractedMetadata,
  text: string,
  fileName: string
): string[] {
  const tags = new Set<string>();
  const lowerText = (text + ' ' + fileName).toLowerCase();

  // Primary document category tags
  if (lowerText.includes('invoice') || lowerText.includes('inv-') || lowerText.includes('bill to') || lowerText.includes('due date')) {
    tags.add('#invoice');
  }
  if (lowerText.includes('receipt') || lowerText.includes('cashier') || lowerText.includes('order summary') || lowerText.includes('store #') || lowerText.includes('tip')) {
    tags.add('#receipt');
  }
  if (extracted.totalAmount !== undefined || lowerText.includes('total') || lowerText.includes('amount due') || lowerText.includes('subtotal')) {
    tags.add('#total');
  }
  if (lowerText.includes('contract') || lowerText.includes('agreement') || lowerText.includes('parties') || lowerText.includes('governing law')) {
    tags.add('#contract');
  }
  if (lowerText.includes('nda') || lowerText.includes('non-disclosure') || lowerText.includes('proprietary')) {
    tags.add('#nda');
    tags.add('#confidential');
  }
  if (lowerText.includes('tax') || lowerText.includes('w-9') || lowerText.includes('w9') || lowerText.includes('irs') || lowerText.includes('ein')) {
    tags.add('#tax');
    tags.add('#compliance');
  }
  if (lowerText.includes('medical') || lowerText.includes('clinic') || lowerText.includes('doctor') || lowerText.includes('patient') || lowerText.includes('hospital') || lowerText.includes('prescription')) {
    tags.add('#medical');
    tags.add('#health');
    tags.add('#confidential');
  }
  if (lowerText.includes('aws') || lowerText.includes('amazon web services')) {
    tags.add('#aws');
    tags.add('#cloud-ops');
  }
  if (lowerText.includes('uber') || lowerText.includes('lyft') || lowerText.includes('flight') || lowerText.includes('airline') || lowerText.includes('hotel')) {
    tags.add('#travel');
    tags.add('#expense');
  }
  if (lowerText.includes('coffee') || lowerText.includes('starbucks') || lowerText.includes('restaurant') || lowerText.includes('cafe')) {
    tags.add('#dining');
    tags.add('#expense');
  }

  // Financial threshold tags
  if (extracted.totalAmount && extracted.totalAmount > 1000) {
    tags.add('#high-value');
    tags.add('#financial');
  } else if (extracted.totalAmount && extracted.totalAmount > 0) {
    tags.add('#expense');
  }

  // Fallbacks if nothing detected
  if (tags.size === 0) {
    tags.add('#document');
    tags.add('#scanned');
  }

  return Array.from(tags);
}

export function extractFieldsFromText(text: string, fileName: string): ExtractedMetadata {
  const lower = text.toLowerCase();
  
  // Detect Document Type
  let documentType: ExtractedMetadata['documentType'] = 'General';
  if (lower.includes('invoice') || lower.includes('bill to') || fileName.toLowerCase().includes('invoice')) {
    documentType = 'Invoice';
  } else if (lower.includes('receipt') || lower.includes('store #') || fileName.toLowerCase().includes('receipt')) {
    documentType = 'Receipt';
  } else if (lower.includes('agreement') || lower.includes('contract') || lower.includes('non-disclosure')) {
    documentType = 'Contract';
  } else if (lower.includes('tax') || lower.includes('w-9') || lower.includes('irs')) {
    documentType = 'Tax Form';
  } else if (lower.includes('medical') || lower.includes('patient') || lower.includes('clinical') || lower.includes('prescription')) {
    documentType = 'Medical';
  }

  // Extract Total Amount
  // Pattern: Total:? [$£€]?\s*([0-9,]+\.[0-9]{2})
  let totalAmount: number | undefined;
  const totalMatches = [
    /(?:total|amount due|total charged|total amount)[\s:]*[$£€]?\s*([0-9,]+\.[0-9]{2})/i,
    /[$£€]\s*([0-9,]+\.[0-9]{2})/g
  ];

  const primaryMatch = text.match(totalMatches[0]);
  if (primaryMatch && primaryMatch[1]) {
    totalAmount = parseFloat(primaryMatch[1].replace(/,/g, ''));
  } else {
    // Look for largest currency figure
    const allAmounts: number[] = [];
    let match;
    const regex = /[$£€]\s*([0-9,]+\.[0-9]{2})/g;
    while ((match = regex.exec(text)) !== null) {
      allAmounts.push(parseFloat(match[1].replace(/,/g, '')));
    }
    if (allAmounts.length > 0) {
      totalAmount = Math.max(...allAmounts);
    }
  }

  // Extract Invoice Number
  let invoiceNumber: string | undefined;
  const invMatch = text.match(/(?:invoice\s*(?:#|num|number|no\.?)|inv\s*#?)[\s:]*([A-Za-z0-9\-]+)/i);
  if (invMatch) {
    invoiceNumber = invMatch[1];
  }

  // Extract Date
  let date: string | undefined;
  const dateMatch = text.match(/(?:date|issued|dated)[\s:]*([A-Za-z]+\s+\d{1,2},?\s+\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4})/i);
  if (dateMatch) {
    date = dateMatch[1];
  } else {
    date = new Date().toISOString().split('T')[0];
  }

  // Extract Due Date
  let dueDate: string | undefined;
  const dueMatch = text.match(/(?:due date|payment due)[\s:]*([A-Za-z]+\s+\d{1,2},?\s+\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4})/i);
  if (dueMatch) {
    dueDate = dueMatch[1];
  }

  // Extract Vendor / Organization
  let vendor: string | undefined;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length > 0) {
    // First non-empty line is often vendor
    vendor = lines[0].substring(0, 45);
  }

  // Extract Line Items
  const lineItems: LineItem[] = [];
  const lineItemRegex = /(\d+)\s+([A-Za-z0-9\s\-–]+?)\s*[-–$]\s*[$]?([0-9,]+\.[0-9]{2})/g;
  let liMatch;
  while ((liMatch = lineItemRegex.exec(text)) !== null && lineItems.length < 6) {
    lineItems.push({
      description: liMatch[2].trim(),
      quantity: parseInt(liMatch[1], 10),
      unitPrice: parseFloat(liMatch[3].replace(/,/g, '')),
      total: parseFloat(liMatch[3].replace(/,/g, ''))
    });
  }

  return {
    documentType,
    vendor,
    date,
    dueDate,
    invoiceNumber,
    totalAmount,
    currency: 'USD',
    ocrConfidence: Number((97 + Math.random() * 2.8).toFixed(1)),
    pageCount: 1,
    lineItems,
    entities: [
      ...(vendor ? [{ label: 'Vendor / Org', value: vendor, confidence: 0.98 }] : []),
      ...(invoiceNumber ? [{ label: 'Invoice #', value: invoiceNumber, confidence: 0.99 }] : []),
      ...(totalAmount ? [{ label: 'Total Amount', value: `$${totalAmount.toFixed(2)} USD`, confidence: 0.99 }] : []),
      ...(date ? [{ label: 'Document Date', value: date, confidence: 0.97 }] : []),
      ...(dueDate ? [{ label: 'Due Date', value: dueDate, confidence: 0.96 }] : [])
    ]
  };
}

function generateDocumentSummary(extracted: ExtractedMetadata, fileName: string): string {
  if (extracted.documentType === 'Invoice') {
    return `Invoice ${extracted.invoiceNumber || ''} from ${extracted.vendor || 'Vendor'} totaling $${extracted.totalAmount?.toFixed(2) || '0.00'} due on ${extracted.dueDate || 'scheduled date'}.`;
  }
  if (extracted.documentType === 'Receipt') {
    return `Receipt from ${extracted.vendor || 'Merchant'} for $${extracted.totalAmount?.toFixed(2) || '0.00'} on ${extracted.date || 'transaction date'}.`;
  }
  if (extracted.documentType === 'Contract') {
    return `Legal contract agreement document involving ${extracted.vendor || 'the parties'} dated ${extracted.date || 'execution date'}.`;
  }
  if (extracted.documentType === 'Tax Form') {
    return `Official tax compliance record for ${extracted.customer || extracted.vendor || 'taxpayer entity'}.`;
  }
  return `Processed document ${fileName} containing ${extracted.entities.length} identified entity fields.`;
}

function generateSimulatedBlocks(text: string, lineItems: LineItem[] = []): TextractBlock[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const blocks: TextractBlock[] = [];

  const maxLines = Math.min(lines.length, 18);
  for (let i = 0; i < maxLines; i++) {
    const top = 0.05 + (i * 0.05);
    blocks.push({
      id: `blk-${i}`,
      blockType: 'LINE',
      text: lines[i],
      confidence: Number((98.5 + Math.random() * 1.4).toFixed(1)),
      geometry: {
        boundingBox: {
          width: Math.min(0.85, 0.2 + (lines[i].length * 0.012)),
          height: 0.035,
          left: 0.08,
          top
        }
      }
    });
  }

  // Synthesize Textract TABLE and CELL hierarchy if line items exist
  if (lineItems.length > 0) {
    const tableId = `tbl-${Date.now().toString(36)}`;
    const childCellIds: string[] = [];

    // Header cells (RowIndex: 1)
    const headerCols = ['Description / Service', 'Quantity', 'Unit Rate', 'Line Total'];
    headerCols.forEach((colName, colIdx) => {
      const cellId = `cell-h-${colIdx + 1}`;
      childCellIds.push(cellId);
      blocks.push({
        id: cellId,
        blockType: 'CELL',
        tableId,
        rowIndex: 1,
        columnIndex: colIdx + 1,
        rowSpan: 1,
        columnSpan: 1,
        text: colName,
        confidence: 99.8,
        entityTypes: ['COLUMN_HEADER'],
        geometry: {
          boundingBox: {
            left: 0.08 + (colIdx * 0.21),
            top: 0.35,
            width: 0.20,
            height: 0.03
          }
        }
      });
    });

    // Data row cells (RowIndex: 2..N)
    lineItems.forEach((item, rowIdx) => {
      const r = rowIdx + 2;
      const cell1 = `cell-r${r}-c1`;
      const cell2 = `cell-r${r}-c2`;
      const cell3 = `cell-r${r}-c3`;
      const cell4 = `cell-r${r}-c4`;
      childCellIds.push(cell1, cell2, cell3, cell4);

      item.id = item.id || `li-${Date.now()}-${rowIdx}`;
      item.tableId = tableId;
      item.rowIndex = r;
      item.cellIds = [cell1, cell2, cell3, cell4];
      item.confidence = Number((98.8 + Math.random() * 1.1).toFixed(1));

      const rowTop = 0.39 + (rowIdx * 0.04);

      blocks.push({
        id: cell1,
        blockType: 'CELL',
        tableId,
        rowIndex: r,
        columnIndex: 1,
        text: item.description,
        confidence: item.confidence,
        geometry: { boundingBox: { left: 0.08, top: rowTop, width: 0.35, height: 0.035 } }
      });

      blocks.push({
        id: cell2,
        blockType: 'CELL',
        tableId,
        rowIndex: r,
        columnIndex: 2,
        text: String(item.quantity || 1),
        confidence: 99.9,
        geometry: { boundingBox: { left: 0.45, top: rowTop, width: 0.12, height: 0.035 } }
      });

      blocks.push({
        id: cell3,
        blockType: 'CELL',
        tableId,
        rowIndex: r,
        columnIndex: 3,
        text: `$${(item.unitPrice || 0).toFixed(2)}`,
        confidence: 99.5,
        geometry: { boundingBox: { left: 0.59, top: rowTop, width: 0.14, height: 0.035 } }
      });

      blocks.push({
        id: cell4,
        blockType: 'CELL',
        tableId,
        rowIndex: r,
        columnIndex: 4,
        text: `$${item.total.toFixed(2)}`,
        confidence: 99.9,
        geometry: { boundingBox: { left: 0.75, top: rowTop, width: 0.15, height: 0.035 } }
      });
    });

    // Root TABLE block
    blocks.push({
      id: tableId,
      blockType: 'TABLE',
      confidence: 99.6,
      geometry: {
        boundingBox: {
          left: 0.08,
          top: 0.35,
          width: 0.84,
          height: 0.04 + (lineItems.length * 0.04)
        }
      },
      relationships: [
        {
          type: 'CHILD',
          ids: childCellIds
        }
      ]
    });
  }

  return blocks;
}

function pickColorForTags(tags: string[]): string {
  if (tags.includes('#invoice')) return 'from-amber-500/20 to-orange-600/20';
  if (tags.includes('#receipt')) return 'from-emerald-500/20 to-teal-600/20';
  if (tags.includes('#contract') || tags.includes('#nda')) return 'from-blue-500/20 to-indigo-600/20';
  if (tags.includes('#medical')) return 'from-cyan-500/20 to-blue-600/20';
  if (tags.includes('#tax')) return 'from-purple-500/20 to-violet-600/20';
  return 'from-slate-500/20 to-slate-700/20';
}

async function readFileAsTextOrFallback(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  
  if (['txt', 'json', 'csv', 'md', 'log'].includes(ext || '')) {
    try {
      const text = await file.text();
      if (text && text.trim().length > 0) return text;
    } catch {
      // fallback
    }
  }

  // If it is an image or PDF, we generate realistic OCR text tailored to the filename
  const cleanName = file.name.replace(/[_\-.]/g, ' ');
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  if (file.name.toLowerCase().includes('invoice') || file.name.toLowerCase().includes('bill')) {
    const invNum = Math.floor(1000 + Math.random() * 9000);
    const amount = (Math.random() * 1500 + 120).toFixed(2);
    return `COMMERCIAL INVOICE
Invoice Number: INV-2026-${invNum}
Date: ${dateStr}
Due Date: Net 30 Days
Vendor: CloudScale Networks Ltd.
Client: ArchiveX Cloud Corp

ITEMIZED CHARGES:
1 Cloud Dedicated Bandwidth Tier 1 - $${(Number(amount) * 0.65).toFixed(2)}
2 Managed Firewall & DDoS Protection - $${(Number(amount) * 0.35).toFixed(2)}

Subtotal: $${amount}
Estimated Tax: $0.00
TOTAL AMOUNT DUE: $${amount} USD
Remit payment via Wire Transfer or Corporate ACH.`;
  }

  if (file.name.toLowerCase().includes('receipt')) {
    const recAmount = (Math.random() * 60 + 12).toFixed(2);
    return `EXPENSE RECEIPT
Merchant: Blue Bottle Coffee & Roastery
Store Location: Mint Plaza, San Francisco, CA
Date: ${dateStr}
Cashier: Register #2

1 Single Origin Espresso Pour-Over - $6.50
1 Avocado Sourdough Toast - $12.00
Subtotal: $18.50
Tax: $1.60
TOTAL CHARGED: $${recAmount} USD
Payment Method: Apple Pay / Mastercard (•••• 8821)
Thank you for your business!`;
  }

  // General document format
  return `OFFICIAL DOCUMENT: ${file.name.toUpperCase()}
Processed by ArchiveX Discovery Engine
File Name: ${file.name}
File Size: ${(file.size / 1024).toFixed(1)} KB
Ingestion Timestamp: ${new Date().toISOString()}

EXECUTIVE SUMMARY:
This document was ingested into ArchiveX and analyzed using deep OCR text extraction.
Document identified with high confidence. All text tokens normalized and stored in discovery index.

Key Values Identified:
- Document Reference: ${cleanName}
- Status: Verified & Encrypted
- Discovery Index: High Precision`;
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
