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
      className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-lg p-4 transition-colors cursor-pointer flex flex-col justify-between group"
    >
      <div className="space-y-3">
        
        {/* Header: Title and Delete */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-semibold text-slate-100 group-hover:text-blue-400 transition-colors truncate">
              {highlightText(document.name, searchQuery)}
            </h3>
            <p className="font-mono text-[11px] text-slate-400 truncate mt-0.5">
              s3://{document.s3Key}
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(document.id); }}
            className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors"
            title="Delete Document"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs pt-1 border-t border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-400 block">Type</span>
            <span className="text-slate-200 font-medium truncate block">
              {extracted.documentType}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block">Entity</span>
            <span className="text-slate-200 font-medium truncate block">
              {extracted.vendor ? highlightText(extracted.vendor, searchQuery) : '—'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block">Total Amount</span>
            <span className="font-mono tabular-nums text-slate-200 font-semibold block">
              {extracted.totalAmount !== undefined 
                ? `$${extracted.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
                : '—'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block">Size / Date</span>
            <span className="font-mono tabular-nums text-slate-400 text-[11px] block">
              {formatFileSize(document.size)} · {formatDate(document.uploadedAt)}
            </span>
          </div>
        </div>

        {/* Live Search Snippets (If match exists for this query) */}
        {searchMatch && searchMatch.snippets.length > 0 && searchQuery.trim() && (
          <div className="space-y-1 bg-slate-950 p-2 rounded border border-slate-800">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
              OCR Snippet Match:
            </span>
            {searchMatch.snippets.slice(0, 1).map((snip, idx) => (
              <p key={idx} className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-2 select-text">
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
              className="inline-flex items-center text-[10px] font-mono text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/60 transition-colors cursor-pointer"
            >
              {highlightText(tag, searchQuery)}
            </button>
          ))}
        </div>

      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-mono text-[10px]">
          Confidence: {extracted.ocrConfidence}%
        </span>
        <span className="text-blue-400 group-hover:text-blue-300 flex items-center gap-0.5 text-xs font-medium">
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>

    </div>
  );
};
