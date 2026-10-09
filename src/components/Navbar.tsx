import React from 'react';
import { Upload, Files, ChevronDown, ChevronUp } from 'lucide-react';

interface NavbarProps {
  isDocumentsListOpen: boolean;
  onToggleDocumentsList: () => void;
  onOpenUpload: () => void;
  totalDocuments: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDocumentsListOpen,
  onToggleDocumentsList,
  onOpenUpload,
  totalDocuments
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950 text-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand & Wordmark + Documents Toggle Icon */}
          <div className="flex items-center gap-3 sm:gap-4 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-100 font-semibold text-xs tracking-wider">
                AX
              </div>
              <span className="font-semibold text-sm tracking-tight text-white">ArchiveX</span>
            </div>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            {/* Documents Icon Button */}
            <button
              onClick={onToggleDocumentsList}
              className={`inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                isDocumentsListOpen 
                  ? 'bg-slate-800 text-white border border-slate-700' 
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800'
              }`}
              title={isDocumentsListOpen ? "Click to close documents list" : "Click to view documents list"}
            >
              <Files className="w-3.5 h-3.5 text-slate-400" />
              <span>Documents</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                {totalDocuments}
              </span>
              {isDocumentsListOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>

          {/* Primary Actions */}
          <div className="flex items-center gap-2">
            {isDocumentsListOpen ? (
              <button
                onClick={onOpenUpload}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-md transition-colors shadow-sm cursor-pointer"
                title="Open upload drag and drop"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Document</span>
              </button>
            ) : (
              <button
                onClick={onToggleDocumentsList}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md transition-colors cursor-pointer"
                title="View documents list"
              >
                <Files className="w-3.5 h-3.5 text-blue-400" />
                <span>View Documents ({totalDocuments})</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
