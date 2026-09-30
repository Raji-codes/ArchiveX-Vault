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
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const addLog = (msg: string) => {
    const time = new Date().toISOString().substring(11, 19);
    setLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsProcessing(true);
    setError(null);
    setLogs([]);
    addLog(`Initiating upload: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

    try {
      const processedDoc = await processDocumentUpload(file, {
        onPhaseChange: (phase, pct) => {
          setCurrentPhase(phase);
          setProgress(pct);
          addLog(phase);
        }
      });

      addLog(`Extraction complete. Assigned tags: ${processedDoc.tags.join(', ')}`);
      onDocumentProcessed(processedDoc);

      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 500);

    } catch (err: any) {
      setError(err?.message || 'Failed to process document');
      setIsProcessing(false);
      addLog(`ERROR: ${err?.message || 'Unknown ingestion error'}`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Upload className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">Upload Document to S3 Storage</h3>
            </div>
          </div>
          <button
            disabled={isProcessing}
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors disabled:opacity-30"
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
            className={`border border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-950/20'
                : isProcessing
                ? 'border-slate-700 bg-slate-950/40 cursor-not-allowed'
                : 'border-slate-700 hover:border-slate-600 bg-slate-950/40'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={e => handleFiles(e.target.files)}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,.json"
            />

            <div className="flex flex-col items-center justify-center space-y-2">
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              ) : (
                <Upload className="w-6 h-6 text-slate-400" />
              )}

              <div>
                <p className="text-xs font-medium text-slate-200">
                  {isProcessing ? currentPhase || 'Processing Document...' : 'Drag and drop file here, or click to browse'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PDF, Scanned Receipts, Invoices, PNG, JPG, TXT (up to 50 MB)
                </p>
              </div>
            </div>
          </div>

          {/* Progress State */}
          {isProcessing && (
            <div className="space-y-2 bg-slate-950 p-3 rounded border border-slate-800 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>{currentPhase}</span>
                <span className="font-mono tabular-nums">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Execution Log */}
          {logs.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Execution Log
              </span>
              <div className="bg-black/90 p-2.5 rounded font-mono text-[10px] text-slate-300 max-h-28 overflow-y-auto space-y-0.5 border border-slate-800 select-text">
                {logs.map((line, idx) => (
                  <div key={idx} className="leading-snug">
                    <span className="text-slate-400">{line.slice(0, 10)}</span>
                    <span className="text-slate-200">{line.slice(10)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-rose-950/40 border border-rose-800 rounded flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
