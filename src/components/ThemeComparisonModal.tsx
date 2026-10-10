import React from 'react';
import { X, Check, Sparkles, Layout, Palette } from 'lucide-react';
import { useTheme, THEME_OPTIONS, ThemeOption } from '../context/ThemeContext';

interface ThemeComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeComparisonModal: React.FC<ThemeComparisonModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border overflow-hidden transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Modal Header */}
        <div 
          className="p-5 border-b flex items-start justify-between gap-4 shrink-0"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
              >
                <Palette className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Compare & Choose Color Palette
              </h2>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Here are the 5 human-designed palettes. Click any card to apply it live to the entire document vault.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:opacity-75 transition-opacity cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            title="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content: 5 Visual Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEME_OPTIONS.map((theme, index) => {
              const isActive = currentTheme === theme.id;
              const { swatch } = theme;

              return (
                <div
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`rounded-xl border p-4 flex flex-col justify-between transition-all cursor-pointer relative group ${
                    isActive ? 'ring-2 shadow-lg' : 'hover:border-opacity-100 opacity-95 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: swatch.surface,
                    borderColor: isActive ? swatch.accent : swatch.border,
                    color: swatch.text,
                    boxShadow: isActive ? `0 0 0 1px ${swatch.accent}` : undefined
                  }}
                >
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span 
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold"
                      style={{
                        backgroundColor: swatch.bg,
                        borderColor: swatch.border,
                        color: swatch.textSecondary
                      }}
                    >
                      Option {index + 1}
                    </span>

                    {isActive ? (
                      <span 
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: swatch.accent,
                          color: swatch.btnText
                        }}
                      >
                        <Check className="w-3 h-3" />
                        Active Now
                      </span>
                    ) : (
                      <span 
                        className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: swatch.accentText }}
                      >
                        Click to apply →
                      </span>
                    )}
                  </div>

                  {/* Title & Vibe Description */}
                  <div className="space-y-1 mb-3.5">
                    <h3 className="font-bold text-sm tracking-tight" style={{ color: swatch.text }}>
                      {theme.name}
                    </h3>
                    <p className="text-[11px] line-clamp-2" style={{ color: swatch.textSecondary }}>
                      {theme.vibe}
                    </p>
                  </div>

                  {/* Live Rendered Mockup Frame */}
                  <div 
                    className="rounded-lg p-2.5 border mb-3.5 space-y-2 text-xs select-none shadow-xs"
                    style={{
                      backgroundColor: swatch.bg,
                      borderColor: swatch.border,
                    }}
                  >
                    {/* Mini App Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b" style={{ borderColor: swatch.border }}>
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-3.5 h-3.5 rounded text-[8px] font-bold flex items-center justify-center"
                          style={{ backgroundColor: swatch.accent, color: swatch.btnText }}
                        >
                          AX
                        </div>
                        <span className="font-semibold text-[10px]" style={{ color: swatch.text }}>
                          ArchiveX
                        </span>
                      </div>
                      <div 
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium"
                        style={{ backgroundColor: swatch.surfaceElevated, color: swatch.textSecondary }}
                      >
                        12 docs
                      </div>
                    </div>

                    {/* Mini Document Item Row */}
                    <div 
                      className="p-2 rounded border flex items-center justify-between gap-1.5"
                      style={{
                        backgroundColor: swatch.surface,
                        borderColor: swatch.border
                      }}
                    >
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium truncate" style={{ color: swatch.text }}>
                          AWS_Invoice_Dec.pdf
                        </div>
                        <div className="text-[9px]" style={{ color: swatch.textSecondary }}>
                          Amazon Web Services
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] font-bold font-mono" style={{ color: swatch.text }}>
                          $4,250.00
                        </div>
                        <span 
                          className="text-[8px] font-mono px-1 rounded"
                          style={{
                            backgroundColor: swatch.accent,
                            color: swatch.btnText,
                            opacity: 0.9
                          }}
                        >
                          PROCESSED
                        </span>
                      </div>
                    </div>

                    {/* Mini Primary CTA Button */}
                    <button
                      type="button"
                      className="w-full py-1 rounded text-[10px] font-semibold text-center transition-opacity"
                      style={{
                        backgroundColor: swatch.btnBg,
                        color: swatch.btnText
                      }}
                    >
                      + Upload Document
                    </button>
                  </div>

                  {/* Color Palette Swatches */}
                  <div className="pt-2 border-t space-y-1.5" style={{ borderColor: swatch.border }}>
                    <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: swatch.textSecondary }}>
                      Color Palette Tokens:
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      <div className="space-y-0.5 text-center">
                        <div 
                          className="h-5 rounded border shadow-inner" 
                          style={{ backgroundColor: swatch.bg, borderColor: swatch.border }} 
                          title={`Background Canvas: ${swatch.bg}`}
                        />
                        <span className="text-[8px] font-mono block truncate" style={{ color: swatch.textSecondary }}>
                          {swatch.bg}
                        </span>
                      </div>
                      <div className="space-y-0.5 text-center">
                        <div 
                          className="h-5 rounded border shadow-inner" 
                          style={{ backgroundColor: swatch.surface, borderColor: swatch.border }} 
                          title={`Surface Card: ${swatch.surface}`}
                        />
                        <span className="text-[8px] font-mono block truncate" style={{ color: swatch.textSecondary }}>
                          {swatch.surface}
                        </span>
                      </div>
                      <div className="space-y-0.5 text-center">
                        <div 
                          className="h-5 rounded shadow-sm" 
                          style={{ backgroundColor: swatch.accent }} 
                          title={`Primary Accent: ${swatch.accent}`}
                        />
                        <span className="text-[8px] font-mono block truncate font-semibold" style={{ color: swatch.accentText }}>
                          {swatch.accent}
                        </span>
                      </div>
                      <div className="space-y-0.5 text-center">
                        <div 
                          className="h-5 rounded border shadow-inner" 
                          style={{ backgroundColor: swatch.text, borderColor: swatch.border }} 
                          title={`Primary Text: ${swatch.text}`}
                        />
                        <span className="text-[8px] font-mono block truncate" style={{ color: swatch.textSecondary }}>
                          {swatch.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Action Button */}
                  <div className="pt-3 mt-3 border-t" style={{ borderColor: swatch.border }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTheme(theme.id);
                      }}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isActive ? 'shadow-sm' : 'hover:opacity-90 active:scale-[0.98]'
                      }`}
                      style={{
                        backgroundColor: isActive ? swatch.surfaceElevated : swatch.btnBg,
                        color: isActive ? swatch.accentText : swatch.btnText,
                        border: `1px solid ${isActive ? swatch.accent : 'transparent'}`
                      }}
                    >
                      {isActive ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Currently Active</span>
                        </>
                      ) : (
                        <span>Apply & Preview This Palette</span>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div 
          className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0"
          style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface-muted)' }}
        >
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span>All palettes use zero generic neon-cyan AI slop. Choose the one that feels best to you.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)'
            }}
          >
            Done Viewing
          </button>
        </div>

      </div>
    </div>
  );
};
