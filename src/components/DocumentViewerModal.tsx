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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs">
      <div 
        className="border rounded-2xl w-full max-w-6xl h-[92vh] shadow-2xl overflow-hidden flex flex-col transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        
        {/* Modal Top Bar */}
        <div 
          className="px-6 py-3.5 border-b flex items-center justify-between transition-colors"
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--accent)'
              }}
            >
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }} title={document.name}>
                  {document.name}
                </h2>
                <span className="text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                  ({document.extracted.documentType})
                </span>
                {lineItemsCount > 0 && (
                  <span 
                    className="px-2 py-0.5 rounded text-[10px] font-mono border hidden sm:inline-block font-semibold"
                    style={{
                      backgroundColor: 'var(--accent-subtle)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--accent-text)'
                    }}
                  >
                    {lineItemsCount} Itemized Rows
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>
                s3://{document.s3Bucket}/{document.s3Key}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shadow-xs"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export OCR</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:opacity-75 transition-opacity cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          
          {/* Left Column: Document Canvas & OCR Bounding Boxes */}
          <div 
            className="lg:col-span-5 p-4 border-r flex flex-col overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-surface-muted)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            
            <div className="flex items-center justify-between pb-2.5 border-b text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Document Canvas</span>
                <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  Page 1 of {document.extracted.pageCount}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div 
                  className="flex items-center border rounded-lg shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <button 
                    onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
                    className="p-1 hover:opacity-75 cursor-pointer"
                    style={{ color: 'var(--text-secondary)' }}
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-1 text-[11px] font-mono tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                    {zoomLevel}%
                  </span>
                  <button 
                    onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                    className="p-1 hover:opacity-75 cursor-pointer"
                    style={{ color: 'var(--text-secondary)' }}
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className="px-2 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shadow-xs"
                  style={{
                    backgroundColor: showBoundingBoxes ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                    borderColor: showBoundingBoxes ? 'var(--accent)' : 'var(--border-subtle)',
                    color: showBoundingBoxes ? 'var(--accent-text)' : 'var(--text-secondary)'
                  }}
                >
                  <BoxSelect className="w-3 h-3 inline mr-1" />
                  <span>Boxes</span>
                </button>
              </div>
            </div>

            {/* Document Canvas Display */}
            <div 
              className="flex-1 overflow-y-auto mt-3 rounded-xl border p-4 select-text shadow-inner"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <div 
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left', color: 'var(--text-primary)' }} 
                className="transition-transform duration-100 font-mono text-xs leading-relaxed space-y-2"
              >
                {/* Visual Bounding Box Elements */}
                {document.textractBlocks.map((blk) => {
                  const isHighlighted = highlightedBlockId === blk.id;
                  const isTable = blk.blockType === 'TABLE';
                  const isCell = blk.blockType === 'CELL';

                  return (
                    <div 
                      key={blk.id}
                      className="relative p-1 rounded transition-all group"
                      style={{
                        border: isHighlighted 
                          ? '2px solid var(--accent)' 
                          : isTable 
                            ? '1px solid var(--border-hover)' 
                            : isCell 
                              ? '1px solid var(--border-subtle)' 
                              : showBoundingBoxes ? '1px solid var(--border-subtle)' : 'none',
                        backgroundColor: isHighlighted 
                          ? 'var(--accent-subtle)' 
                          : isTable 
                            ? 'var(--bg-surface-elevated)' 
                            : isCell 
                              ? 'var(--bg-surface)' 
                              : showBoundingBoxes ? 'var(--bg-surface-muted)' : 'transparent',
                        padding: isTable ? '8px' : '4px',
                        margin: isTable ? '8px 0' : '0'
                      }}
                    >
                      {showBoundingBoxes && (
                        <span 
                          className="absolute -top-2 right-1 text-[8px] px-1 rounded font-mono border"
                          style={{
                            backgroundColor: 'var(--bg-surface-elevated)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-muted)'
                          }}
                        >
                          {blk.blockType}: {blk.confidence}%
                        </span>
                      )}
                      
                      {isTable ? (
                        <div className="font-bold text-xs flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                          <Table className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                          <span>[Table Block: {blk.id}] ({blk.relationships?.[0]?.ids?.length || 0} Cells)</span>
                        </div>
                      ) : (
                        <span style={{ color: isHighlighted ? 'var(--accent-text)' : 'var(--text-primary)' }}>
                          {highlightText(blk.text || '', searchQuery)}
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Remaining OCR Lines */}
                {document.rawText.split('\n').slice(document.textractBlocks.filter(b => b.blockType === 'LINE').length).map((line, idx) => (
                  <div key={idx} className="text-zinc-400 text-[11px] px-1">
                    {highlightText(line, searchQuery)}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Structured Data Inspector */}
          <div className="lg:col-span-7 flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
            
            {/* Tab Bar */}
            <div 
              className="flex items-center gap-1 px-4 pt-2 border-b overflow-x-auto transition-colors"
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <button
                onClick={() => setActiveTab('fields')}
                className="px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer"
                style={{
                  borderBottomColor: activeTab === 'fields' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'fields' ? 'var(--accent-text)' : 'var(--text-muted)'
                }}
              >
                Extracted Fields
              </button>

              <button
                onClick={() => setActiveTab('line-items')}
                className="px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                style={{
                  borderBottomColor: activeTab === 'line-items' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'line-items' ? 'var(--accent-text)' : 'var(--text-muted)'
                }}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Line Items</span>
                {lineItemsCount > 0 && (
                  <span 
                    className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--btn-primary-text)'
                    }}
                  >
                    {lineItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('tags')}
                className="px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer"
                style={{
                  borderBottomColor: activeTab === 'tags' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'tags' ? 'var(--accent-text)' : 'var(--text-muted)'
                }}
              >
                Tags ({document.tags.length})
              </button>

              <button
                onClick={() => setActiveTab('ocr')}
                className="px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer"
                style={{
                  borderBottomColor: activeTab === 'ocr' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'ocr' ? 'var(--accent-text)' : 'var(--text-muted)'
                }}
              >
                Raw OCR Text
              </button>

              <button
                onClick={() => setActiveTab('json')}
                className="px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer"
                style={{
                  borderBottomColor: activeTab === 'json' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'json' ? 'var(--accent-text)' : 'var(--text-muted)'
                }}
              >
                OCR JSON
              </button>

              <button
                onClick={() => setActiveTab('metadata')}
                className="px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer"
                style={{
                  borderBottomColor: activeTab === 'metadata' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'metadata' ? 'var(--accent-text)' : 'var(--text-muted)'
                }}
              >
                Storage Metadata
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              {/* TAB 1: EXTRACTED FIELDS & EDITABILITY */}
              {activeTab === 'fields' && (
                <div className="space-y-6">
                  
                  {/* Editable Form Header */}
                  <form 
                    onSubmit={handleSaveFields} 
                    className="space-y-4 p-4 rounded-xl border shadow-xs"
                    style={{
                      backgroundColor: 'var(--bg-surface-muted)',
                      borderColor: 'var(--border-subtle)'
                    }}
                  >
                    <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                      <div>
                        <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Verified Form Values</h4>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Values extracted by OCR document intelligence.</p>
                      </div>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-colors cursor-pointer shadow-sm"
                        style={{
                          backgroundColor: 'var(--btn-primary-bg)',
                          color: 'var(--btn-primary-text)'
                        }}
                      >
                        {saveSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                        <span>{saveSuccess ? 'Saved' : 'Save Changes'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block mb-1 font-medium" style={{ color: 'var(--text-secondary)' }}>Entity / Vendor Name</label>
                        <input
                          type="text"
                          value={vendor}
                          onChange={(e) => setVendor(e.target.value)}
                          placeholder="e.g. Amazon Web Services, Inc."
                          className="w-full px-3 py-2 rounded-lg border focus:outline-none"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-primary)'
                          }}
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-medium" style={{ color: 'var(--text-secondary)' }}>Invoice / Reference #</label>
                        <input
                          type="text"
                          value={invoiceNumber}
                          onChange={(e) => setInvoiceNumber(e.target.value)}
                          placeholder="e.g. INV-2026-9812"
                          className="w-full px-3 py-2 rounded-lg border focus:outline-none"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-primary)'
                          }}
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-medium" style={{ color: 'var(--text-secondary)' }}>Total Stated Amount ($)</label>
                        <input
                          type="number"
                          step="any"
                          value={totalAmount}
                          onChange={(e) => setTotalAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 rounded-lg border focus:outline-none font-mono"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-primary)'
                          }}
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-medium" style={{ color: 'var(--text-secondary)' }}>Document Date</label>
                        <input
                          type="text"
                          value={docDate}
                          onChange={(e) => setDocDate(e.target.value)}
                          placeholder="YYYY-MM-DD"
                          className="w-full px-3 py-2 rounded-lg border focus:outline-none"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-primary)'
                          }}
                        />
                      </div>
                    </div>
                  </form>

                  {/* Document Overview */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Document Overview</span>
                    <p 
                      className="text-xs leading-relaxed p-3 rounded-xl border"
                      style={{
                        backgroundColor: 'var(--bg-surface-muted)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {document.summary}
                    </p>
                  </div>

                  {/* Line Items Teaser Card */}
                  {lineItemsCount > 0 ? (
                    <div 
                      onClick={() => setActiveTab('line-items')}
                      className="p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between group shadow-xs"
                      style={{
                        backgroundColor: 'var(--bg-surface-muted)',
                        borderColor: 'var(--border-subtle)'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg border"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--accent)'
                          }}
                        >
                          <Table className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold transition-colors block" style={{ color: 'var(--text-primary)' }}>
                            Itemized Tabular Breakdown ({lineItemsCount} Rows Detected)
                          </span>
                          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                            Parsed via table extraction engine with accounting reconciliation.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--accent-text)' }}>
                        <span>View Line Items</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ) : null}

                  {/* Key-Value Entities List */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      Recognized Form Entities ({document.extracted.entities.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {document.extracted.entities.map((ent, idx) => (
                        <div 
                          key={idx} 
                          className="p-2.5 rounded-lg border flex items-center justify-between text-xs"
                          style={{
                            backgroundColor: 'var(--bg-surface-muted)',
                            borderColor: 'var(--border-subtle)'
                          }}
                        >
                          <div>
                            <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>{ent.label}</span>
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{ent.value}</span>
                          </div>
                          <span className="text-[10px] font-mono tabular-nums" style={{ color: 'var(--text-muted)' }}>
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
                    <h4 className="text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Assigned Tags
                    </h4>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Tags automatically generated from extracted data or manually assigned.
                    </p>
                  </div>

                  <div 
                    className="flex items-center gap-2 flex-wrap p-3 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--bg-surface-muted)',
                      borderColor: 'var(--border-subtle)'
                    }}
                  >
                    {document.tags.map((tag) => (
                      <div
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border"
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-rose-600 transition-colors cursor-pointer"
                          style={{ color: 'var(--text-muted)' }}
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
                      className="flex-1 px-3 py-1.5 rounded-lg border text-xs font-mono focus:outline-none"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                      style={{
                        backgroundColor: 'var(--btn-primary-bg)',
                        color: 'var(--btn-primary-text)'
                      }}
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
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      Raw Extracted Text ({document.rawText.split('\n').length} lines)
                    </span>
                    <button
                      onClick={handleCopyText}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shadow-xs"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText ? 'Copied' : 'Copy Text'}</span>
                    </button>
                  </div>
                  <div 
                    className="p-4 rounded-xl border font-mono text-xs leading-relaxed overflow-x-auto max-h-[480px] select-text shadow-inner"
                    style={{
                      backgroundColor: 'var(--bg-surface-muted)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <pre className="whitespace-pre-wrap">{document.rawText}</pre>
                  </div>
                </div>
              )}

              {/* TAB 5: OCR JSON */}
              {activeTab === 'json' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      Structured OCR Blocks JSON
                    </span>
                    <button
                      onClick={handleCopyJson}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shadow-xs"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <div 
                    className="p-4 rounded-xl border font-mono text-[11px] overflow-x-auto max-h-[480px] select-text shadow-inner"
                    style={{
                      backgroundColor: 'var(--bg-surface-muted)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <pre>{JSON.stringify(document.textractBlocks, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* TAB 6: STORAGE METADATA & TELEMETRY */}
              {activeTab === 'metadata' && (
                <div className="space-y-4 text-xs font-mono">
                  <div 
                    className="space-y-2 p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--bg-surface-muted)',
                      borderColor: 'var(--border-subtle)'
                    }}
                  >
                    <span className="text-xs font-bold block font-sans" style={{ color: 'var(--text-primary)' }}>Vault Storage Parameters</span>
                    <div className="grid grid-cols-2 gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <div>Bucket: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{document.s3Bucket}</span></div>
                      <div>Key: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{document.s3Key}</span></div>
                      <div>Content-Type: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{document.mimeType}</span></div>
                      <div>Storage Class: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>STANDARD</span></div>
                      <div>Encryption: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Managed KMS</span></div>
                      <div>Status: <span className="font-semibold text-emerald-600">active</span></div>
                    </div>
                  </div>

                  <div 
                    className="space-y-2 p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--bg-surface-muted)',
                      borderColor: 'var(--border-subtle)'
                    }}
                  >
                    <span className="text-xs font-bold block font-sans" style={{ color: 'var(--text-primary)' }}>Processing Times</span>
                    <div className="space-y-1.5 tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex justify-between">
                        <span>Upload Time:</span>
                        <span style={{ color: 'var(--text-primary)' }}>{document.metrics.s3UploadMs} ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Extraction Time:</span>
                        <span style={{ color: 'var(--text-primary)' }}>{document.metrics.textractOcrMs} ms</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t font-bold" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
                        <span>Total Latency:</span>
                        <span>{document.metrics.totalLatencyMs} ms</span>
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
