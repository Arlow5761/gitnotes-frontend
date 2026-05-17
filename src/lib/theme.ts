import { useEffect, useState, useCallback } from 'react';

export type Theme = 'dark' | 'light';

const KEY = 'gitnotes-theme';

function getInitial(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(KEY) as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(t: Theme) {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(t);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const t = getInitial();
    applyTheme(t);
    return t;
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme, setTheme, toggle };
}
