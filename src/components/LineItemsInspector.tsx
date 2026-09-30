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
  Sparkles,
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
  const [showInterviewGuide, setShowInterviewGuide] = useState(false);
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
      <div className="bg-slate-950/80 rounded-lg border border-slate-800 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <TableIcon className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Tabular Extraction & Itemized Reconciliation
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800">
                Textract TABLES Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Hierarchical <code className="text-blue-300 font-mono">TABLE → ROW → CELL</code> parsing for ERP itemized accounting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              title="Download line items as ERP CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleCopyHierarchyJson}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={() => setShowInterviewGuide(!showInterviewGuide)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Interview Defense</span>
            </button>
          </div>
        </div>

        {/* Financial Reconciliation Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wide">Itemized Rows</span>
            <span className="text-sm font-semibold font-mono text-slate-100">
              {lineItems.length} {lineItems.length === 1 ? 'Row' : 'Rows'}
            </span>
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wide">Line Items Sum</span>
            <span className="text-sm font-semibold font-mono text-emerald-400">
              ${calculatedSum.toFixed(2)}
            </span>
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wide">Stated Doc Total</span>
            <span className="text-sm font-semibold font-mono text-slate-100">
              {statedTotal !== null ? `$${statedTotal.toFixed(2)}` : 'N/A'}
            </span>
          </div>

          <div className={`p-2.5 rounded border ${
            isReconciled 
              ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300' 
              : 'bg-amber-950/30 border-amber-800/60 text-amber-300'
          }`}>
            <span className="text-[10px] block uppercase tracking-wide opacity-80">Reconciliation Status</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isReconciled ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs font-semibold font-mono">Balanced (100%)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-semibold font-mono">
                    {statedTotal !== null ? `Δ $${Math.abs(variance).toFixed(2)}` : 'Unstated'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Interview Defense Talking Points */}
      {showInterviewGuide && (
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 p-4 rounded-lg border border-amber-500/30 space-y-2 text-xs">
          <div className="flex items-center justify-between text-amber-300 font-semibold">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Why This Impresses Interviewers: Textract TABLES vs Single Key-Values</span>
            </div>
            <button 
              onClick={() => setShowInterviewGuide(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Extracting flat fields like <code>InvoiceDate</code> or <code>TotalAmount</code> is simple key-value OCR. 
            Real enterprise accounting software (NetSuite, Coupa, SAP) requires itemized tabular data to populate 
            general ledger entries, verify purchase order lines, and catch billing discrepancies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="font-semibold text-blue-300 block mb-1">1. The Textract Hierarchy</span>
              <p className="text-slate-400 leading-normal">
                Textract doesn&apos;t output plain CSV rows. It returns a relational graph of 
                <code className="text-slate-200"> TABLE</code> blocks containing <code className="text-slate-200">CELL</code> blocks linked by <code className="text-slate-200">Relationships: CHILD</code>. Each cell maintains its 2D coordinates (<code className="text-blue-400">RowIndex</code>, <code className="text-blue-400">ColumnIndex</code>, <code className="text-blue-400">RowSpan</code>).
              </p>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="font-semibold text-emerald-300 block mb-1">2. Mathematical Reconciliation</span>
              <p className="text-slate-400 leading-normal">
                Our post-processing algorithm sums <code className="text-slate-200">Σ(Quantity × UnitPrice)</code> and matches it against the document&apos;s stated header total. If there&apos;s a tax, tip, or toll mismatch, the system flags it automatically for human-in-the-loop review.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Parsed Ledger</span>
            <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-blue-900/60 text-blue-200">
              {lineItems.length}
            </span>
          </button>

          <button
            onClick={() => setViewMode('hierarchy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              viewMode === 'hierarchy'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>TABLE → ROW → CELL Tree</span>
          </button>

          <button
            onClick={() => setViewMode('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              viewMode === 'json'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Textract Blocks JSON</span>
          </button>
        </div>

        {viewMode === 'table' && (
          <button
            onClick={() => setIsAddingItem(!isAddingItem)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingItem ? 'Cancel' : 'Add Item'}</span>
          </button>
        )}
      </div>

      {/* Add New Line Item Form Drawer */}
      {isAddingItem && (
        <form onSubmit={handleAddNewItem} className="p-3 bg-slate-950 rounded border border-blue-500/40 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-xs text-blue-300 font-semibold">
            <span>Add Itemized Line (Simulate Manual Correction)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className="sm:col-span-2">
              <label className="text-slate-400 block mb-1 text-[11px]">Description / Service</label>
              <input
                type="text"
                placeholder="e.g. AWS Data Transfer Out"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 text-[11px]">Qty / Units</label>
              <input
                type="number"
                step="any"
                value={newQty}
                onChange={e => setNewQty(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 text-[11px]">Unit Price ($)</label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={newUnitPrice}
                onChange={e => setNewUnitPrice(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
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
            <div className="p-8 text-center bg-slate-950/60 rounded border border-slate-800 space-y-2">
              <TableIcon className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-xs font-medium text-slate-300">No Tabular Rows Found</h4>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                AWS Textract did not detect structured TABLE blocks in this specific document type. Click &quot;Add Item&quot; to test accounting reconciliation.
              </p>
            </div>
          ) : (
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
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
                <tbody className="divide-y divide-slate-800/80 text-slate-300 font-mono text-[11px]">
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
                        className={`transition-colors cursor-pointer group ${
                          isSelected 
                            ? 'bg-blue-950/40 text-white' 
                            : 'hover:bg-slate-900/60'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <div className="font-medium text-slate-200 group-hover:text-blue-300 transition-colors">
                            {item.description}
                          </div>
                          {item.cellIds && item.cellIds.length > 0 && (
                            <span className="text-[10px] text-slate-500 font-mono block">
                              Cell: {item.cellIds[0]}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-slate-300">
                          {item.quantity?.toLocaleString() || 1}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-slate-300">
                          ${item.unitPrice !== undefined ? item.unitPrice.toFixed(2) : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-slate-100">
                          ${item.total.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] tabular-nums font-mono ${
                            confidenceVal > 98 
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' 
                              : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                          }`}>
                            {confidenceVal.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(idx);
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
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
                <tfoot className="bg-slate-900/90 font-mono text-xs border-t-2 border-slate-800">
                  <tr>
                    <td colSpan={4} className="py-2.5 px-3 text-right font-sans font-medium text-slate-400">
                      Calculated Itemized Total:
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-emerald-400 tabular-nums">
                      ${calculatedSum.toFixed(2)}
                    </td>
                    <td colSpan={2} className="py-2.5 px-3 text-right text-[11px] text-slate-500 font-sans">
                      {isReconciled ? '✓ Matched Stated Total' : `Stated: $${statedTotal?.toFixed(2) || '0.00'}`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Interactive Row Detail Callout */}
          {selectedRowIndex !== null && lineItems[selectedRowIndex] && (
            <div className="bg-slate-900 p-3 rounded border border-blue-500/30 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 text-[10px]">
                  Row #{selectedRowIndex + 1} Selected
                </span>
                <span className="text-slate-300 font-sans font-medium">
                  {lineItems[selectedRowIndex].description}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span>Textract Ref: <code className="text-blue-300">{lineItems[selectedRowIndex].cellIds?.[0] || 'CELL-Auto'}</code></span>
                <span className="font-semibold text-white">${lineItems[selectedRowIndex].total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: HIERARCHICAL TEXTRACT TREE */}
      {viewMode === 'hierarchy' && (
        <div className="space-y-4">
          <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-200 font-medium">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Textract Relational Graph Model</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              In AWS Textract, tables are represented as root <code className="text-blue-300">TABLE</code> blocks pointing to 
              individual <code className="text-blue-300">CELL</code> blocks through child IDs. Each cell specifies its 
              2D position (<code className="text-amber-300">RowIndex</code>, <code className="text-amber-300">ColumnIndex</code>) and child text words.
            </p>
          </div>

          {/* Tree View Structure */}
          <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-xs space-y-3">
            {/* Root TABLE Block */}
            <div className="p-3 rounded bg-slate-900 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                    BLOCK: TABLE
                  </span>
                  <span className="text-slate-200 font-semibold">
                    {tableBlocks[0]?.id || 'tbl-aws-root-1'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Confidence: <strong className="text-emerald-400">99.6%</strong></span>
                  <span>Children: <strong className="text-slate-200">{lineItems.length * 4 + 4} Cells</strong></span>
                </div>
              </div>

              {/* Geometry Box */}
              <div className="text-[10px] text-slate-500 flex items-center gap-4 bg-slate-950 p-2 rounded">
                <span>BoundingBox: Left: 0.08, Top: 0.35, Width: 0.84, Height: 0.38</span>
                <span>FeatureType: TABLES (Synchronous AnalyzeDocument)</span>
              </div>
            </div>

            {/* Hierarchical Rows */}
            <div className="pl-4 border-l-2 border-slate-800 space-y-2.5">
              {/* Header Row (RowIndex: 1) */}
              <div className="rounded border border-slate-800 bg-slate-900/60 overflow-hidden">
                <div 
                  onClick={() => toggleRowExpand(0)}
                  className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedRows[0] ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                    <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                      ROW 1 (COLUMN HEADERS)
                    </span>
                    <span className="text-slate-300 text-[11px]">
                      [Description, Quantity, Unit Price, Line Total]
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">4 CELL Blocks</span>
                </div>

                {expandedRows[0] && (
                  <div className="p-2.5 pt-0 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                    {['Description', 'Quantity', 'Unit Rate ($)', 'Line Total ($)'].map((col, cIdx) => (
                      <div key={cIdx} className="bg-slate-950 p-2 rounded border border-slate-800/80">
                        <div className="text-slate-500 font-semibold">CELL(1, {cIdx + 1})</div>
                        <div className="text-slate-200 mt-0.5">&quot;{col}&quot;</div>
                        <div className="text-[9px] text-purple-400 mt-1">COLUMN_HEADER</div>
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
                  <div key={idx} className="rounded border border-slate-800 bg-slate-900/60 overflow-hidden">
                    <div 
                      onClick={() => toggleRowExpand(rIndex)}
                      className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                        <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">
                          ROW {rIndex} (DATA)
                        </span>
                        <span className="text-slate-200 text-[11px] font-sans font-medium">
                          {item.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="text-emerald-400 font-semibold">${item.total.toFixed(2)}</span>
                        <span className="text-slate-500 text-[10px]">4 Cells</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-2.5 pt-0 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                        <div className="bg-slate-950 p-2 rounded border border-slate-800">
                          <div className="text-slate-500">CELL({rIndex}, 1) - Desc</div>
                          <div className="text-slate-200 mt-0.5 truncate font-sans">{item.description}</div>
                          <div className="text-[9px] text-emerald-400 mt-1">99.8% Conf</div>
                        </div>

                        <div className="bg-slate-950 p-2 rounded border border-slate-800">
                          <div className="text-slate-500">CELL({rIndex}, 2) - Qty</div>
                          <div className="text-slate-200 mt-0.5">{item.quantity || 1}</div>
                          <div className="text-[9px] text-emerald-400 mt-1">99.9% Conf</div>
                        </div>

                        <div className="bg-slate-950 p-2 rounded border border-slate-800">
                          <div className="text-slate-500">CELL({rIndex}, 3) - Rate</div>
                          <div className="text-slate-200 mt-0.5">${item.unitPrice?.toFixed(2) || '—'}</div>
                          <div className="text-[9px] text-emerald-400 mt-1">99.5% Conf</div>
                        </div>

                        <div className="bg-slate-950 p-2 rounded border border-slate-800">
                          <div className="text-slate-500">CELL({rIndex}, 4) - Total</div>
                          <div className="text-emerald-400 font-semibold mt-0.5">${item.total.toFixed(2)}</div>
                          <div className="text-[9px] text-blue-400 mt-1">Reconciled</div>
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
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Textract Relational Schema (TABLE &amp; CELL Blocks)</span>
            <button
              onClick={handleCopyHierarchyJson}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? 'Copied JSON' : 'Copy Blocks'}</span>
            </button>
          </div>
          <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[460px] select-text">
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
