import { DocumentItem } from '../types/document';

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-aws-inv-9812',
    name: 'AWS_Invoice_INV-2026-9812.pdf',
    size: 245760, // 240 KB
    mimeType: 'application/pdf',
    s3Key: 'invoices/2026/09/AWS_Invoice_INV-2026-9812.pdf',
    s3Bucket: 'archivex-vault',
    s3Region: 'ap-southeast-2',
    storageClass: 'STANDARD',
    uploadedAt: '2026-09-22T14:32:00Z',
    status: 'ready',
    tags: ['#invoice', '#total', '#financial', '#tax', '#aws', '#cloud-ops'],
    summary: 'Monthly cloud infrastructure invoice from Amazon Web Services Inc. for production cluster compute, storage, and serverless invocations.',
    rawText: `AMAZON WEB SERVICES, INC.
INVOICE SUMMARY
Invoice Number: INV-2026-9812
Invoice Date: September 21, 2026
Payment Due Date: October 15, 2026
Account ID: 4819-2091-8841
Customer: ArchiveX Cloud Corp
Billing Address: 500 Howard Street, Suite 400, San Francisco, CA 94105

SERVICES BREAKDOWN:
1. Amazon Elastic Compute Cloud (EC2) - us-east-1
   m6i.2xlarge on-demand Linux instances (1,440 hours) - $1,843.20
2. Amazon Simple Storage Service (S3)
   Standard Storage (18.4 TB-Mo) & 2.4M PUT/GET Requests - $428.50
3. AWS Textract
   Document Analysis (Tables & Forms queries - 42,000 pages) - $2,100.00
4. Amazon OpenSearch Service
   Managed Cluster 3x r6g.large.search (720 hours) - $384.00
5. AWS Lambda & EventBridge
   4.2M invocations (1024 MB duration tier) - $73.70

Subtotal: $4,829.40
Estimated US Sales & Use Tax (0.00% exempt): $0.00
TOTAL AMOUNT DUE: $4,829.40 USD

Payment Method: Corporate ACH Auto-Pay (••••9102)
Status: Pending Settlement
Thank you for building on AWS.`,
    extracted: {
      documentType: 'Invoice',
      vendor: 'Amazon Web Services, Inc.',
      customer: 'ArchiveX Cloud Corp',
      date: '2026-09-21',
      dueDate: '2026-10-15',
      invoiceNumber: 'INV-2026-9812',
      totalAmount: 4829.40,
      currency: 'USD',
      subtotal: 4829.40,
      taxAmount: 0.00,
      ocrConfidence: 99.6,
      pageCount: 2,
      lineItems: [
        { id: 'li-aws-1', description: 'Amazon EC2 m6i.2xlarge compute', quantity: 1440, unitPrice: 1.28, total: 1843.20, category: 'Compute', cellIds: ['cell-aws-r2-c1', 'cell-aws-r2-c2', 'cell-aws-r2-c3', 'cell-aws-r2-c4'], confidence: 99.8, rowIndex: 2, tableId: 'tbl-aws-1' },
        { id: 'li-aws-2', description: 'Amazon S3 Standard Storage & Requests', quantity: 1, unitPrice: 428.50, total: 428.50, category: 'Storage', cellIds: ['cell-aws-r3-c1', 'cell-aws-r3-c2', 'cell-aws-r3-c3', 'cell-aws-r3-c4'], confidence: 99.7, rowIndex: 3, tableId: 'tbl-aws-1' },
        { id: 'li-aws-3', description: 'AWS Textract Document Analysis (42k pages)', quantity: 42000, unitPrice: 0.05, total: 2100.00, category: 'Machine Learning', cellIds: ['cell-aws-r4-c1', 'cell-aws-r4-c2', 'cell-aws-r4-c3', 'cell-aws-r4-c4'], confidence: 99.9, rowIndex: 4, tableId: 'tbl-aws-1' },
        { id: 'li-aws-4', description: 'Amazon OpenSearch Managed Cluster', quantity: 720, unitPrice: 0.533, total: 384.00, category: 'Search & Analytics', cellIds: ['cell-aws-r5-c1', 'cell-aws-r5-c2', 'cell-aws-r5-c3', 'cell-aws-r5-c4'], confidence: 99.5, rowIndex: 5, tableId: 'tbl-aws-1' },
        { id: 'li-aws-5', description: 'AWS Lambda & EventBridge Invocations', quantity: 4200000, unitPrice: 0.0000175, total: 73.70, category: 'Serverless', cellIds: ['cell-aws-r6-c1', 'cell-aws-r6-c2', 'cell-aws-r6-c3', 'cell-aws-r6-c4'], confidence: 99.6, rowIndex: 6, tableId: 'tbl-aws-1' }
      ],
      entities: [
        { label: 'Vendor', value: 'Amazon Web Services, Inc.', confidence: 0.99 },
        { label: 'Invoice Number', value: 'INV-2026-9812', confidence: 0.99 },
        { label: 'Total Due', value: ',829.40 USD', confidence: 0.99 },
        { label: 'Due Date', value: 'October 15, 2026', confidence: 0.98 },
        { label: 'Account ID', value: '4819-2091-8841', confidence: 0.97 }
      ]
    },
    textractBlocks: [
      { id: 'b-1', blockType: 'LINE', text: 'AMAZON WEB SERVICES, INC.', confidence: 99.8, geometry: { boundingBox: { width: 0.45, height: 0.04, left: 0.08, top: 0.07 } } },
      { id: 'b-2', blockType: 'LINE', text: 'Invoice Number: INV-2026-9812', confidence: 99.4, geometry: { boundingBox: { width: 0.35, height: 0.03, left: 0.08, top: 0.12 } } },
      { id: 'b-3', blockType: 'LINE', text: 'Payment Due Date: October 15, 2026', confidence: 98.9, geometry: { boundingBox: { width: 0.38, height: 0.03, left: 0.08, top: 0.16 } } },
      { id: 'b-4', blockType: 'LINE', text: 'Customer: ArchiveX Cloud Corp', confidence: 99.1, geometry: { boundingBox: { width: 0.36, height: 0.03, left: 0.08, top: 0.20 } } },
      {
        id: 'tbl-aws-1',
        blockType: 'TABLE',
        confidence: 99.7,
        geometry: { boundingBox: { width: 0.86, height: 0.42, left: 0.08, top: 0.26 } },
        relationships: [
          {
            type: 'CHILD',
            ids: [
              'cell-aws-h1', 'cell-aws-h2', 'cell-aws-h3', 'cell-aws-h4',
              'cell-aws-r2-c1', 'cell-aws-r2-c2', 'cell-aws-r2-c3', 'cell-aws-r2-c4',
              'cell-aws-r3-c1', 'cell-aws-r3-c2', 'cell-aws-r3-c3', 'cell-aws-r3-c4',
              'cell-aws-r4-c1', 'cell-aws-r4-c2', 'cell-aws-r4-c3', 'cell-aws-r4-c4',
              'cell-aws-r5-c1', 'cell-aws-r5-c2', 'cell-aws-r5-c3', 'cell-aws-r5-c4',
              'cell-aws-r6-c1', 'cell-aws-r6-c2', 'cell-aws-r6-c3', 'cell-aws-r6-c4'
            ]
          }
        ]
      },
      // Header Cells
      { id: 'cell-aws-h1', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 1, columnIndex: 1, text: 'Service / Resource Description', confidence: 99.8, entityTypes: ['COLUMN_HEADER'], geometry: { boundingBox: { left: 0.08, top: 0.26, width: 0.35, height: 0.03 } } },
      { id: 'cell-aws-h2', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 1, columnIndex: 2, text: 'Usage Units', confidence: 99.9, entityTypes: ['COLUMN_HEADER'], geometry: { boundingBox: { left: 0.44, top: 0.26, width: 0.12, height: 0.03 } } },
      { id: 'cell-aws-h3', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 1, columnIndex: 3, text: 'Unit Rate ($)', confidence: 99.7, entityTypes: ['COLUMN_HEADER'], geometry: { boundingBox: { left: 0.58, top: 0.26, width: 0.14, height: 0.03 } } },
      { id: 'cell-aws-h4', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 1, columnIndex: 4, text: 'Line Total ($)', confidence: 99.9, entityTypes: ['COLUMN_HEADER'], geometry: { boundingBox: { left: 0.74, top: 0.26, width: 0.16, height: 0.03 } } },
      // Row 2: EC2
      { id: 'cell-aws-r2-c1', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 2, columnIndex: 1, text: 'Amazon EC2 m6i.2xlarge compute', confidence: 99.8, geometry: { boundingBox: { left: 0.08, top: 0.30, width: 0.35, height: 0.03 } } },
      { id: 'cell-aws-r2-c2', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 2, columnIndex: 2, text: '1,440 hrs', confidence: 99.9, geometry: { boundingBox: { left: 0.44, top: 0.30, width: 0.12, height: 0.03 } } },
      { id: 'cell-aws-r2-c3', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 2, columnIndex: 3, text: '$1.28', confidence: 99.7, geometry: { boundingBox: { left: 0.58, top: 0.30, width: 0.14, height: 0.03 } } },
      { id: 'cell-aws-r2-c4', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 2, columnIndex: 4, text: '$1,843.20', confidence: 99.9, geometry: { boundingBox: { left: 0.74, top: 0.30, width: 0.16, height: 0.03 } } },
      // Row 3: S3
      { id: 'cell-aws-r3-c1', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 3, columnIndex: 1, text: 'Amazon S3 Standard Storage & Requests', confidence: 99.7, geometry: { boundingBox: { left: 0.08, top: 0.34, width: 0.35, height: 0.03 } } },
      { id: 'cell-aws-r3-c2', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 3, columnIndex: 2, text: '1', confidence: 99.9, geometry: { boundingBox: { left: 0.44, top: 0.34, width: 0.12, height: 0.03 } } },
      { id: 'cell-aws-r3-c3', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 3, columnIndex: 3, text: '$428.50', confidence: 99.6, geometry: { boundingBox: { left: 0.58, top: 0.34, width: 0.14, height: 0.03 } } },
      { id: 'cell-aws-r3-c4', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 3, columnIndex: 4, text: '$428.50', confidence: 99.8, geometry: { boundingBox: { left: 0.74, top: 0.34, width: 0.16, height: 0.03 } } },
      // Row 4: Textract
      { id: 'cell-aws-r4-c1', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 4, columnIndex: 1, text: 'AWS Textract Document Analysis (42k pages)', confidence: 99.9, geometry: { boundingBox: { left: 0.08, top: 0.38, width: 0.35, height: 0.03 } } },
      { id: 'cell-aws-r4-c2', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 4, columnIndex: 2, text: '42,000', confidence: 99.9, geometry: { boundingBox: { left: 0.44, top: 0.38, width: 0.12, height: 0.03 } } },
      { id: 'cell-aws-r4-c3', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 4, columnIndex: 3, text: '$0.05', confidence: 99.8, geometry: { boundingBox: { left: 0.58, top: 0.38, width: 0.14, height: 0.03 } } },
      { id: 'cell-aws-r4-c4', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 4, columnIndex: 4, text: '$2,100.00', confidence: 99.9, geometry: { boundingBox: { left: 0.74, top: 0.38, width: 0.16, height: 0.03 } } },
      // Row 5: OpenSearch
      { id: 'cell-aws-r5-c1', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 5, columnIndex: 1, text: 'Amazon OpenSearch Managed Cluster', confidence: 99.5, geometry: { boundingBox: { left: 0.08, top: 0.42, width: 0.35, height: 0.03 } } },
      { id: 'cell-aws-r5-c2', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 5, columnIndex: 2, text: '720', confidence: 99.8, geometry: { boundingBox: { left: 0.44, top: 0.42, width: 0.12, height: 0.03 } } },
      { id: 'cell-aws-r5-c3', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 5, columnIndex: 3, text: '$0.533', confidence: 99.4, geometry: { boundingBox: { left: 0.58, top: 0.42, width: 0.14, height: 0.03 } } },
      { id: 'cell-aws-r5-c4', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 5, columnIndex: 4, text: '$384.00', confidence: 99.8, geometry: { boundingBox: { left: 0.74, top: 0.42, width: 0.16, height: 0.03 } } },
      // Row 6: Lambda
      { id: 'cell-aws-r6-c1', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 6, columnIndex: 1, text: 'AWS Lambda & EventBridge Invocations', confidence: 99.6, geometry: { boundingBox: { left: 0.08, top: 0.46, width: 0.35, height: 0.03 } } },
      { id: 'cell-aws-r6-c2', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 6, columnIndex: 2, text: '4,200,000', confidence: 99.9, geometry: { boundingBox: { left: 0.44, top: 0.46, width: 0.12, height: 0.03 } } },
      { id: 'cell-aws-r6-c3', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 6, columnIndex: 3, text: '$0.0000175', confidence: 99.5, geometry: { boundingBox: { left: 0.58, top: 0.46, width: 0.14, height: 0.03 } } },
      { id: 'cell-aws-r6-c4', blockType: 'CELL', tableId: 'tbl-aws-1', rowIndex: 6, columnIndex: 4, text: '$73.70', confidence: 99.9, geometry: { boundingBox: { left: 0.74, top: 0.46, width: 0.16, height: 0.03 } } },
      // Footer Total
      { id: 'b-6', blockType: 'LINE', text: 'TOTAL AMOUNT DUE: $4,829.40 USD', confidence: 99.9, geometry: { boundingBox: { width: 0.42, height: 0.04, left: 0.50, top: 0.68 } } }
    ],
    metrics: {
      s3UploadMs: 118,
      textractOcrMs: 780,
      totalLatencyMs: 898
    },
    thumbnailColor: 'from-amber-500/20 to-orange-600/20'
  },
  {
    id: 'doc-uber-rec-4250',
    name: 'Uber_Receipt_Trip_Sep2026.png',
    size: 184320, // 180 KB
    mimeType: 'image/png',
    s3Key: 'receipts/2026/09/Uber_Receipt_Trip_Sep2026.png',
    s3Bucket: 'archivex-vault',
    s3Region: 'ap-southeast-2',
    storageClass: 'STANDARD',
    uploadedAt: '2026-09-20T19:15:00Z',
    status: 'ready',
    tags: ['#receipt', '#total', '#transport', '#expense', '#travel'],
    summary: 'Uber ride receipt from San Francisco International Airport (SFO) to downtown hotel, expensed for engineering on-site.',
    rawText: `Uber Technologies Inc.
TRIP RECEIPT
Trip Date: September 18, 2026 5:45 PM
Rider: Anand Raj
Driver: Marcus J. (Toyota Prius)

TRIP DETAILS:
Pickup: Terminal 2, San Francisco International Airport (SFO)
Dropoff: 780 Mission Street, San Francisco, CA 94103
Distance: 14.2 miles | Duration: 28 mins

FARE BREAKDOWN:
Trip Fare: $32.20
Airport Surcharge & Toll: $4.80
City Regulatory Fee: $1.50
Driver Tip: $4.00

Total Charged: $42.50 USD
Payment: Apple Pay (Visa ending in 4242)
Receipt ID: uber-sfo-tx-99214
Visit uber.com/help for questions regarding this receipt.`,
    extracted: {
      documentType: 'Receipt',
      vendor: 'Uber Technologies Inc.',
      customer: 'Anand Raj',
      date: '2026-09-18',
      totalAmount: 42.50,
      currency: 'USD',
      subtotal: 38.50,
      taxAmount: 0.00,
      ocrConfidence: 98.8,
      pageCount: 1,
      lineItems: [
        { id: 'li-uber-1', description: 'UberX Trip Fare SFO to Mission St', quantity: 1, unitPrice: 32.20, total: 32.20, category: 'Transportation Fare', cellIds: ['cell-u-r2-c1', 'cell-u-r2-c2', 'cell-u-r2-c3', 'cell-u-r2-c4'], confidence: 99.4, rowIndex: 2, tableId: 'tbl-uber-1' },
        { id: 'li-uber-2', description: 'Airport Surcharge & Toll', quantity: 1, unitPrice: 4.80, total: 4.80, category: 'Airport Fee', cellIds: ['cell-u-r3-c1', 'cell-u-r3-c2', 'cell-u-r3-c3', 'cell-u-r3-c4'], confidence: 99.1, rowIndex: 3, tableId: 'tbl-uber-1' },
        { id: 'li-uber-3', description: 'City Regulatory Fee', quantity: 1, unitPrice: 1.50, total: 1.50, category: 'Municipal Fee', cellIds: ['cell-u-r4-c1', 'cell-u-r4-c2', 'cell-u-r4-c3', 'cell-u-r4-c4'], confidence: 98.7, rowIndex: 4, tableId: 'tbl-uber-1' },
        { id: 'li-uber-4', description: 'Driver Tip', quantity: 1, unitPrice: 4.00, total: 4.00, category: 'Gratuity', cellIds: ['cell-u-r5-c1', 'cell-u-r5-c2', 'cell-u-r5-c3', 'cell-u-r5-c4'], confidence: 99.8, rowIndex: 5, tableId: 'tbl-uber-1' }
      ],
      entities: [
        { label: 'Merchant', value: 'Uber Technologies Inc.', confidence: 0.99 },
        { label: 'Total Amount', value: '$42.50 USD', confidence: 0.99 },
        { label: 'Payment Card', value: 'Visa •••• 4242', confidence: 0.96 },
        { label: 'Trip Origin', value: 'SFO Terminal 2', confidence: 0.95 }
      ]
    },
    textractBlocks: [
      { id: 'u-1', blockType: 'LINE', text: 'Uber Technologies Inc. TRIP RECEIPT', confidence: 99.2, geometry: { boundingBox: { width: 0.50, height: 0.04, left: 0.10, top: 0.08 } } },
      { id: 'u-2', blockType: 'LINE', text: 'Pickup: Terminal 2, San Francisco International Airport', confidence: 97.9, geometry: { boundingBox: { width: 0.65, height: 0.03, left: 0.10, top: 0.22 } } },
      {
        id: 'tbl-uber-1',
        blockType: 'TABLE',
        confidence: 99.4,
        geometry: { boundingBox: { width: 0.84, height: 0.32, left: 0.08, top: 0.35 } },
        relationships: [
          {
            type: 'CHILD',
            ids: [
              'cell-u-h1', 'cell-u-h2', 'cell-u-h3', 'cell-u-h4',
              'cell-u-r2-c1', 'cell-u-r2-c2', 'cell-u-r2-c3', 'cell-u-r2-c4',
              'cell-u-r3-c1', 'cell-u-r3-c2', 'cell-u-r3-c3', 'cell-u-r3-c4',
              'cell-u-r4-c1', 'cell-u-r4-c2', 'cell-u-r4-c3', 'cell-u-r4-c4',
              'cell-u-r5-c1', 'cell-u-r5-c2', 'cell-u-r5-c3', 'cell-u-r5-c4'
            ]
          }
        ]
      },
      // Header
      { id: 'cell-u-h1', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 1, columnIndex: 1, text: 'Fare Item Description', confidence: 99.6, entityTypes: ['COLUMN_HEADER'], geometry: { boundingBox: { left: 0.08, top: 0.35, width: 0.40, height: 0.03 } } },
      { id: 'cell-u-h2', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 1, columnIndex: 2, text: 'Quantity', confidence: 99.8, entityTypes: ['COLUMN_HEADER'], geometry: { boundingBox: { left: 0.50, top: 0.35, width: 0.10, height: 0.03 } } },
      { id: 'cell-u-h3', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 1, columnIndex: 3, text: 'Unit Rate ($)', confidence: 99.5, entityTypes: ['COLUMN_HEADER'], geometry: { boundingBox: { left: 0.62, top: 0.35, width: 0.12, height: 0.03 } } },
      { id: 'cell-u-h4', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 1, columnIndex: 4, text: 'Line Total ($)', confidence: 99.9, entityTypes: ['COLUMN_HEADER'], geometry: { boundingBox: { left: 0.76, top: 0.35, width: 0.16, height: 0.03 } } },
      // Row 2: Trip Fare
      { id: 'cell-u-r2-c1', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 2, columnIndex: 1, text: 'UberX Trip Fare SFO to Mission St', confidence: 99.4, geometry: { boundingBox: { left: 0.08, top: 0.39, width: 0.40, height: 0.03 } } },
      { id: 'cell-u-r2-c2', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 2, columnIndex: 2, text: '1', confidence: 99.9, geometry: { boundingBox: { left: 0.50, top: 0.39, width: 0.10, height: 0.03 } } },
      { id: 'cell-u-r2-c3', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 2, columnIndex: 3, text: '$32.20', confidence: 99.5, geometry: { boundingBox: { left: 0.62, top: 0.39, width: 0.12, height: 0.03 } } },
      { id: 'cell-u-r2-c4', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 2, columnIndex: 4, text: '$32.20', confidence: 99.8, geometry: { boundingBox: { left: 0.76, top: 0.39, width: 0.16, height: 0.03 } } },
      // Row 3: Airport surcharge
      { id: 'cell-u-r3-c1', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 3, columnIndex: 1, text: 'Airport Surcharge & Toll', confidence: 99.1, geometry: { boundingBox: { left: 0.08, top: 0.43, width: 0.40, height: 0.03 } } },
      { id: 'cell-u-r3-c2', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 3, columnIndex: 2, text: '1', confidence: 99.9, geometry: { boundingBox: { left: 0.50, top: 0.43, width: 0.10, height: 0.03 } } },
      { id: 'cell-u-r3-c3', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 3, columnIndex: 3, text: '$4.80', confidence: 99.3, geometry: { boundingBox: { left: 0.62, top: 0.43, width: 0.12, height: 0.03 } } },
      { id: 'cell-u-r3-c4', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 3, columnIndex: 4, text: '$4.80', confidence: 99.7, geometry: { boundingBox: { left: 0.76, top: 0.43, width: 0.16, height: 0.03 } } },
      // Row 4: City fee
      { id: 'cell-u-r4-c1', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 4, columnIndex: 1, text: 'City Regulatory Fee', confidence: 98.7, geometry: { boundingBox: { left: 0.08, top: 0.47, width: 0.40, height: 0.03 } } },
      { id: 'cell-u-r4-c2', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 4, columnIndex: 2, text: '1', confidence: 99.9, geometry: { boundingBox: { left: 0.50, top: 0.47, width: 0.10, height: 0.03 } } },
      { id: 'cell-u-r4-c3', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 4, columnIndex: 3, text: '$1.50', confidence: 99.1, geometry: { boundingBox: { left: 0.62, top: 0.47, width: 0.12, height: 0.03 } } },
      { id: 'cell-u-r4-c4', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 4, columnIndex: 4, text: '$1.50', confidence: 99.6, geometry: { boundingBox: { left: 0.76, top: 0.47, width: 0.16, height: 0.03 } } },
      // Row 5: Tip
      { id: 'cell-u-r5-c1', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 5, columnIndex: 1, text: 'Driver Tip', confidence: 99.5, geometry: { boundingBox: { left: 0.08, top: 0.51, width: 0.40, height: 0.03 } } },
      { id: 'cell-u-r5-c2', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 5, columnIndex: 2, text: '1', confidence: 99.9, geometry: { boundingBox: { left: 0.50, top: 0.51, width: 0.10, height: 0.03 } } },
      { id: 'cell-u-r5-c3', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 5, columnIndex: 3, text: '$4.00', confidence: 99.8, geometry: { boundingBox: { left: 0.62, top: 0.51, width: 0.12, height: 0.03 } } },
      { id: 'cell-u-r5-c4', blockType: 'CELL', tableId: 'tbl-uber-1', rowIndex: 5, columnIndex: 4, text: '$4.00', confidence: 99.9, geometry: { boundingBox: { left: 0.76, top: 0.51, width: 0.16, height: 0.03 } } },
      { id: 'u-3', blockType: 'LINE', text: 'Total Charged: $42.50 USD', confidence: 99.8, geometry: { boundingBox: { width: 0.40, height: 0.04, left: 0.10, top: 0.58 } } }
    ],
    metrics: {
      s3UploadMs: 95,
      textractOcrMs: 640,
      totalLatencyMs: 735
    },
    thumbnailColor: 'from-emerald-500/20 to-teal-600/20'
  },
  {
    id: 'doc-techcorp-nda',
    name: 'TechCorp_Mutual_NDA_Signed.pdf',
    size: 512000, // 500 KB
    mimeType: 'application/pdf',
    s3Key: 'contracts/2026/09/TechCorp_Mutual_NDA_Signed.pdf',
    s3Bucket: 'archivex-vault',
    s3Region: 'ap-southeast-2',
    storageClass: 'STANDARD',
    uploadedAt: '2026-09-15T11:20:00Z',
    status: 'ready',
    tags: ['#contract', '#nda', '#legal', '#confidential', '#partnerships'],
    summary: 'Bilateral Mutual Non-Disclosure Agreement between TechCorp Labs Inc. and Apex Innovations Inc. covering confidential AI model weights and algorithms.',
    rawText: `MUTUAL NON-DISCLOSURE AGREEMENT
This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of September 15, 2026 ("Effective Date") by and between:
Party A: TechCorp Labs Inc., a Delaware corporation ("TechCorp")
Party B: Apex Innovations Inc., a California corporation ("Apex")

1. PURPOSE
The parties wish to explore a potential strategic business relationship regarding proprietary document machine learning models, cloud pipeline architectures, and OCR data extraction pipelines ("Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" means all non-public, confidential or proprietary information disclosed by one party ("Disclosing Party") to the other party ("Receiving Party"), whether orally or in writing, including without limitation source code, AI embeddings, customer datasets, and business plans.

3. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to:
(a) Protect Confidential Information with the same degree of care it uses for its own confidential information, but in no event less than reasonable care;
(b) Not disclose Confidential Information to any third party without prior written consent;
(c) Restrict disclosure solely to employees, contractors, and legal advisors who need to know.

4. TERM AND SURVIVAL
This Agreement shall remain in effect for three (3) years from the Effective Date. The confidentiality obligations shall survive termination for a period of five (5) years.

5. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of laws principles.

IN WITNESS WHEREOF, the parties have executed this Agreement by their authorized representatives:
TechCorp Labs Inc. - Signed by Elena Vance (Chief Technology Officer)
Apex Innovations Inc. - Signed by David K. Chen (VP of Engineering)`,
    extracted: {
      documentType: 'Contract',
      vendor: 'TechCorp Labs Inc.',
      customer: 'Apex Innovations Inc.',
      date: '2026-09-15',
      ocrConfidence: 99.4,
      pageCount: 4,
      lineItems: [],
      entities: [
        { label: 'Agreement Type', value: 'Mutual Non-Disclosure Agreement', confidence: 0.99 },
        { label: 'Party A', value: 'TechCorp Labs Inc. (Delaware)', confidence: 0.99 },
        { label: 'Party B', value: 'Apex Innovations Inc. (California)', confidence: 0.99 },
        { label: 'Effective Date', value: 'September 15, 2026', confidence: 0.98 },
        { label: 'Governing Law', value: 'State of Delaware', confidence: 0.97 },
        { label: 'Survival Period', value: '5 Years', confidence: 0.96 }
      ]
    },
    textractBlocks: [
      { id: 'n-1', blockType: 'LINE', text: 'MUTUAL NON-DISCLOSURE AGREEMENT', confidence: 99.9, geometry: { boundingBox: { width: 0.58, height: 0.04, left: 0.21, top: 0.06 } } },
      { id: 'n-2', blockType: 'LINE', text: 'Party A: TechCorp Labs Inc. / Party B: Apex Innovations Inc.', confidence: 98.7, geometry: { boundingBox: { width: 0.65, height: 0.03, left: 0.10, top: 0.15 } } },
      { id: 'n-3', blockType: 'LINE', text: 'Governing Law: State of Delaware', confidence: 99.1, geometry: { boundingBox: { width: 0.40, height: 0.03, left: 0.10, top: 0.62 } } }
    ],
    metrics: {
      s3UploadMs: 140,
      textractOcrMs: 1240,
      totalLatencyMs: 1380
    },
    thumbnailColor: 'from-blue-500/20 to-indigo-600/20'
  },
  {
    id: 'doc-starbucks-rec',
    name: 'Starbucks_Coffee_Itemized_Receipt.jpg',
    size: 131072, // 128 KB
    mimeType: 'image/jpeg',
    s3Key: 'receipts/2026/09/Starbucks_Coffee_Itemized_Receipt.jpg',
    s3Bucket: 'archivex-vault',
    s3Region: 'ap-southeast-2',
    storageClass: 'STANDARD',
    uploadedAt: '2026-09-22T08:30:00Z',
    status: 'ready',
    tags: ['#receipt', '#total', '#dining', '#expense'],
    summary: 'Itemized breakfast & morning coffee receipt from Starbucks Store #14092 in Financial District.',
    rawText: `STARBUCKS COFFEE STORE #14092
Market & 4th Street, San Francisco CA
Order: 591028 | Cashier: Sarah M.
Date: 09/22/2026 08:24 AM

ITEMS:
1 Grande Iced Caramel Macchiato - $5.75
  * Extra Oat Milk ($0.80)
1 Venti Cold Brew with Sweet Cream - $5.95
1 Butter Croissant (Warmed) - $4.25

Subtotal: $16.75
Sales Tax (8.625% SF): $1.45
Tip: $0.55
TOTAL AMOUNT: $18.75 USD

Card: Chase Sapphire Preferred (Visa •••• 1084)
Approved Auth: 08912A
Earned 37 Starbucks Stars!
Save trees: Digital receipts available at starbucks.com`,
    extracted: {
      documentType: 'Receipt',
      vendor: 'Starbucks Coffee',
      date: '2026-09-22',
      totalAmount: 18.75,
      currency: 'USD',
      subtotal: 16.75,
      taxAmount: 1.45,
      ocrConfidence: 98.5,
      pageCount: 1,
      lineItems: [
        { description: 'Grande Iced Caramel Macchiato (Oat)', quantity: 1, unitPrice: 6.55, total: 6.55 },
        { description: 'Venti Cold Brew with Sweet Cream', quantity: 1, unitPrice: 5.95, total: 5.95 },
        { description: 'Butter Croissant (Warmed)', quantity: 1, unitPrice: 4.25, total: 4.25 }
      ],
      entities: [
        { label: 'Merchant', value: 'Starbucks Coffee #14092', confidence: 0.99 },
        { label: 'Total Amount', value: '$18.75 USD', confidence: 0.99 },
        { label: 'Tax', value: '$1.45', confidence: 0.97 },
        { label: 'Payment Card', value: 'Visa •••• 1084', confidence: 0.96 }
      ]
    },
    textractBlocks: [
      { id: 'sb-1', blockType: 'LINE', text: 'STARBUCKS COFFEE STORE #14092', confidence: 99.5, geometry: { boundingBox: { width: 0.52, height: 0.04, left: 0.12, top: 0.09 } } },
      { id: 'sb-2', blockType: 'LINE', text: 'TOTAL AMOUNT: $18.75 USD', confidence: 99.9, geometry: { boundingBox: { width: 0.45, height: 0.04, left: 0.12, top: 0.65 } } }
    ],
    metrics: {
      s3UploadMs: 78,
      textractOcrMs: 510,
      totalLatencyMs: 588
    },
    thumbnailColor: 'from-amber-600/20 to-yellow-600/20'
  },
  {
    id: 'doc-kaiser-med',
    name: 'Kaiser_Health_Clinical_Summary.pdf',
    size: 389120, // 380 KB
    mimeType: 'application/pdf',
    s3Key: 'medical/2026/08/Kaiser_Health_Clinical_Summary.pdf',
    s3Bucket: 'archivex-vault',
    s3Region: 'ap-southeast-2',
    storageClass: 'INTELLIGENT_TIERING',
    uploadedAt: '2026-08-28T16:00:00Z',
    status: 'ready',
    tags: ['#medical', '#health', '#records', '#confidential', '#hipaa'],
    summary: 'Clinical consultation and laboratory summary from Kaiser Permanente medical center regarding annual biometric screening.',
    rawText: `KAISER PERMANENTE MEDICAL CARE PROGRAM
OUTPATIENT CLINICAL ENCOUNTER SUMMARY
Medical Record Number (MRN): KP-8842-1940
Encounter Date: August 28, 2026
Attending Physician: Dr. Aris Thorne, MD (Internal Medicine)
Department: Adult Primary Care Clinic, Redwood City Medical Center

PATIENT VITALS:
Blood Pressure: 118/76 mmHg (Normotensive)
Pulse / Heart Rate: 68 bpm (Regular sinus rhythm)
BMI: 22.4 kg/m² | Temperature: 98.4°F

LABORATORY RESULTS (COMPREHENSIVE METABOLIC PANEL):
- Fasting Glucose: 88 mg/dL [Normal Reference 70 - 99 mg/dL]
- Total Cholesterol: 172 mg/dL [Desirable < 200 mg/dL]
- HDL Cholesterol: 62 mg/dL [Optimal > 50 mg/dL]
- LDL Cholesterol: 94 mg/dL [Optimal < 100 mg/dL]
- Serum Creatinine: 0.9 mg/dL [Normal Reference 0.7 - 1.2 mg/dL]
- Vitamin D (25-OH): 44 ng/mL [Sufficiency > 30 ng/mL]

ASSESSMENT & PLAN:
Patient demonstrates overall excellent cardiovascular and metabolic health indicators. Routine wellness recommendations discussed: maintenance of Mediterranean dietary pattern and 150 minutes weekly aerobic activity.
Follow-up: Routine annual exam scheduled for August 2027.

CONFIDENTIAL MEDICAL DOCUMENT - PROTECTED UNDER HIPAA REGULATIONS`,
    extracted: {
      documentType: 'Medical',
      vendor: 'Kaiser Permanente Medical Center',
      customer: 'Patient Record KP-8842-1940',
      date: '2026-08-28',
      ocrConfidence: 99.7,
      pageCount: 2,
      lineItems: [],
      entities: [
        { label: 'Facility', value: 'Kaiser Permanente Redwood City', confidence: 0.99 },
        { label: 'Physician', value: 'Dr. Aris Thorne, MD', confidence: 0.99 },
        { label: 'Encounter Type', value: 'Annual Wellness Exam', confidence: 0.98 },
        { label: 'Blood Pressure', value: '118/76 mmHg', confidence: 0.97 },
        { label: 'Fasting Glucose', value: '88 mg/dL', confidence: 0.99 }
      ]
    },
    textractBlocks: [
      { id: 'kp-1', blockType: 'LINE', text: 'KAISER PERMANENTE MEDICAL CARE PROGRAM', confidence: 99.8, geometry: { boundingBox: { width: 0.62, height: 0.04, left: 0.10, top: 0.07 } } },
      { id: 'kp-2', blockType: 'LINE', text: 'Medical Record Number: KP-8842-1940', confidence: 99.2, geometry: { boundingBox: { width: 0.45, height: 0.03, left: 0.10, top: 0.13 } } }
    ],
    metrics: {
      s3UploadMs: 122,
      textractOcrMs: 910,
      totalLatencyMs: 1032
    },
    thumbnailColor: 'from-teal-500/20 to-cyan-600/20'
  },
  {
    id: 'doc-w9-tax-miller',
    name: 'W9_Tax_Form_Independent_Contractor.pdf',
    size: 298000, // 290 KB
    mimeType: 'application/pdf',
    s3Key: 'tax/2026/01/W9_Tax_Form_Independent_Contractor.pdf',
    s3Bucket: 'archivex-vault',
    s3Region: 'ap-southeast-2',
    storageClass: 'STANDARD',
    uploadedAt: '2026-09-02T10:14:00Z',
    status: 'ready',
    tags: ['#tax', '#identity', '#w9', '#legal', '#compliance'],
    summary: 'IRS Form W-9 Request for Taxpayer Identification Number and Certification for independent consulting contractor.',
    rawText: `Form W-9 (Rev. March 2024)
Department of the Treasury - Internal Revenue Service
Request for Taxpayer Identification Number and Certification

1. Name (as shown on your income tax return): Alex Miller
2. Business name/disregarded entity name: Miller Cloud Architecture LLC
3. Federal tax classification:
   [X] Limited Liability Company (LLC) - Classified as Single Member LLC
4. Exemptions: Exempt payee code: None
5. Address: 1200 Pine Street, Suite 3B, Austin, TX 78701

PART I - TAXPAYER IDENTIFICATION NUMBER (TIN)
Employer Identification Number (EIN): XX-XXX4918

PART II - CERTIFICATION
Under penalties of perjury, I certify that:
1. The number shown on this form is my correct taxpayer identification number.
2. I am not subject to backup withholding because I have not been notified by the IRS.
3. I am a U.S. citizen or other U.S. person.
4. The FATCA code(s) entered on this form indicating exemption are correct.

Signature of U.S. Person: Alex Miller (Electronically Signed)
Date: January 14, 2026`,
    extracted: {
      documentType: 'Tax Form',
      vendor: 'IRS / Miller Cloud Architecture LLC',
      customer: 'Alex Miller',
      date: '2026-01-14',
      ocrConfidence: 99.5,
      pageCount: 1,
      lineItems: [],
      entities: [
        { label: 'Form Type', value: 'IRS Form W-9', confidence: 0.99 },
        { label: 'Taxpayer Name', value: 'Alex Miller', confidence: 0.99 },
        { label: 'Entity Name', value: 'Miller Cloud Architecture LLC', confidence: 0.99 },
        { label: 'Classification', value: 'Single Member LLC', confidence: 0.98 },
        { label: 'TIN / EIN Masked', value: 'XX-XXX4918', confidence: 0.97 }
      ]
    },
    textractBlocks: [
      { id: 'w9-1', blockType: 'LINE', text: 'Form W-9 Request for Taxpayer Identification Number', confidence: 99.7, geometry: { boundingBox: { width: 0.65, height: 0.04, left: 0.10, top: 0.06 } } }
    ],
    metrics: {
      s3UploadMs: 110,
      textractOcrMs: 820,
      totalLatencyMs: 930
    },
    thumbnailColor: 'from-purple-500/20 to-violet-600/20'
  },
  {
    id: 'doc-datadog-inv',
    name: 'Datadog_Monitoring_SaaS_Invoice.pdf',
    size: 210000,
    mimeType: 'application/pdf',
    s3Key: 'invoices/2026/09/Datadog_Monitoring_SaaS_Invoice.pdf',
    s3Bucket: 'archivex-vault',
    s3Region: 'ap-southeast-2',
    storageClass: 'STANDARD',
    uploadedAt: '2026-09-19T13:45:00Z',
    status: 'ready',
    tags: ['#invoice', '#total', '#saas', '#financial', '#devops'],
    summary: 'Monthly recurring subscription invoice for Datadog cloud infrastructure metrics, APM tracing, and log management.',
    rawText: `DATADOG, INC.
620 8th Avenue, 45th Floor, New York, NY 10018
INVOICE: DD-901249
Billing Period: August 1 - August 31, 2026
Issue Date: September 1, 2026
Due Date: October 1, 2026
Billed To: ArchiveX Engineering Team

PRODUCTS & USAGE:
1. Pro Host Infrastructure Monitoring (45 Hosts @ $15/host) - $675.00
2. APM Distributed Tracing (15 APM Hosts @ $31/host) - $465.00
3. Log Management & Ingestion (0.5 TB retained for 15 days) - $100.00

Subtotal: $1,240.00
Tax: $0.00
TOTAL AMOUNT DUE: $1,240.00 USD

Payment Status: Auto-Charged to Corporate Amex (•••• 3004)
Thank you for monitoring with Datadog!`,
    extracted: {
      documentType: 'Invoice',
      vendor: 'Datadog, Inc.',
      customer: 'ArchiveX Engineering Team',
      date: '2026-09-01',
      dueDate: '2026-10-01',
      invoiceNumber: 'DD-901249',
      totalAmount: 1240.00,
      currency: 'USD',
      subtotal: 1240.00,
      taxAmount: 0.00,
      ocrConfidence: 99.6,
      pageCount: 1,
      lineItems: [
        { description: 'Pro Host Infrastructure Monitoring (45 Hosts)', quantity: 45, unitPrice: 15.00, total: 675.00 },
        { description: 'APM Distributed Tracing (15 Hosts)', quantity: 15, unitPrice: 31.00, total: 465.00 },
        { description: 'Log Management & Ingestion (0.5 TB)', quantity: 1, unitPrice: 100.00, total: 100.00 }
      ],
      entities: [
        { label: 'Vendor', value: 'Datadog, Inc.', confidence: 0.99 },
        { label: 'Invoice Number', value: 'DD-901249', confidence: 0.99 },
        { label: 'Total Due', value: '$1,240.00 USD', confidence: 0.99 }
      ]
    },
    textractBlocks: [
      { id: 'dd-1', blockType: 'LINE', text: 'DATADOG, INC. INVOICE: DD-901249', confidence: 99.8, geometry: { boundingBox: { width: 0.55, height: 0.04, left: 0.10, top: 0.08 } } },
      { id: 'dd-2', blockType: 'LINE', text: 'TOTAL AMOUNT DUE: $1,240.00 USD', confidence: 99.9, geometry: { boundingBox: { width: 0.42, height: 0.04, left: 0.50, top: 0.65 } } }
    ],
    metrics: {
      s3UploadMs: 102,
      textractOcrMs: 690,
      totalLatencyMs: 792
    },
    thumbnailColor: 'from-purple-600/20 to-pink-600/20'
  }
];
