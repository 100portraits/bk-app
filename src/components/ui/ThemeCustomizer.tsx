'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ACCENT_COLORS, AccentColorKey, ThemeMode } from '@/lib/theme/constants';
import { IconSun, IconMoon, IconDeviceDesktop, IconPalette, IconX } from '@tabler/icons-react';

export function ThemeCustomizer() {
  const { theme, setThemeMode, setAccentColor, effectiveMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeModes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <IconSun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <IconMoon className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <IconDeviceDesktop className="w-4 h-4" /> }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-accent-500 text-white rounded-full shadow-lg hover:bg-accent-600 transition-colors"
        aria-label="Open theme customizer"
      >
        <IconPalette className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 p-4 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Customize Theme</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Close customizer"
            >
              <IconX className="w-5 h-5 text-zinc-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                Theme Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {themeModes.map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => setThemeMode(value)}
                    className={`
                      flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all
                      ${theme.mode === value 
                        ? 'border-accent-500 bg-accent-50 dark:bg-accent-950 text-accent-700 dark:text-accent-300' 
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-accent-300 dark:hover:border-accent-700'
                      }
                    `}
                  >
                    {icon}
                    <span className="text-xs mt-1">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                Accent Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(ACCENT_COLORS) as AccentColorKey[]).map(colorKey => {
                  const color = ACCENT_COLORS[colorKey];
                  return (
                    <button
                      key={colorKey}
                      onClick={() => setAccentColor(colorKey)}
                      className={`
                        group relative h-10 rounded-lg border-2 transition-all overflow-hidden
                        ${theme.accentColor === colorKey 
                          ? 'border-zinc-900 dark:border-white scale-110' 
                          : 'border-zinc-300 dark:border-zinc-600 hover:scale-105'
                        }
                      `}
                      style={{
                        backgroundColor: `rgb(${color['500']})`
                      }}
                      aria-label={`Select ${color.name} accent color`}
                    >
                      {theme.accentColor === colorKey && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-3 h-3 bg-white rounded-full" />
                        </div>
                      )}
                      <span className="sr-only">{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Current: {effectiveMode} mode</span>
                <span className="capitalize">{theme.accentColor} accent</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ThemeCustomizerCompact() {
  const { theme, setThemeMode, effectiveMode } = useTheme();

  const toggleTheme = () => {
    if (theme.mode === 'light') {
      setThemeMode('dark');
    } else if (theme.mode === 'dark') {
      setThemeMode('system');
    } else {
      setThemeMode('light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
      aria-label="Toggle theme mode"
    >
      {theme.mode === 'light' && <IconSun className="w-5 h-5" />}
      {theme.mode === 'dark' && <IconMoon className="w-5 h-5" />}
      {theme.mode === 'system' && <IconDeviceDesktop className="w-5 h-5" />}
    </button>
  );
}