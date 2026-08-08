'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ColorMode, ThemeMode } from '@/lib/types';
import { useAuth } from './AuthProvider';
import { api } from '@/lib/api';

interface ThemeContextValue {
  theme: ThemeMode;
  colorMode: ColorMode;
  setTheme: (t: ThemeMode) => void;
  setColorMode: (c: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, refreshUser } = useAuth();
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [colorMode, setColorModeState] = useState<ColorMode>('blue');

  // Load from localStorage first (fast paint), then reconcile with user prefs
  useEffect(() => {
    const localTheme = localStorage.getItem('dexter_theme') as ThemeMode | null;
    const localColor = localStorage.getItem('dexter_color') as ColorMode | null;
    if (localTheme) setThemeState(localTheme);
    if (localColor) setColorModeState(localColor);
  }, []);

  useEffect(() => {
    if (user) {
      setThemeState(user.theme);
      setColorModeState(user.colorMode);
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-color', colorMode);
    localStorage.setItem('dexter_theme', theme);
    localStorage.setItem('dexter_color', colorMode);
  }, [theme, colorMode]);

  const setTheme = async (t: ThemeMode) => {
    setThemeState(t);
    if (user) {
      await api.updateMe({ theme: t });
      refreshUser();
    }
  };

  const setColorMode = async (c: ColorMode) => {
    setColorModeState(c);
    if (user) {
      await api.updateMe({ colorMode: c });
      refreshUser();
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
