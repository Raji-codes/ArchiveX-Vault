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
      <div className="w-full flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Document Ingestion Portal
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
            Vault Ready
          </span>
        </div>

        <button
          onClick={onOpenDocumentsList}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors cursor-pointer shadow-sm group"
        >
          <Files className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
          <span>View Documents List ({totalDocuments})</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Centered Card */}
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-8 sm:p-10 shadow-lg backdrop-blur-sm relative overflow-hidden">
        
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
          className={`relative border-2 border-dashed rounded-lg p-10 sm:p-12 text-center transition-colors cursor-pointer flex flex-col items-center justify-center ${
            isDragging
              ? 'border-blue-500 bg-blue-950/20'
              : isProcessing
              ? 'border-slate-800 bg-slate-950/40 cursor-not-allowed'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/60 group'
          }`}
        >
          
          {/* Centered Upload Icon */}
          <div className="mb-5">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center transition-colors ${
              isDragging
                ? 'bg-blue-600 text-white'
                : isProcessing
                ? 'bg-slate-800 text-slate-300 border border-slate-700'
                : 'bg-slate-800/80 text-slate-300 border border-slate-700/80 group-hover:border-slate-600 group-hover:text-white'
            }`}>
              {isProcessing ? (
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-blue-400" />
              ) : (
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 group-hover:text-slate-200 transition-colors" />
              )}
            </div>
          </div>

          {/* Heading and Guidance */}
          <div className="max-w-lg space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              {isProcessing
                ? currentPhase || 'Processing Document...'
                : isDragging
                ? 'Drop your document here now'
                : 'Upload Document'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400">
              {isProcessing
                ? 'Extracting text and syncing with storage...'
                : 'Drag and drop your file here, or click to browse'}
            </p>

            <p className="text-xs text-slate-500 pt-1">
              Supports <span className="text-slate-400 font-medium">PDF, Scanned Receipts, Invoices, PNG, JPG, TXT</span> (up to 50 MB)
            </p>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="w-full max-w-md mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">{currentPhase}</span>
                <span className="font-mono tabular-nums text-slate-300">{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Browse Button */}
          {!isProcessing && (
            <div className="mt-5">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-medium transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Browse Files</span>
              </button>
            </div>
          )}

        </div>

        {/* Error Notice */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Successful Upload Banner */}
        {lastUploadedDoc && !isProcessing && (
          <div className="mt-6 p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">
                  Document successfully processed & indexed
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {lastUploadedDoc.name} · {(lastUploadedDoc.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenDocumentsList}
                className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Files className="w-3.5 h-3.5 text-slate-400" />
                <span>View Documents</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
