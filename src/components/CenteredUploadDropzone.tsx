import React, { useState, useRef, DragEvent } from 'react';
import { 
  Upload, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Files,
  ArrowRight
} from 'lucide-react';
import { processDocumentUpload } from '../services/ocrEngine';
import { DocumentItem } from '../types/document';

interface CenteredUploadDropzoneProps {
  onDocumentProcessed: (doc: DocumentItem) => void;
  onOpenDocumentsList: () => void;
  totalDocuments: number;
}

export const CenteredUploadDropzone: React.FC<CenteredUploadDropzoneProps> = ({
  onDocumentProcessed,
  onOpenDocumentsList,
  totalDocuments
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastUploadedDoc, setLastUploadedDoc] = useState<DocumentItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4 py-8 max-w-4xl mx-auto w-full">
      
      {/* Top Quick Action Bar */}
      <div 
        className="w-full flex items-center justify-between mb-6 pb-3 border-b transition-colors"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Document Ingestion Portal
          </span>
          <span 
            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border"
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            Vault Ready
          </span>
        </div>

        <button
          onClick={onOpenDocumentsList}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer shadow-xs group"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)'
          }}
        >
          <Files className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          <span>View Documents List ({totalDocuments})</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* Main Centered Card */}
      <div 
        className="w-full border rounded-2xl p-8 sm:p-10 shadow-sm relative overflow-hidden transition-colors"
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

        {/* Centered Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className="relative border-2 border-dashed rounded-xl p-10 sm:p-12 text-center transition-colors cursor-pointer flex flex-col items-center justify-center group"
          style={{
            backgroundColor: isDragging ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-muted)',
            borderColor: isDragging ? 'var(--accent)' : 'var(--border-subtle)'
          }}
        >
          
          {/* Centered Upload Icon */}
          <div className="mb-5">
            <div 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-colors border"
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--accent)'
              }}
            >
              {isProcessing ? (
                <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin" style={{ color: 'var(--accent)' }} />
              ) : (
                <Upload className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-105" />
              )}
            </div>
          </div>

          {/* Heading and Guidance */}
          <div className="max-w-lg space-y-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {isProcessing
                ? currentPhase || 'Processing Document...'
                : isDragging
                ? 'Drop your document here'
                : 'Upload Document'}
            </h2>

            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              {isProcessing
                ? 'Extracting text and syncing with storage...'
                : 'Drag and drop your file here, or click to browse'}
            </p>

            <p className="text-xs pt-1" style={{ color: 'var(--text-muted)' }}>
              Supports <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>PDF, Scanned Receipts, Invoices, PNG, JPG, TXT</span> (up to 50 MB)
            </p>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="w-full max-w-md mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-mono">{currentPhase}</span>
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

          {/* Browse Button */}
          {!isProcessing && (
            <div className="mt-5">
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all shadow-sm flex items-center gap-2 cursor-pointer"
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
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Successful Upload Banner */}
        {lastUploadedDoc && !isProcessing && (
          <div 
            className="mt-6 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              backgroundColor: 'var(--bg-surface-muted)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  Document successfully processed & indexed
                </p>
                <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {lastUploadedDoc.name} · {(lastUploadedDoc.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
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
                <span>View Documents</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
