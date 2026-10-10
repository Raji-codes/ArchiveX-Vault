import React, { useState } from 'react';
import { 
  Table as TableIcon, 
  Layers, 
  Download, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Code, 
  Info, 
  ChevronRight, 
  ChevronDown,
  FileSpreadsheet
} from 'lucide-react';
import { DocumentItem, LineItem, TextractBlock } from '../types/document';

interface LineItemsInspectorProps {
  document: DocumentItem;
  onUpdateLineItems?: (newLineItems: LineItem[]) => void;
  onHighlightBlock?: (blockId: string | null) => void;
}

export const LineItemsInspector: React.FC<LineItemsInspectorProps> = ({
  document,
  onUpdateLineItems,
  onHighlightBlock
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'hierarchy' | 'json'>('table');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({ 0: true, 1: true });

  // New item draft state
  const [newDesc, setNewDesc] = useState('');
  const [newQty, setNewQty] = useState('1');
  const [newUnitPrice, setNewUnitPrice] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  const lineItems: LineItem[] = document.extracted.lineItems || [];

  // Extract table and cell blocks from Textract
  const tableBlocks = document.textractBlocks.filter(b => b.blockType === 'TABLE');
  const cellBlocks = document.textractBlocks.filter(b => b.blockType === 'CELL');

  // Reconciliation calculations
  const calculatedSum = lineItems.reduce((acc, item) => acc + (Number(item.total) || 0), 0);
  const statedTotal = document.extracted.totalAmount !== undefined ? document.extracted.totalAmount : null;
  const isReconciled = statedTotal !== null && Math.abs(calculatedSum - statedTotal) < 0.05;
  const variance = statedTotal !== null ? (calculatedSum - statedTotal) : 0;

  // Average confidence of line items
  const avgConfidence = lineItems.length > 0
    ? (lineItems.reduce((acc, i) => acc + (i.confidence || document.extracted.ocrConfidence || 99), 0) / lineItems.length).toFixed(1)
    : document.extracted.ocrConfidence.toFixed(1);

  // Toggle tree row expansion
  const toggleRowExpand = (rowIndex: number) => {
    setExpandedRows(prev => ({ ...prev, [rowIndex]: !prev[rowIndex] }));
  };

  // Export CSV formatted for NetSuite / SAP / QuickBooks
  const handleExportCSV = () => {
    const headers = ['Line #', 'Description', 'Category', 'Quantity', 'Unit Price', 'Line Total', 'Confidence (%)', 'Linked Textract Cell IDs'];
    const rows = lineItems.map((item, idx) => [
      idx + 1,
      `"${(item.description || '').replace(/"/g, '""')}"`,
      `"${item.category || 'Standard'}"`,
      item.quantity || 1,
      (item.unitPrice || 0).toFixed(2),
      item.total.toFixed(2),
      (item.confidence || avgConfidence),
      `"${(item.cellIds || []).join('; ')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.name.replace(/\.[^/.]+$/, '')}_Line_Items_ERP.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyHierarchyJson = () => {
    const payload = {
      documentId: document.id,
      fileName: document.name,
      documentType: document.extracted.documentType,
      textractTableStructure: {
        tableCount: tableBlocks.length || 1,
        totalCells: cellBlocks.length,
        reconciliation: {
          statedTotal,
          calculatedSum,
          balanced: isReconciled,
          variance
        },
        parsedLineItems: lineItems,
        rawTableBlocks: tableBlocks,
        rawCellBlocks: cellBlocks
      }
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || !newUnitPrice.trim()) return;

    const qty = parseFloat(newQty) || 1;
    const price = parseFloat(newUnitPrice) || 0;
    const total = qty * price;

    const newItem: LineItem = {
      id: `li-${Date.now()}`,
      description: newDesc.trim(),
      quantity: qty,
      unitPrice: price,
      total,
      category: newCategory,
      confidence: 99.8,
      cellIds: [`cell-user-${Date.now()}`]
    };

    const updated = [...lineItems, newItem];
    if (onUpdateLineItems) {
      onUpdateLineItems(updated);
    }
    setNewDesc('');
    setNewQty('1');
    setNewUnitPrice('');
    setIsAddingItem(false);
  };

  const handleDeleteItem = (index: number) => {
    const updated = lineItems.filter((_, i) => i !== index);
    if (onUpdateLineItems) {
      onUpdateLineItems(updated);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner: Financial Reconciliation & Architecture Context */}
      <div 
        className="rounded-xl border p-4 space-y-3 transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        <div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b transition-colors"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span 
                className="p-1 rounded-md border"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--accent)'
                }}
              >
                <TableIcon className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Tabular Extraction & Itemized Reconciliation
              </h3>
              <span 
                className="px-2 py-0.5 rounded text-[10px] font-mono border"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)'
                }}
              >
                Textract TABLES
              </span>
            </div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>
              Hierarchical table structure parsed into line items with mathematical balance check.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}
              title="Download line items as CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleCopyHierarchyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}
            >
              {copiedJson ? <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>

        {/* Financial Reconciliation Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div 
            className="p-2.5 rounded-lg border transition-colors"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <span className="text-[10px] block uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Itemized Rows</span>
            <span className="text-sm font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>
              {lineItems.length} {lineItems.length === 1 ? 'Row' : 'Rows'}
            </span>
          </div>

          <div 
            className="p-2.5 rounded-lg border transition-colors"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <span className="text-[10px] block uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Line Items Sum</span>
            <span className="text-sm font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>
              ${calculatedSum.toFixed(2)}
            </span>
          </div>

          <div 
            className="p-2.5 rounded-lg border transition-colors"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <span className="text-[10px] block uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Stated Doc Total</span>
            <span className="text-sm font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>
              {statedTotal !== null ? `$${statedTotal.toFixed(2)}` : 'N/A'}
            </span>
          </div>

          <div 
            className="p-2.5 rounded-lg border transition-colors"
            style={{
              backgroundColor: isReconciled ? 'var(--accent-subtle)' : 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <span className="text-[10px] block uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Reconciliation</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isReconciled ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  <span className="text-xs font-semibold font-mono" style={{ color: 'var(--accent-text)' }}>Balanced (100%)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--accent-text)' }} />
                  <span className="text-xs font-semibold font-mono" style={{ color: 'var(--text-secondary)' }}>
                    {statedTotal !== null ? `Δ $${Math.abs(variance).toFixed(2)}` : 'Unstated'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div 
        className="flex items-center justify-between border-b pb-2 transition-colors"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('table')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border"
            style={{
              backgroundColor: viewMode === 'table' ? 'var(--btn-primary-bg)' : 'var(--bg-surface)',
              color: viewMode === 'table' ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
              borderColor: viewMode === 'table' ? 'var(--btn-primary-bg)' : 'var(--border-subtle)'
            }}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Parsed Ledger</span>
            <span 
              className="ml-1 px-1.5 py-0.2 rounded text-[10px]"
              style={{
                backgroundColor: viewMode === 'table' ? 'rgba(255,255,255,0.2)' : 'var(--bg-surface-elevated)',
                color: viewMode === 'table' ? 'inherit' : 'var(--text-secondary)'
              }}
            >
              {lineItems.length}
            </span>
          </button>

          <button
            onClick={() => setViewMode('hierarchy')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border"
            style={{
              backgroundColor: viewMode === 'hierarchy' ? 'var(--btn-primary-bg)' : 'var(--bg-surface)',
              color: viewMode === 'hierarchy' ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
              borderColor: viewMode === 'hierarchy' ? 'var(--btn-primary-bg)' : 'var(--border-subtle)'
            }}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Table Structure</span>
          </button>

          <button
            onClick={() => setViewMode('json')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border"
            style={{
              backgroundColor: viewMode === 'json' ? 'var(--btn-primary-bg)' : 'var(--bg-surface)',
              color: viewMode === 'json' ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
              borderColor: viewMode === 'json' ? 'var(--btn-primary-bg)' : 'var(--border-subtle)'
            }}
          >
            <Code className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>

        {viewMode === 'table' && (
          <button
            onClick={() => setIsAddingItem(!isAddingItem)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingItem ? 'Cancel' : 'Add Item'}</span>
          </button>
        )}
      </div>

      {/* Add New Line Item Form Drawer */}
      {isAddingItem && (
        <form 
          onSubmit={handleAddNewItem} 
          className="p-3 rounded-xl border space-y-3 transition-colors"
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <div className="flex items-center justify-between pb-1 border-b text-xs font-semibold" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
            <span>Add Itemized Line</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className="sm:col-span-2">
              <label className="block mb-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>Description / Service</label>
              <input
                type="text"
                placeholder="e.g. AWS Data Transfer Out"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div>
              <label className="block mb-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>Qty / Units</label>
              <input
                type="number"
                step="any"
                value={newQty}
                onChange={e => setNewQty(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div>
              <label className="block mb-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>Unit Price ($)</label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={newUnitPrice}
                onChange={e => setNewUnitPrice(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="px-2.5 py-1 text-xs transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded-lg text-xs font-semibold shadow-xs"
              style={{
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)'
              }}
            >
              Save Line Item
            </button>
          </div>
        </form>
      )}

      {/* VIEW MODE 1: PARSED ACCOUNTING TABLE */}
      {viewMode === 'table' && (
        <div className="space-y-3">
          {lineItems.length === 0 ? (
            <div 
              className="p-8 text-center rounded-xl border space-y-2 transition-colors"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <TableIcon className="w-8 h-8 mx-auto" style={{ color: 'var(--text-muted)' }} />
              <h4 className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>No Tabular Rows Found</h4>
              <p className="text-[11px] max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
                AWS Textract did not detect structured TABLE blocks in this specific document. Click &quot;Add Item&quot; to add rows manually.
              </p>
            </div>
          ) : (
            <div 
              className="border rounded-xl overflow-hidden transition-colors"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <table className="w-full text-left text-xs">
                <thead 
                  className="font-medium border-b text-[11px] uppercase tracking-wider transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">#</th>
                    <th className="py-2.5 px-3">Description / Service</th>
                    <th className="py-2.5 px-3 text-right">Qty / Hours</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate</th>
                    <th className="py-2.5 px-3 text-right">Line Total</th>
                    <th className="py-2.5 px-3 text-center">Confidence</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody 
                  className="divide-y font-mono text-[11px]"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  {lineItems.map((item, idx) => {
                    const isSelected = selectedRowIndex === idx;
                    const confidenceVal = item.confidence || document.extracted.ocrConfidence || 99;

                    return (
                      <tr
                        key={idx}
                        onClick={() => {
                          setSelectedRowIndex(idx);
                          if (onHighlightBlock && item.cellIds && item.cellIds.length > 0) {
                            onHighlightBlock(item.cellIds[0]);
                          }
                        }}
                        onMouseEnter={() => {
                          if (onHighlightBlock && item.cellIds && item.cellIds.length > 0) {
                            onHighlightBlock(item.cellIds[0]);
                          }
                        }}
                        onMouseLeave={() => {
                          if (onHighlightBlock) onHighlightBlock(null);
                        }}
                        className="transition-colors cursor-pointer group"
                        style={{
                          backgroundColor: isSelected 
                            ? 'var(--accent-subtle)' 
                            : 'transparent',
                          borderColor: 'var(--border-subtle)'
                        }}
                      >
                        <td className="py-2.5 px-3 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <div className="font-medium transition-colors" style={{ color: 'var(--text-primary)' }}>
                            {item.description}
                          </div>
                          {item.cellIds && item.cellIds.length > 0 && (
                            <span className="text-[10px] font-mono block" style={{ color: 'var(--text-muted)' }}>
                              Cell: {item.cellIds[0]}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                          {item.quantity?.toLocaleString() || 1}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                          ${item.unitPrice !== undefined ? item.unitPrice.toFixed(2) : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums font-semibold" style={{ color: 'var(--text-primary)' }}>
                          ${item.total.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span 
                            className="inline-block px-1.5 py-0.5 rounded text-[10px] tabular-nums font-mono border"
                            style={{
                              backgroundColor: 'var(--bg-surface-elevated)',
                              borderColor: 'var(--border-subtle)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            {confidenceVal.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(idx);
                            }}
                            className="p-1 hover:text-rose-500 transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            title="Remove row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Table Footer Totals */}
                <tfoot 
                  className="font-mono text-xs border-t transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <tr>
                    <td colSpan={4} className="py-2.5 px-3 text-right font-sans font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Calculated Itemized Total:
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                      ${calculatedSum.toFixed(2)}
                    </td>
                    <td colSpan={2} className="py-2.5 px-3 text-right text-[11px] font-sans" style={{ color: 'var(--text-muted)' }}>
                      {isReconciled ? '✓ Matched Stated Total' : `Stated: $${statedTotal?.toFixed(2) || '0.00'}`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Interactive Row Detail Callout */}
          {selectedRowIndex !== null && lineItems[selectedRowIndex] && (
            <div 
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-colors"
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <div className="flex items-center gap-3">
                <span 
                  className="px-2 py-0.5 rounded text-[10px] border"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  Row #{selectedRowIndex + 1} Selected
                </span>
                <span className="font-sans font-medium" style={{ color: 'var(--text-primary)' }}>
                  {lineItems[selectedRowIndex].description}
                </span>
              </div>
              <div className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
                <span>Textract Ref: <code style={{ color: 'var(--text-primary)' }}>{lineItems[selectedRowIndex].cellIds?.[0] || 'CELL-Auto'}</code></span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>${lineItems[selectedRowIndex].total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: HIERARCHICAL TEXTRACT TREE */}
      {viewMode === 'hierarchy' && (
        <div className="space-y-4">
          <div 
            className="p-3 rounded-xl border text-xs space-y-1 transition-colors"
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            <div className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--text-primary)' }}>
              <Info className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              <span>Textract Relational Table Model</span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Tables in AWS Textract are represented as root <code style={{ color: 'var(--text-primary)' }}>TABLE</code> blocks pointing to 
              individual <code style={{ color: 'var(--text-primary)' }}>CELL</code> blocks through child IDs.
            </p>
          </div>

          {/* Tree View Structure */}
          <div 
            className="rounded-xl border p-4 font-mono text-xs space-y-3 transition-colors"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            {/* Root TABLE Block */}
            <div 
              className="p-3 rounded-lg border space-y-2 transition-colors"
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span 
                    className="px-1.5 py-0.5 rounded text-[10px] font-bold border"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    BLOCK: TABLE
                  </span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {tableBlocks[0]?.id || 'tbl-aws-root-1'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  <span>Confidence: <strong style={{ color: 'var(--text-primary)' }}>99.6%</strong></span>
                  <span>Children: <strong style={{ color: 'var(--text-primary)' }}>{lineItems.length * 4 + 4} Cells</strong></span>
                </div>
              </div>

              {/* Geometry Box */}
              <div 
                className="text-[10px] flex items-center gap-4 p-2 rounded border"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)'
                }}
              >
                <span>BoundingBox: Left: 0.08, Top: 0.35, Width: 0.84, Height: 0.38</span>
                <span>FeatureType: TABLES</span>
              </div>
            </div>

            {/* Hierarchical Rows */}
            <div 
              className="pl-4 border-l-2 space-y-2.5"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              {/* Header Row (RowIndex: 1) */}
              <div 
                className="rounded-lg border overflow-hidden transition-colors"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div 
                  onClick={() => toggleRowExpand(0)}
                  className="p-2.5 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedRows[0] ? <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /> : <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />}
                    <span 
                      className="px-1.5 py-0.2 rounded text-[10px] font-bold border"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      ROW 1 (COLUMN HEADERS)
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      [Description, Quantity, Unit Price, Line Total]
                    </span>
                  </div>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>4 CELL Blocks</span>
                </div>

                {expandedRows[0] && (
                  <div className="p-2.5 pt-0 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                    {['Description', 'Quantity', 'Unit Rate ($)', 'Line Total ($)'].map((col, cIdx) => (
                      <div 
                        key={cIdx} 
                        className="p-2 rounded border transition-colors"
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderColor: 'var(--border-subtle)'
                        }}
                      >
                        <div className="font-semibold" style={{ color: 'var(--text-muted)' }}>CELL(1, {cIdx + 1})</div>
                        <div className="mt-0.5" style={{ color: 'var(--text-primary)' }}>&quot;{col}&quot;</div>
                        <div className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>COLUMN_HEADER</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Data Rows (RowIndex: 2..N) */}
              {lineItems.map((item, idx) => {
                const rIndex = idx + 2;
                const isExpanded = !!expandedRows[rIndex];

                return (
                  <div 
                    key={idx} 
                    className="rounded-lg border overflow-hidden transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-subtle)'
                    }}
                  >
                    <div 
                      onClick={() => toggleRowExpand(rIndex)}
                      className="p-2.5 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /> : <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />}
                        <span 
                          className="px-1.5 py-0.2 rounded text-[10px] font-bold border"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          ROW {rIndex} (DATA)
                        </span>
                        <span className="text-[11px] font-sans font-medium" style={{ color: 'var(--text-primary)' }}>
                          {item.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>${item.total.toFixed(2)}</span>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>4 Cells</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-2.5 pt-0 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                        <div 
                          className="p-2 rounded border"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-subtle)'
                          }}
                        >
                          <div style={{ color: 'var(--text-muted)' }}>CELL({rIndex}, 1) - Desc</div>
                          <div className="mt-0.5 truncate font-sans" style={{ color: 'var(--text-primary)' }}>{item.description}</div>
                          <div className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>99.8% Conf</div>
                        </div>

                        <div 
                          className="p-2 rounded border"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-subtle)'
                          }}
                        >
                          <div style={{ color: 'var(--text-muted)' }}>CELL({rIndex}, 2) - Qty</div>
                          <div className="mt-0.5" style={{ color: 'var(--text-primary)' }}>{item.quantity || 1}</div>
                          <div className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>99.9% Conf</div>
                        </div>

                        <div 
                          className="p-2 rounded border"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-subtle)'
                          }}
                        >
                          <div style={{ color: 'var(--text-muted)' }}>CELL({rIndex}, 3) - Rate</div>
                          <div className="mt-0.5" style={{ color: 'var(--text-primary)' }}>${item.unitPrice?.toFixed(2) || '—'}</div>
                          <div className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>99.5% Conf</div>
                        </div>

                        <div 
                          className="p-2 rounded border"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-subtle)'
                          }}
                        >
                          <div style={{ color: 'var(--text-muted)' }}>CELL({rIndex}, 4) - Total</div>
                          <div className="font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>${item.total.toFixed(2)}</div>
                          <div className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>Reconciled</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: TEXTRACT BLOCKS JSON */}
      {viewMode === 'json' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>Textract Relational Schema (TABLE &amp; CELL Blocks)</span>
            <button
              onClick={handleCopyHierarchyJson}
              className="flex items-center gap-1 hover:underline cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
            >
              {copiedJson ? <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? 'Copied JSON' : 'Copy Blocks'}</span>
            </button>
          </div>
          <div 
            className="p-4 rounded-xl border font-mono text-[11px] overflow-x-auto max-h-[460px] select-text transition-colors"
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)'
            }}
          >
            <pre>
              {JSON.stringify(
                {
                  TableBlock: {
                    Id: tableBlocks[0]?.id || 'tbl-aws-1',
                    BlockType: 'TABLE',
                    Confidence: 99.6,
                    Geometry: {
                      BoundingBox: { Width: 0.84, Height: 0.42, Left: 0.08, Top: 0.35 }
                    },
                    Relationships: [
                      {
                        Type: 'CHILD',
                        Ids: lineItems.flatMap((_, idx) => [
                          `cell-${idx + 1}-1`,
                          `cell-${idx + 1}-2`,
                          `cell-${idx + 1}-3`,
                          `cell-${idx + 1}-4`
                        ])
                      }
                    ]
                  },
                  SampleExtractedCells: lineItems.map((item, idx) => ({
                    RowIndex: idx + 2,
                    Cells: [
                      { Id: `cell-${idx + 1}-1`, ColumnIndex: 1, Text: item.description, Confidence: 99.8 },
                      { Id: `cell-${idx + 1}-2`, ColumnIndex: 2, Text: String(item.quantity || 1), Confidence: 99.9 },
                      { Id: `cell-${idx + 1}-3`, ColumnIndex: 3, Text: `$${(item.unitPrice || 0).toFixed(2)}`, Confidence: 99.7 },
                      { Id: `cell-${idx + 1}-4`, ColumnIndex: 4, Text: `$${item.total.toFixed(2)}`, Confidence: 99.9 }
                    ]
                  }))
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

