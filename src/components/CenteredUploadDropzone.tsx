import React, { useState, useRef, DragEvent } from 'react';
import { 
  Upload, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Files,
  Sparkles,
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
      
      {/* Top Quick Action Bar to Re-open Documents List */}
      <div className="w-full flex items-center justify-between mb-6 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Document Ingestion Portal
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-950/60 text-blue-400 border border-blue-800/50">
            Vault Ready
          </span>
        </div>

        <button
          onClick={onOpenDocumentsList}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition-all cursor-pointer shadow-sm group"
        >
          <Files className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          <span>View Documents List ({totalDocuments})</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Big Centered Card */}
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <input
          type="file"
          ref={fileInputRef}
          onChange={e => handleFiles(e.target.files)}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,.json"
        />

        {/* Big Centered Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-10 sm:p-12 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
            isDragging
              ? 'border-blue-500 bg-blue-950/40 ring-4 ring-blue-500/20 scale-[1.01]'
              : isProcessing
              ? 'border-slate-700 bg-slate-950/60 cursor-not-allowed'
              : 'border-slate-700/80 hover:border-blue-500/70 bg-slate-950/50 hover:bg-slate-950/80 group'
          }`}
        >
          
          {/* Big Centered Upload Icon with Glow */}
          <div className="mb-6 relative">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
              isDragging
                ? 'bg-blue-600 text-white scale-110 shadow-blue-500/40'
                : isProcessing
                ? 'bg-blue-950/80 text-blue-400 border border-blue-800'
                : 'bg-gradient-to-br from-blue-600/20 via-slate-800 to-slate-900 text-blue-400 group-hover:text-blue-300 border border-blue-500/30 group-hover:border-blue-500/60 group-hover:scale-105 shadow-blue-500/10'
            }`}>
              {isProcessing ? (
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-400" />
              ) : (
                <Upload className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:-translate-y-1" />
              )}
            </div>

            {!isProcessing && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* Heading and Guidance */}
          <div className="max-w-lg space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isProcessing
                ? currentPhase || 'Processing Document...'
                : isDragging
                ? 'Drop your document here now'
                : 'Upload Document'}
            </h2>

            <p className="text-sm text-slate-300">
              {isProcessing
                ? 'Please wait while ArchiveX extracts OCR text, categorizes entities, and syncs to S3 storage.'
                : 'Drag & drop your file here, or click to browse from your device'}
            </p>

            <p className="text-xs text-slate-400 pt-1">
              Supports <span className="text-slate-300 font-medium">PDF, Scanned Receipts, Invoices, PNG, JPG, TIFF, TXT</span> (up to 50 MB)
            </p>
          </div>

          {/* Processing Progress Bar */}
          {isProcessing && (
            <div className="w-full max-w-md mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">{currentPhase}</span>
                <span className="font-mono text-blue-400">{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Browse Button Callout */}
          {!isProcessing && (
            <div className="mt-6">
              <button
                type="button"
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold tracking-wide transition-colors shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Browse Files</span>
              </button>
            </div>
          )}

        </div>

        {/* Error Notice */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Successful Upload Banner */}
        {lastUploadedDoc && !isProcessing && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-900/60 border border-emerald-700/80 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Document successfully processed & indexed!
                </p>
                <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                  {lastUploadedDoc.name} · {(lastUploadedDoc.size / 1024).toFixed(1)} KB · {lastUploadedDoc.tags.join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenDocumentsList}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Files className="w-3.5 h-3.5" />
                <span>View in Documents List</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
