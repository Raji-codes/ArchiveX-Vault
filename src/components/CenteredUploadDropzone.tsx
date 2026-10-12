import React, { useState, useRef, DragEvent } from 'react';
import { 
  Upload, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Files, 
  ExternalLink,
  Clock,
  FileText,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { processDocumentUpload } from '../services/ocrEngine';
import { DocumentItem } from '../types/document';

interface CenteredUploadDropzoneProps {
  onDocumentProcessed: (doc: DocumentItem) => void;
  onOpenDocumentsList: () => void;
  onInspectDocument?: (doc: DocumentItem) => void;
  recentDocuments?: DocumentItem[];
  totalDocuments: number;
}

export const CenteredUploadDropzone: React.FC<CenteredUploadDropzoneProps> = ({
  onDocumentProcessed,
  onOpenDocumentsList,
  onInspectDocument,
  recentDocuments = [],
  totalDocuments
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastUploadedDoc, setLastUploadedDoc] = useState<DocumentItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return isoString;
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsProcessing(true);
    setError(null);
    setLastUploadedDoc(null);
    setCurrentPhase('Preparing document upload...');
    setProgress(5);

    try {
      const processedDoc = await processDocumentUpload(file, {
        onPhaseChange: (phase, pct) => {
          setCurrentPhase(phase);
          setProgress(pct);
        }
      });

      onDocumentProcessed(processedDoc);
      setLastUploadedDoc(processedDoc);
      setIsProcessing(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to process document');
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isProcessing) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Recent files to display (top 5 latest)
  const displayRecent = recentDocuments.slice(0, 5);

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 max-w-3xl mx-auto w-full animate-fadeIn space-y-6">
      
      {/* Main Centered Dropzone Card */}
      <div 
        className="w-full border rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={e => handleFiles(e.target.files)}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,.json"
        />

        {/* Dropzone Container */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className="relative border-2 border-dashed rounded-xl p-10 sm:p-14 text-center transition-all cursor-pointer flex flex-col items-center justify-center group"
          style={{
            backgroundColor: isDragging ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-muted)',
            borderColor: isDragging ? 'var(--accent)' : 'var(--border-subtle)'
          }}
        >
          {/* Upload Icon Badge */}
          <div className="mb-5">
            <div 
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center transition-all border shadow-xs"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: isDragging ? 'var(--accent)' : 'var(--border-subtle)',
                color: 'var(--accent)'
              }}
            >
              {isProcessing ? (
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
              ) : (
                <Upload className="w-8 h-8 transition-transform group-hover:scale-110" />
              )}
            </div>
          </div>

          {/* Heading and Guidance */}
          <div className="max-w-md space-y-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {isProcessing
                ? currentPhase || 'Processing Document...'
                : isDragging
                ? 'Drop your document here'
                : 'Upload Document'}
            </h2>

            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              {isProcessing
                ? 'Extracting structured fields and optical OCR...'
                : 'Drag and drop your file here, or click to browse'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <span className="px-2 py-0.5 rounded border font-mono" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>PDF</span>
              <span className="px-2 py-0.5 rounded border font-mono" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>PNG / JPG</span>
              <span className="px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>Invoices</span>
              <span className="px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>Receipts</span>
              <span>· Up to 50 MB</span>
            </div>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="w-full max-w-sm mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-mono text-[11px] truncate">{currentPhase}</span>
                <span className="font-mono tabular-nums font-bold" style={{ color: 'var(--text-primary)' }}>{progress}%</span>
              </div>
              <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: 'var(--bg-surface-elevated)' }}>
                <div 
                  className="h-full transition-all duration-200"
                  style={{ width: `${progress}%`, backgroundColor: 'var(--accent)' }}
                />
              </div>
            </div>
          )}

          {/* Browse Files Button */}
          {!isProcessing && (
            <div className="mt-6">
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:opacity-90"
                style={{
                  backgroundColor: 'var(--btn-primary-bg)',
                  color: 'var(--btn-primary-text)'
                }}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Browse Files</span>
              </button>
            </div>
          )}
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Successful Upload Banner */}
        {lastUploadedDoc && !isProcessing && (
          <div 
            className="mt-6 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn"
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                style={{ 
                  backgroundColor: 'var(--bg-surface)', 
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--accent)' 
                }}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  {lastUploadedDoc.name}
                </p>
                <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {(lastUploadedDoc.size / 1024).toFixed(1)} KB · {lastUploadedDoc.extracted.vendor || 'Document'} · ${(lastUploadedDoc.extracted.totalAmount ?? 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onInspectDocument && (
                <button
                  onClick={() => onInspectDocument(lastUploadedDoc)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--btn-primary-bg)',
                    color: 'var(--btn-primary-text)'
                  }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect in Workbench</span>
                </button>
              )}
              <button
                onClick={onOpenDocumentsList}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                <Files className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                <span>Go to Vault ({totalDocuments})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Files Section */}
      {displayRecent.length > 0 && (
        <div 
          className="w-full border rounded-2xl p-5 sm:p-6 shadow-sm transition-colors"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h3 className="text-xs font-bold tracking-tight uppercase" style={{ color: 'var(--text-secondary)' }}>
                Recent Files
              </h3>
              <span 
                className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium"
                style={{ 
                  backgroundColor: 'var(--bg-surface-elevated)', 
                  color: 'var(--text-secondary)' 
                }}
              >
                {recentDocuments.length}
              </span>
            </div>

            <button
              onClick={onOpenDocumentsList}
              className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-80 cursor-pointer"
              style={{ color: 'var(--accent-text)' }}
            >
              <span>View all in Vault ({totalDocuments})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Files List */}
          <div className="divide-y mt-1" style={{ borderColor: 'var(--border-subtle)' }}>
            {displayRecent.map(doc => (
              <div
                key={doc.id}
                onClick={() => onInspectDocument?.(doc)}
                className="py-3 px-2 -mx-2 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer group hover:bg-[var(--bg-surface-elevated)]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors group-hover:border-[var(--accent)]"
                    style={{
                      backgroundColor: 'var(--bg-surface-muted)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <FileText className="w-4 h-4 group-hover:text-[var(--accent)] transition-colors" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      <span>{doc.extracted.vendor || doc.extracted.documentType}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{formatFileSize(doc.size)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDate(doc.uploadedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {doc.extracted.totalAmount !== undefined && (
                    <span 
                      className="text-xs font-mono font-semibold tabular-nums px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: 'var(--bg-surface-elevated)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      ${doc.extracted.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                  <div 
                    className="p-1 rounded-md transition-colors text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                  >
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

