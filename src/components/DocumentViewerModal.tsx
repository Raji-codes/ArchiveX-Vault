import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Tag as TagIcon, 
  Code, 
  Table, 
  ZoomIn,
  ZoomOut,
  Maximize2,
  BoxSelect,
  Save,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DocumentItem, LineItem } from '../types/document';
import { highlightText } from '../utils/searchHighlight';
import { LineItemsInspector } from './LineItemsInspector';

interface DocumentViewerModalProps {
  document: DocumentItem | null;
  searchQuery: string;
  onClose: () => void;
  onUpdateTags: (documentId: string, newTags: string[]) => void;
  onUpdateMetadata?: (documentId: string, updatedExtracted: Partial<DocumentItem['extracted']>) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  searchQuery,
  onClose,
  onUpdateTags,
  onUpdateMetadata
}) => {
  if (!document) return null;

  const [activeTab, setActiveTab] = useState<'fields' | 'line-items' | 'tags' | 'ocr' | 'json' | 'metadata'>('fields');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(null);

  // Editable fields state
  const [vendor, setVendor] = useState(document.extracted.vendor || '');
  const [invoiceNumber, setInvoiceNumber] = useState(document.extracted.invoiceNumber || '');
  const [totalAmount, setTotalAmount] = useState(document.extracted.totalAmount !== undefined ? String(document.extracted.totalAmount) : '');
  const [docDate, setDocDate] = useState(document.extracted.date || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopyText = () => {
    navigator.clipboard.writeText(document.rawText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(document.textractBlocks, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([document.rawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.name.replace(/\.[^/.]+$/, "")}_OCR.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveFields = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateMetadata) {
      onUpdateMetadata(document.id, {
        vendor: vendor.trim() || undefined,
        invoiceNumber: invoiceNumber.trim() || undefined,
        totalAmount: totalAmount.trim() ? parseFloat(totalAmount) : undefined,
        date: docDate.trim() || undefined
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    let tag = newTagInput.trim();
    if (!tag) return;
    if (!tag.startsWith('#')) tag = '#' + tag;
    if (!document.tags.includes(tag)) {
      onUpdateTags(document.id, [...document.tags, tag]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTags(
      document.id,
      document.tags.filter(t => t !== tagToRemove)
    );
  };

  const lineItemsCount = document.extracted.lineItems?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-6xl h-[92vh] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white truncate" title={document.name}>
                  {document.name}
                </h2>
                <span className="text-[11px] font-mono text-slate-400">
                  ({document.extracted.documentType})
                </span>
                {lineItemsCount > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 hidden sm:inline-block">
                    {lineItemsCount} Itemized Rows
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                s3://{document.s3Bucket}/{document.s3Key}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export OCR</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          
          {/* Left Column: Document Canvas & OCR Bounding Boxes */}
          <div className="lg:col-span-5 bg-slate-950 p-4 border-r border-slate-800 flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-300">Document Canvas</span>
                <span className="text-[11px] font-mono text-slate-500">
                  Page 1 of {document.extracted.pageCount}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded">
                  <button 
                    onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-1 text-[11px] font-mono text-slate-400 tabular-nums">
                    {zoomLevel}%
                  </span>
                  <button 
                    onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                    showBoundingBoxes 
                      ? 'bg-slate-800 text-blue-400 border-blue-500/40' 
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <BoxSelect className="w-3 h-3 inline mr-1" />
                  <span>Boxes</span>
                </button>
              </div>
            </div>

            {/* Document Canvas Display */}
            <div className="flex-1 overflow-y-auto mt-3 rounded border border-slate-800 bg-slate-900 p-4 select-text">
              <div 
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }} 
                className="transition-transform duration-100 font-mono text-xs leading-relaxed space-y-2 text-slate-300"
              >
                {/* Visual Bounding Box Elements */}
                {document.textractBlocks.map((blk) => {
                  const isHighlighted = highlightedBlockId === blk.id;
                  const isTable = blk.blockType === 'TABLE';
                  const isCell = blk.blockType === 'CELL';

                  return (
                    <div 
                      key={blk.id}
                      className={`relative p-1 rounded transition-all group ${
                        isHighlighted
                          ? 'border-2 border-amber-400 bg-amber-400/25 ring-2 ring-amber-400/60 shadow-lg shadow-amber-500/20'
                          : isTable
                            ? 'border-2 border-purple-500/50 bg-purple-950/20 p-2 my-2'
                            : isCell
                              ? 'border border-cyan-500/30 bg-cyan-950/10 text-cyan-200'
                              : showBoundingBoxes 
                                ? 'border border-blue-500/30 bg-blue-500/5 hover:border-blue-400' 
                                : ''
                      }`}
                    >
                      {showBoundingBoxes && (
                        <span className={`absolute -top-2 right-1 text-[8px] px-1 rounded transition-opacity ${
                          isHighlighted
                            ? 'bg-amber-500 text-slate-950 font-bold opacity-100'
                            : isTable
                              ? 'bg-purple-800 text-purple-200 opacity-100'
                              : isCell
                                ? 'bg-cyan-900 text-cyan-300 opacity-80'
                                : 'bg-slate-800 text-slate-400 opacity-0 group-hover:opacity-100'
                        }`}>
                          {blk.blockType}: {blk.confidence}%
                        </span>
                      )}
                      
                      {isTable ? (
                        <div className="text-purple-300 font-semibold text-xs flex items-center gap-1.5">
                          <Table className="w-3.5 h-3.5 text-purple-400" />
                          <span>[Textract TABLE: {blk.id}] ({blk.relationships?.[0]?.ids?.length || 0} Child Cells)</span>
                        </div>
                      ) : (
                        <span className={isHighlighted ? 'text-amber-200 font-medium' : 'text-slate-200'}>
                          {highlightText(blk.text || '', searchQuery)}
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Remaining OCR Lines */}
                {document.rawText.split('\n').slice(document.textractBlocks.filter(b => b.blockType === 'LINE').length).map((line, idx) => (
                  <div key={idx} className="text-slate-400 text-[11px] px-1">
                    {highlightText(line, searchQuery)}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Structured Data Inspector */}
          <div className="lg:col-span-7 flex flex-col overflow-hidden bg-slate-900">
            
            {/* Tab Bar */}
            <div className="flex items-center gap-1 px-4 pt-2 border-b border-slate-800 bg-slate-950/50 overflow-x-auto">
              <button
                onClick={() => setActiveTab('fields')}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'fields'
                    ? 'border-blue-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Extracted Fields
              </button>

              <button
                onClick={() => setActiveTab('line-items')}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'line-items'
                    ? 'border-blue-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Table className="w-3.5 h-3.5 text-blue-400" />
                <span>Line Items (TABLES)</span>
                {lineItemsCount > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeTab === 'line-items'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {lineItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('tags')}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'tags'
                    ? 'border-blue-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Smart Tags ({document.tags.length})
              </button>

              <button
                onClick={() => setActiveTab('ocr')}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'ocr'
                    ? 'border-blue-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Raw OCR Stream
              </button>

              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'json'
                    ? 'border-blue-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Textract JSON
              </button>

              <button
                onClick={() => setActiveTab('metadata')}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'metadata'
                    ? 'border-blue-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                AWS Storage Metadata
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              {/* TAB 1: EXTRACTED FIELDS & EDITABILITY */}
              {activeTab === 'fields' && (
                <div className="space-y-6">
                  
                  {/* Editable Form Header */}
                  <form onSubmit={handleSaveFields} className="space-y-4 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-200">Verified Form Key-Values</h4>
                        <p className="text-[11px] text-slate-400">Verify or adjust values extracted by AWS Textract.</p>
                      </div>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                      >
                        {saveSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                        <span>{saveSuccess ? 'Saved' : 'Save Adjustments'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1">Entity / Vendor Name</label>
                        <input
                          type="text"
                          value={vendor}
                          onChange={(e) => setVendor(e.target.value)}
                          placeholder="e.g. Amazon Web Services, Inc."
                          className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Invoice / Reference #</label>
                        <input
                          type="text"
                          value={invoiceNumber}
                          onChange={(e) => setInvoiceNumber(e.target.value)}
                          placeholder="e.g. INV-2026-9812"
                          className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Total Stated Amount ($)</label>
                        <input
                          type="number"
                          step="any"
                          value={totalAmount}
                          onChange={(e) => setTotalAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Document Date</label>
                        <input
                          type="text"
                          value={docDate}
                          onChange={(e) => setDocDate(e.target.value)}
                          placeholder="YYYY-MM-DD"
                          className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </form>

                  {/* Document Overview */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-300">Document Overview</span>
                    <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800">
                      {document.summary}
                    </p>
                  </div>

                  {/* Line Items Teaser Card */}
                  {lineItemsCount > 0 ? (
                    <div 
                      onClick={() => setActiveTab('line-items')}
                      className="bg-slate-950 p-3.5 rounded-lg border border-blue-500/30 hover:border-blue-500/60 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Table className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 transition-colors block">
                            Itemized Tabular Breakdown ({lineItemsCount} Rows Detected)
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Parsed via Textract TABLE → ROW → CELL hierarchy with accounting reconciliation.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                        <span>Open Line Items Tab</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ) : null}

                  {/* Key-Value Entities List */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-300">
                      Recognized Form Entities ({document.extracted.entities.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {document.extracted.entities.map((ent, idx) => (
                        <div key={idx} className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">{ent.label}</span>
                            <span className="text-slate-200 font-medium">{ent.value}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                            {(ent.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: LINE ITEMS & TEXTRACT TABLE HIERARCHY */}
              {activeTab === 'line-items' && (
                <LineItemsInspector
                  document={document}
                  onUpdateLineItems={(updatedItems: LineItem[]) => {
                    if (onUpdateMetadata) {
                      onUpdateMetadata(document.id, { lineItems: updatedItems });
                    }
                  }}
                  onHighlightBlock={(blockId) => setHighlightedBlockId(blockId)}
                />
              )}

              {/* TAB 3: SMART TAGS */}
              {activeTab === 'tags' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200 mb-1">
                      Assigned Smart Tags
                    </h4>
                    <p className="text-xs text-slate-400">
                      Auto-generated via entity classification rules. Tags can be added or removed.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap bg-slate-950 p-3 rounded border border-slate-800">
                    {document.tags.map((tag) => (
                      <div
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-rose-400 text-slate-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddTag} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Add tag (e.g. #q3-audit, #tax-deductible)..."
                      className="flex-1 px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      Add Tag
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: RAW OCR STREAM */}
              {activeTab === 'ocr' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      Raw Extracted Text ({document.rawText.split('\n').length} lines)
                    </span>
                    <button
                      onClick={handleCopyText}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText ? 'Copied' : 'Copy Text'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-[480px] select-text">
                    <pre className="whitespace-pre-wrap">{document.rawText}</pre>
                  </div>
                </div>
              )}

              {/* TAB 5: TEXTRACT JSON */}
              {activeTab === 'json' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      AWS Textract Standard Blocks JSON
                    </span>
                    <button
                      onClick={handleCopyJson}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                    >
                      {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[480px] select-text">
                    <pre>{JSON.stringify(document.textractBlocks, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* TAB 6: AWS METADATA & TELEMETRY */}
              {activeTab === 'metadata' && (
                <div className="space-y-4 text-xs font-mono">
                  <div className="space-y-2 bg-slate-950 p-4 rounded border border-slate-800">
                    <span className="text-xs font-semibold text-slate-200 block font-sans">Amazon S3 Object Parameters</span>
                    <div className="grid grid-cols-2 gap-2 text-slate-400">
                      <div>Bucket: <span className="text-slate-200">{document.s3Bucket}</span></div>
                      <div>Key: <span className="text-slate-200">{document.s3Key}</span></div>
                      <div>Content-Type: <span className="text-slate-200">{document.mimeType}</span></div>
                      <div>Storage Class: <span className="text-slate-200">STANDARD</span></div>
                      <div>Encryption: <span className="text-slate-200">aws:kms</span></div>
                      <div>Version ID: <span className="text-slate-200">null</span></div>
                    </div>
                  </div>

                  <div className="space-y-2 bg-slate-950 p-4 rounded border border-slate-800">
                    <span className="text-xs font-semibold text-slate-200 block font-sans">Processing Metrics</span>
                    <div className="space-y-1.5 tabular-nums text-slate-400">
                      <div className="flex justify-between">
                        <span>S3 Storage Sync:</span>
                        <span className="text-slate-200">{document.metrics.s3UploadMs} ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>OCR Text Extraction:</span>
                        <span className="text-slate-200">{document.metrics.textractOcrMs} ms</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-800 font-semibold text-slate-100">
                        <span>Total Ingestion Time:</span>
                        <span className="text-slate-200">{document.metrics.totalLatencyMs} ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
