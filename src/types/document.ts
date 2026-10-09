export interface ExtractedField {
  label: string;
  value: string | number;
  confidence: number;
}

export interface LineItem {
  id?: string;
  itemCode?: string;
  description: string;
  quantity?: number;
  unitPrice?: number;
  total: number;
  category?: string;
  cellIds?: string[];
  tableId?: string;
  rowIndex?: number;
  confidence?: number;
}

export interface TextractRelationship {
  type: 'CHILD' | 'VALUE' | 'COMPLEX_FEATURES';
  ids: string[];
}

export interface TextractBlock {
  id: string;
  blockType: 'PAGE' | 'LINE' | 'WORD' | 'KEY_VALUE_SET' | 'TABLE' | 'CELL';
  text?: string;
  confidence?: number;
  geometry: {
    boundingBox: {
      width: number;
      height: number;
      left: number;
      top: number;
    };
  };
  entityType?: 'KEY' | 'VALUE';
  entityTypes?: ('KEY' | 'VALUE' | 'COLUMN_HEADER' | 'TABLE_TITLE' | 'TABLE_FOOTER')[];
  rowIndex?: number;
  columnIndex?: number;
  rowSpan?: number;
  columnSpan?: number;
  relationships?: TextractRelationship[];
  tableId?: string;
  cellIds?: string[];
}

export interface DocumentMetrics {
  s3UploadMs: number;
  textractOcrMs: number;
  totalLatencyMs: number;
}

export interface ExtractedMetadata {
  documentType: 'Invoice' | 'Receipt' | 'Contract' | 'Tax Form' | 'Medical' | 'General';
  vendor?: string;
  customer?: string;
  date?: string;
  dueDate?: string;
  totalAmount?: number;
  currency?: string;
  taxAmount?: number;
  subtotal?: number;
  invoiceNumber?: string;
  lineItems: LineItem[];
  entities: ExtractedField[];
  pageCount: number;
  ocrConfidence: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  s3Key: string;
  s3Bucket: string;
  s3Region: string;
  storageClass: 'STANDARD' | 'INTELLIGENT_TIERING' | 'GLACIER_IR';
  uploadedAt: string;
  status: 'ready' | 'processing' | 'uploading' | 'error';
  currentPhase?: string;
  progress?: number;
  tags: string[];
  rawText: string;
  summary: string;
  extracted: ExtractedMetadata;
  textractBlocks: TextractBlock[];
  metrics: DocumentMetrics;
  thumbnailColor: string;
  previewUrl?: string;
}

export interface SearchMatch {
  documentId: string;
  document: DocumentItem;
  matchesIn: ('title' | 'tags' | 'ocr_text' | 'vendor' | 'amount' | 'invoice_number')[];
  snippets: {
    field: string;
    snippet: string;
    matchCount: number;
  }[];
  totalScore: number;
}

export interface PipelineNode {
  id: string;
  name: string;
  awsService: string;
  role: string;
  status: 'idle' | 'active' | 'success' | 'error';
  latencyAvgMs: number;
  iconName: string;
  color: string;
  iamRoleName: string;
  iamPolicy: string;
  samplePayload: Record<string, any>;
  metrics: {
    invocations: string;
    p95Latency: string;
    errorRate: string;
    throughput: string;
  };
}
