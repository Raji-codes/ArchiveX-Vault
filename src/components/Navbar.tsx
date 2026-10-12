import React from 'react';
import { Upload, Files, Compass } from 'lucide-react';

interface NavbarProps {
  currentView: 'portal' | 'vault';
  onNavigate: (view: 'portal' | 'vault') => void;
  totalDocuments: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  totalDocuments
}) => {
  return (
    <header 
      className="border-b backdrop-blur-md sticky top-0 z-30 transition-colors w-full"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-primary)'
      }}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Wordmark */}
          <div className="flex items-center gap-4 sm:gap-6 select-none">
            <div 
              onClick={() => onNavigate('portal')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div 
                className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm tracking-wider shadow-xs transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                AX
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                  ArchiveX
                </span>
                <span className="text-[11px] font-medium leading-none" style={{ color: 'var(--text-secondary)' }}>
                  Document Portal
                </span>
              </div>
            </div>

            <div className="h-6 w-px hidden sm:block" style={{ backgroundColor: 'var(--border-subtle)' }} />

            {/* Editorial Segmented Navigation */}
            <nav className="flex items-center p-1 sm:p-1.5 rounded-xl border shadow-xs" style={{ backgroundColor: 'var(--bg-surface-muted)', borderColor: 'var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => onNavigate('portal')}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: currentView === 'portal' ? 'var(--bg-surface)' : 'transparent',
                  color: currentView === 'portal' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: currentView === 'portal' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <Upload className="w-4 h-4" style={{ color: currentView === 'portal' ? 'var(--accent)' : 'var(--text-muted)' }} />
                <span>Upload Portal</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('vault')}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: currentView === 'vault' ? 'var(--bg-surface)' : 'transparent',
                  color: currentView === 'vault' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: currentView === 'vault' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <Files className="w-4 h-4" style={{ color: currentView === 'vault' ? 'var(--accent)' : 'var(--text-muted)' }} />
                <span>Vault</span>
                <span 
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono border tabular-nums"
                  style={{
                    backgroundColor: currentView === 'vault' ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {totalDocuments}
                </span>
              </button>
            </nav>
          </div>

          {/* Quick Header Action */}
          <div className="flex items-center gap-3">
            {currentView === 'portal' ? (
              <button
                onClick={() => onNavigate('vault')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer shadow-xs hover:opacity-95"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)'
                }}
                title="Browse existing documents"
              >
                <Files className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <span>Browse Vault ({totalDocuments})</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('portal')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer hover:opacity-90"
                style={{
                  backgroundColor: 'var(--btn-primary-bg)',
                  color: 'var(--btn-primary-text)'
                }}
                title="Upload document"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Portal</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
