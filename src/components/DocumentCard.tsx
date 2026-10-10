import React from 'react';
import { 
  FileText, 
  Trash2, 
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DocumentItem, SearchMatch } from '../types/document';
import { highlightText } from '../utils/searchHighlight';

interface DocumentCardProps {
  document: DocumentItem;
  searchMatch?: SearchMatch;
  searchQuery: string;
  onSelect: (doc: DocumentItem) => void;
  onDelete: (id: string) => void;
  onTagClick: (tag: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  searchMatch,
  searchQuery,
  onSelect,
  onDelete,
  onTagClick
}) => {
  const { extracted } = document;

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
      onClick={() => onSelect(document)}
      className="rounded-xl p-4 transition-colors cursor-pointer flex flex-col justify-between group shadow-xs border"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-primary)'
      }}
    >
      <div className="space-y-3">
        
        {/* Header: Title and Delete */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-semibold transition-colors truncate" style={{ color: 'var(--text-primary)' }}>
              {highlightText(document.name, searchQuery)}
            </h3>
            <p className="font-mono text-[11px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
              s3://{document.s3Key}
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(document.id); }}
            className="p-1 rounded hover:opacity-75 transition-colors cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            title="Delete Document"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs pt-1 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>Type</span>
            <span className="font-medium truncate block" style={{ color: 'var(--text-primary)' }}>
              {extracted.documentType}
            </span>
          </div>

          <div>
            <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>Entity</span>
            <span className="font-medium truncate block" style={{ color: 'var(--text-primary)' }}>
              {extracted.vendor ? highlightText(extracted.vendor, searchQuery) : '—'}
            </span>
          </div>

          <div>
            <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>Total Amount</span>
            <span className="font-mono tabular-nums font-bold block" style={{ color: 'var(--text-primary)' }}>
              {extracted.totalAmount !== undefined 
                ? `$${extracted.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
                : '—'}
            </span>
          </div>

          <div>
            <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>Size / Date</span>
            <span className="font-mono tabular-nums text-[11px] block" style={{ color: 'var(--text-secondary)' }}>
              {formatFileSize(document.size)} · {formatDate(document.uploadedAt)}
            </span>
          </div>
        </div>

        {/* Live Search Snippets (If match exists for this query) */}
        {searchMatch && searchMatch.snippets.length > 0 && searchQuery.trim() && (
          <div 
            className="space-y-1 p-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-surface-muted)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <span className="text-[10px] font-mono uppercase tracking-wider block" style={{ color: 'var(--accent)' }}>
              OCR Snippet Match:
            </span>
            {searchMatch.snippets.slice(0, 1).map((snip, idx) => (
              <p key={idx} className="text-xs font-mono leading-relaxed line-clamp-2 select-text" style={{ color: 'var(--text-primary)' }}>
                {highlightText(snip.snippet, searchQuery)}
              </p>
            ))}
          </div>
        )}

        {/* Tags as clean subtle chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {document.tags.map((tag) => (
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
        </div>

      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t flex items-center justify-between text-[11px]" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
        <span className="font-mono text-[10px]">
          Confidence: {extracted.ocrConfidence}%
        </span>
        <span className="flex items-center gap-0.5 text-xs font-medium" style={{ color: 'var(--accent-text)' }}>
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>

    </div>
  );
};
