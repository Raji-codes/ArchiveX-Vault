import React from 'react';
import { 
  FileText, 
  Trash2, 
  ExternalLink, 
  Download, 
  ChevronRight,
  ChevronDown,
  CheckSquare,
  Square,
  Search
} from 'lucide-react';
import { DocumentItem, SearchMatch } from '../types/document';
import { highlightText } from '../utils/searchHighlight';

interface DocumentTableViewProps {
  documents: DocumentItem[];
  searchResults: SearchMatch[];
  searchQuery: string;
  selectedDocIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onInspectDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (id: string) => void;
  onTagClick: (tag: string) => void;
}

export const DocumentTableView: React.FC<DocumentTableViewProps> = ({
  documents,
  searchResults,
  searchQuery,
  selectedDocIds,
  onToggleSelect,
  onSelectAll,
  onInspectDocument,
  onDeleteDocument,
  onTagClick
}) => {
  const allSelected = documents.length > 0 && selectedDocIds.length === documents.length;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/60 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          
          {/* Table Header */}
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-medium text-[11px] uppercase tracking-wider">
            <tr>
              <th className="w-10 px-3 py-3 text-center">
                <button 
                  onClick={onSelectAll}
                  className="text-slate-400 hover:text-slate-200"
                  title={allSelected ? "Deselect All" : "Select All"}
                >
                  {allSelected ? (
                    <CheckSquare className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3">Document Name & S3 Key</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Entity / Vendor</th>
              <th className="px-4 py-3 text-right">Extracted Total</th>
              <th className="px-4 py-3">Smart Tags</th>
              <th className="px-4 py-3 text-right">Size</th>
              <th className="px-4 py-3 text-right">Created</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/80">
            {searchResults.map(({ document: doc, snippets }) => {
              const isSelected = selectedDocIds.includes(doc.id);
              const hasSnippets = snippets.length > 0 && searchQuery.trim().length > 0;

              return (
                <React.Fragment key={doc.id}>
                  <tr 
                    className={`hover:bg-slate-800/40 transition-colors group cursor-pointer ${
                      isSelected ? 'bg-blue-950/20' : ''
                    }`}
                    onClick={() => onInspectDocument(doc)}
                  >
                    
                    {/* Checkbox */}
                    <td className="px-3 py-3 text-center" onClick={(e) => { e.stopPropagation(); onToggleSelect(doc.id); }}>
                      <button className="text-slate-400 hover:text-slate-200">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                    </td>

                    {/* Document Name & S3 Path */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-100 group-hover:text-blue-400 transition-colors truncate max-w-xs">
                        {highlightText(doc.name, searchQuery)}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                        s3://{doc.s3Bucket}/{doc.s3Key}
                      </div>
                    </td>

                    {/* Document Type */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-slate-300 font-medium">
                        {doc.extracted.documentType}
                      </span>
                    </td>

                    {/* Entity / Vendor */}
                    <td className="px-4 py-3 truncate max-w-[160px]">
                      <span className="text-slate-300 font-medium truncate block">
                        {doc.extracted.vendor ? highlightText(doc.extracted.vendor, searchQuery) : '—'}
                      </span>
                      {doc.extracted.invoiceNumber && (
                        <span className="font-mono text-[10px] text-slate-400 block">
                          #{doc.extracted.invoiceNumber}
                        </span>
                      )}
                    </td>

                    {/* Extracted Total */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {doc.extracted.totalAmount !== undefined ? (
                        <span className="font-mono tabular-nums font-semibold text-emerald-400">
                          ${doc.extracted.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    {/* Smart Tags */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                        {doc.tags.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
                            className="text-[11px] font-mono text-slate-300 hover:text-blue-400 transition-colors"
                          >
                            {highlightText(tag, searchQuery)}
                          </button>
                        ))}
                        {doc.tags.length > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{doc.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* File Size */}
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-400 whitespace-nowrap">
                      {formatFileSize(doc.size)}
                    </td>

                    {/* Upload Date */}
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-400 whitespace-nowrap">
                      {formatDate(doc.uploadedAt)}
                    </td>

                    {/* Action buttons */}
                    <td className="px-4 py-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onInspectDocument(doc)}
                          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                          title="Inspect OCR"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteDocument(doc.id)}
                          className="text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>

                  {/* Search Match Snippet Row (When query is active and matched) */}
                  {hasSnippets && (
                    <tr className="bg-slate-950/90 border-b border-slate-800/80">
                      <td colSpan={9} className="px-6 py-2.5">
                        <div className="flex items-start gap-3">
                          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider whitespace-nowrap pt-0.5">
                            OCR Match:
                          </span>
                          <div className="space-y-1 text-xs font-mono text-slate-300 leading-relaxed select-text">
                            {snippets.map((snip, idx) => (
                              <div key={idx} className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                {highlightText(snip.snippet, searchQuery)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
