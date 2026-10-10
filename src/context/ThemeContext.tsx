import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'graphite-brass' | 'obsidian-mint' | 'swiss-mono' | 'warm-paper' | 'terminal-orange';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  subtitle: string;
  vibe: string;
  isDark: boolean;
  swatch: {
    bg: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    accent: string;
    accentText: string;
    text: string;
    textSecondary: string;
    btnBg: string;
    btnText: string;
  };
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'graphite-brass',
    name: 'Warm Graphite & Brass',
    subtitle: 'Linear / Raycast engineering dark aesthetic',
    vibe: 'Precision developer tooling, deep warm graphite with rich amber accents. Zero AI-cyan.',
    isDark: true,
    swatch: {
      bg: '#0e0e11',
      surface: '#15151a',
      surfaceElevated: '#1c1c23',
      border: '#26262f',
      accent: '#f59e0b',
      accentText: '#fbbf24',
      text: '#f4f4f6',
      textSecondary: '#a1a1aa',
      btnBg: '#f59e0b',
      btnText: '#181200'
    }
  },
  {
    id: 'obsidian-mint',
    name: 'Obsidian & Forest Mint',
    subtitle: 'Supabase / Linear modern fintech aesthetic',
    vibe: 'Deep pitch obsidian surfaces balanced by organic emerald and mint accents. Fresh and calm.',
    isDark: true,
    swatch: {
      bg: '#08090a',
      surface: '#0f1215',
      surfaceElevated: '#161b20',
      border: '#1c2226',
      accent: '#10b981',
      accentText: '#34d399',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      btnBg: '#10b981',
      btnText: '#022c22'
    }
  },
  {
    id: 'swiss-mono',
    name: 'Swiss Monochrome',
    subtitle: 'Pure architectural black & stark white',
    vibe: 'Ultra-clean high-contrast typography. No distracting hues, pure focus on document data.',
    isDark: true,
    swatch: {
      bg: '#000000',
      surface: '#0c0c0c',
      surfaceElevated: '#171717',
      border: '#222222',
      accent: '#ffffff',
      accentText: '#ffffff',
      text: '#ffffff',
      textSecondary: '#a3a3a3',
      btnBg: '#ffffff',
      btnText: '#000000'
    }
  },
  {
    id: 'warm-paper',
    name: 'Warm Paper (Editorial Light)',
    subtitle: 'Archival bone cream & terracotta ink',
    vibe: 'Human editorial reading experience. Calming warm cream surfaces with dark charcoal type.',
    isDark: false,
    swatch: {
      bg: '#f7f6f2',
      surface: '#ffffff',
      surfaceElevated: '#f0eee8',
      border: '#e4e2da',
      accent: '#c2410c',
      accentText: '#ea580c',
      text: '#1c1917',
      textSecondary: '#57534e',
      btnBg: '#1c1917',
      btnText: '#fafaf9'
    }
  },
  {
    id: 'terminal-orange',
    name: 'Terminal Asphalt & Terracotta',
    subtitle: 'GitHub dark & JetBrains engineering vibe',
    vibe: 'Infrastructure & terminal aesthetic with rich burnt orange highlights and crisp steel borders.',
    isDark: true,
    swatch: {
      bg: '#0d1117',
      surface: '#161b22',
      surfaceElevated: '#21262d',
      border: '#30363d',
      accent: '#f97316',
      accentText: '#fb923c',
      text: '#f0f6fc',
      textSecondary: '#8b949e',
      btnBg: '#f97316',
      btnText: '#190900'
    }
  }
];

interface ThemeContextType {
  currentTheme: ThemeId;
  setTheme: (id: ThemeId) => void;
  activeThemeOption: ThemeOption;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('archivex_active_theme') as ThemeId;
      if (saved && THEME_OPTIONS.some(t => t.id === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'warm-paper';
  });

  const activeThemeOption = THEME_OPTIONS.find(t => t.id === currentTheme) || THEME_OPTIONS[0];

  useEffect(() => {
    try {
      localStorage.setItem('archivex_active_theme', currentTheme);
      document.documentElement.setAttribute('data-theme', currentTheme);
      if (activeThemeOption.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // ignore
    }
  }, [currentTheme, activeThemeOption]);

  const setTheme = (id: ThemeId) => {
    setCurrentTheme(id);
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme,
      activeThemeOption,
      isDark: activeThemeOption.isDark
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
