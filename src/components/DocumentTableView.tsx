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
    <div 
      className="border rounded-xl overflow-hidden shadow-sm transition-colors"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)'
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" style={{ color: 'var(--text-primary)' }}>
          
          {/* Table Header */}
          <thead 
            className="border-b font-medium text-[11px] uppercase tracking-wider transition-colors"
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            <tr>
              <th className="w-10 px-3 py-3 text-center">
                <button 
                  onClick={onSelectAll}
                  className="hover:opacity-75 transition-opacity cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                  title={allSelected ? "Deselect All" : "Select All"}
                >
                  {allSelected ? (
                    <CheckSquare className="w-4 h-4" style={{ color: 'var(--accent)' }} />
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
          <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {searchResults.map(({ document: doc, snippets }) => {
              const isSelected = selectedDocIds.includes(doc.id);
              const hasSnippets = snippets.length > 0 && searchQuery.trim().length > 0;

              return (
                <React.Fragment key={doc.id}>
                  <tr 
                    className="transition-colors group cursor-pointer hover:opacity-90"
                    style={{
                      backgroundColor: isSelected ? 'var(--bg-surface-elevated)' : 'transparent',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}
                    onClick={() => onInspectDocument(doc)}
                  >
                    
                    {/* Checkbox */}
                    <td className="px-3 py-3 text-center" onClick={(e) => { e.stopPropagation(); onToggleSelect(doc.id); }}>
                      <button className="hover:opacity-75 transition-opacity cursor-pointer">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                        ) : (
                          <Square className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        )}
                      </button>
                    </td>

                    {/* Document Name & S3 Path */}
                    <td className="px-4 py-3">
                      <div className="font-semibold truncate max-w-xs transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {highlightText(doc.name, searchQuery)}
                      </div>
                      <div className="font-mono text-[11px] truncate max-w-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        s3://{doc.s3Bucket}/{doc.s3Key}
                      </div>
                    </td>

                    {/* Document Type */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span 
                        className="text-xs font-medium px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: 'var(--bg-surface-elevated)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {doc.extracted.documentType}
                      </span>
                    </td>

                    {/* Entity / Vendor */}
                    <td className="px-4 py-3 truncate max-w-[160px]">
                      <span className="font-medium truncate block" style={{ color: 'var(--text-primary)' }}>
                        {doc.extracted.vendor ? highlightText(doc.extracted.vendor, searchQuery) : '—'}
                      </span>
                      {doc.extracted.invoiceNumber && (
                        <span className="font-mono text-[10px] block" style={{ color: 'var(--text-muted)' }}>
                          #{doc.extracted.invoiceNumber}
                        </span>
                      )}
                    </td>

                    {/* Extracted Total */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {doc.extracted.totalAmount !== undefined ? (
                        <span className="font-mono tabular-nums font-bold" style={{ color: 'var(--text-primary)' }}>
                          ${doc.extracted.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>

                    {/* Smart Tags */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                        {doc.tags.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
                            className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors cursor-pointer"
                            style={{
                              backgroundColor: 'var(--bg-surface-elevated)',
                              borderColor: 'var(--border-subtle)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            {highlightText(tag, searchQuery)}
                          </button>
                        ))}
                        {doc.tags.length > 3 && (
                          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                            +{doc.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* File Size */}
                    <td className="px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {formatFileSize(doc.size)}
                    </td>

                    {/* Upload Date */}
                    <td className="px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {formatDate(doc.uploadedAt)}
                    </td>

                    {/* Action buttons */}
                    <td className="px-4 py-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onInspectDocument(doc)}
                          className="p-1 rounded hover:opacity-75 transition-opacity"
                          style={{ color: 'var(--text-secondary)' }}
                          title="Inspect OCR"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-1 rounded hover:text-rose-400 transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>

                  {/* Search Match Snippet Row */}
                  {hasSnippets && (
                    <tr 
                      className="border-b"
                      style={{
                        backgroundColor: 'var(--bg-surface-muted)',
                        borderColor: 'var(--border-subtle)'
                      }}
                    >
                      <td colSpan={9} className="px-6 py-2.5">
                        <div className="flex items-start gap-3">
                          <span className="text-[10px] font-mono uppercase tracking-wider whitespace-nowrap pt-0.5" style={{ color: 'var(--accent)' }}>
                            OCR Match:
                          </span>
                          <div className="space-y-1 text-xs font-mono leading-relaxed select-text" style={{ color: 'var(--text-primary)' }}>
                            {snippets.map((snip, idx) => (
                              <div 
                                key={idx} 
                                className="px-2 py-1 rounded border"
                                style={{
                                  backgroundColor: 'var(--bg-surface)',
                                  borderColor: 'var(--border-subtle)'
                                }}
                              >
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
