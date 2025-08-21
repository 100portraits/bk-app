'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ACCENT_COLORS,
  AccentColorKey,
  DEFAULT_THEME,
  ThemeConfig,
  ThemeMode,
  THEME_STORAGE_KEY
} from '@/lib/theme/constants';

interface ThemeContextValue {
  theme: ThemeConfig;
  setThemeMode: (mode: ThemeMode) => void;
  setAccentColor: (color: AccentColorKey) => void;
  effectiveMode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [effectiveMode, setEffectiveMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ThemeConfig;
        setTheme(parsed);
      } catch (e) {
        console.error('Failed to parse stored theme:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateEffectiveMode = () => {
      if (theme.mode === 'system') {
        setEffectiveMode(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setEffectiveMode(theme.mode);
      }
    };

    updateEffectiveMode();
    
    if (theme.mode === 'system') {
      mediaQuery.addEventListener('change', updateEffectiveMode);
      return () => mediaQuery.removeEventListener('change', updateEffectiveMode);
    }
  }, [theme.mode]);

  useEffect(() => {
    const root = document.documentElement;
    
    if (effectiveMode === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
    }
  }, [effectiveMode]);

  useEffect(() => {
    const root = document.documentElement;
    const colors = ACCENT_COLORS[theme.accentColor];
    
    root.style.setProperty('--accent-50', colors['50']);
    root.style.setProperty('--accent-100', colors['100']);
    root.style.setProperty('--accent-200', colors['200']);
    root.style.setProperty('--accent-300', colors['300']);
    root.style.setProperty('--accent-400', colors['400']);
    root.style.setProperty('--accent-500', colors['500']);
    root.style.setProperty('--accent-600', colors['600']);
    root.style.setProperty('--accent-700', colors['700']);
    root.style.setProperty('--accent-800', colors['800']);
    root.style.setProperty('--accent-900', colors['900']);
    root.style.setProperty('--accent-950', colors['950']);
  }, [theme.accentColor]);

  const setThemeMode = (mode: ThemeMode) => {
    setTheme(prev => ({ ...prev, mode }));
  };

  const setAccentColor = (color: AccentColorKey) => {
    setTheme(prev => ({ ...prev, accentColor: color }));
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemeMode, setAccentColor, effectiveMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}