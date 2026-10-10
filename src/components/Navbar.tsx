import React from 'react';
import { Upload, Files, Cloud } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

interface NavbarProps {
  isDocumentsListOpen: boolean;
  onToggleDocumentsList: () => void;
  onOpenUpload: () => void;
  onOpenS3Config?: () => void;
  totalDocuments: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpload,
  onOpenS3Config,
  totalDocuments
}) => {
  return (
    <header 
      className="border-b backdrop-blur-md sticky top-0 z-30 transition-colors"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-primary)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand & Wordmark */}
          <div className="flex items-center gap-3 select-none">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-7 h-7 rounded-lg border flex items-center justify-center font-semibold text-xs tracking-wider"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                AX
              </div>
              <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
                ArchiveX
              </span>
            </div>

            <div className="h-3.5 w-px hidden sm:block" style={{ backgroundColor: 'var(--border-subtle)' }} />

            <div className="hidden sm:flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <Files className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              <span>Vault</span>
              <span 
                className="px-1.5 py-0.2 rounded text-[11px] font-mono border tabular-nums"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)'
                }}
              >
                {totalDocuments}
              </span>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex items-center gap-2">
            {/* Live Theme Switcher */}
            <ThemeSwitcher />

            {onOpenS3Config && (
              <button
                onClick={onOpenS3Config}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)'
                }}
                title="AWS S3 & Textract settings"
              >
                <Cloud className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                <span className="hidden sm:inline">AWS S3</span>
              </button>
            )}

            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-sm cursor-pointer"
              style={{
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)'
              }}
              title="Upload document"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
