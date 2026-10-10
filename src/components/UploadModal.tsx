import React, { useState, useRef, DragEvent } from 'react';
import { 
  X, 
  Upload, 
  AlertCircle, 
  Loader2
} from 'lucide-react';
import { processDocumentUpload } from '../services/ocrEngine';
import { DocumentItem } from '../types/document';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentProcessed: (doc: DocumentItem) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentProcessed
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsProcessing(true);
    setError(null);
    setProgress(10);
    setCurrentPhase('Preparing document...');

    try {
      const processedDoc = await processDocumentUpload(file, {
        onPhaseChange: (phase, pct) => {
          setCurrentPhase(phase);
          setProgress(pct);
        }
      });

      onDocumentProcessed(processedDoc);

      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 400);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div 
        className="border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        
        {/* Header */}
        <div 
          className="px-5 py-3.5 border-b flex items-center justify-between transition-colors"
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <div className="flex items-center gap-2.5">
            <div 
              className="w-7 h-7 rounded-lg border flex items-center justify-center"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--accent)'
              }}
            >
              <Upload className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                Upload Document to S3 Storage
              </h3>
            </div>
          </div>
          <button
            disabled={isProcessing}
            onClick={onClose}
            className="p-1 rounded hover:opacity-75 transition-opacity disabled:opacity-30 cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          
          {/* Drag & Drop Box */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer"
            style={{
              backgroundColor: isDragging ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-muted)',
              borderColor: isDragging ? 'var(--accent)' : 'var(--border-subtle)'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={e => handleFiles(e.target.files)}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,.json"
            />

            <div className="flex flex-col items-center justify-center space-y-2.5">
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent)' }} />
              ) : (
                <div 
                  className="w-10 h-10 rounded-lg border flex items-center justify-center shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--accent)'
                  }}
                >
                  <Upload className="w-5 h-5" />
                </div>
              )}

              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {isProcessing ? currentPhase || 'Processing Document...' : 'Drag and drop file here, or click to browse'}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  PDF, Scanned Receipts, Invoices, PNG, JPG, TXT (up to 50 MB)
                </p>
              </div>
            </div>
          </div>

          {/* Progress State */}
          {isProcessing && (
            <div 
              className="space-y-2 p-3 rounded-lg border text-xs"
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>{currentPhase}</span>
                <span className="font-mono tabular-nums font-bold" style={{ color: 'var(--text-primary)' }}>{progress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <div 
                  className="h-full transition-all duration-200"
                  style={{ width: `${progress}%`, backgroundColor: 'var(--accent)' }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
