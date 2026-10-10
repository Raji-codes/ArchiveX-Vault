import React, { useState } from 'react';
import { Palette, Check, Sparkles, X, Eye } from 'lucide-react';
import { useTheme, THEME_OPTIONS, ThemeId } from '../context/ThemeContext';
import { ThemeComparisonModal } from './ThemeComparisonModal';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="relative">
        {/* Navbar Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)'
          }}
          title="Switch color palette"
        >
          <Palette className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
          <span className="hidden sm:inline">Theme:</span>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {THEME_OPTIONS.find(t => t.id === currentTheme)?.name.split(' ')[0]}
          </span>
          <span
            className="w-2.5 h-2.5 rounded-full ring-1 ring-black/20"
            style={{ backgroundColor: 'var(--accent)' }}
          />
        </button>

        {/* Popover Menu */}
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <div
              className="absolute right-0 mt-2 w-72 rounded-xl shadow-2xl z-50 p-3 border space-y-2 animate-in fade-in duration-100"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)'
              }}
            >
              <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Palette className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                  <span>Choose Palette</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs p-1 rounded hover:opacity-75 transition-opacity"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {THEME_OPTIONS.map((theme, index) => {
                  const isActive = currentTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setTheme(theme.id);
                        setIsOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between group cursor-pointer"
                      style={{
                        backgroundColor: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                        borderColor: isActive ? 'var(--accent)' : 'var(--border-subtle)',
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Color Preview Swatch */}
                        <div
                          className="w-6 h-6 rounded-md border flex items-center justify-center p-0.5 shrink-0 shadow-inner"
                          style={{
                            backgroundColor: theme.swatch.bg,
                            borderColor: theme.swatch.border
                          }}
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: theme.swatch.accent }}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-semibold flex items-center gap-1.5">
                            <span style={{ color: isActive ? 'var(--accent-text)' : 'var(--text-primary)' }}>
                              {index + 1}. {theme.name}
                            </span>
                          </div>
                          <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                            {theme.subtitle}
                          </p>
                        </div>
                      </div>

                      {isActive && (
                        <Check className="w-3.5 h-3.5 shrink-0 ml-2" style={{ color: 'var(--accent)' }} />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t flex flex-col gap-1.5" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <Eye className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                  <span>Compare All 5 Side-by-Side</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <ThemeComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export const LiveThemeBar: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="border-b px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2.5 transition-colors shadow-xs"
        style={{
          backgroundColor: 'var(--bg-surface-muted)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-secondary)'
        }}
      >
        <div className="flex items-center gap-2 shrink-0">
          <Palette className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
            Color Palettes:
          </span>
          <span className="text-[11px] hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
            (Click any palette to switch instantly)
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {THEME_OPTIONS.map((theme, index) => {
            const isActive = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer shadow-xs border"
                style={{
                  backgroundColor: isActive ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                  borderColor: isActive ? 'var(--accent)' : 'var(--border-subtle)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  transform: isActive ? 'scale(1.02)' : 'none'
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/20"
                  style={{ backgroundColor: theme.swatch.accent }}
                />
                <span>{index + 1}. {theme.name.split('&')[0].trim()}</span>
                {isActive && (
                  <Check className="w-3 h-3 ml-0.5" style={{ color: 'var(--accent)' }} />
                )}
              </button>
            );
          })}

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ml-1"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--accent-text)'
            }}
            title="Open side-by-side visual comparison"
          >
            <Eye className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span>Compare Visuals</span>
          </button>
        </div>
      </div>

      <ThemeComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

