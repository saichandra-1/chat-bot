'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const darkModeEnabled = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] hover:-translate-y-0.5 hover:bg-[var(--bg-muted)]"
      aria-label="Toggle theme"
      title={darkModeEnabled ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkModeEnabled ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
