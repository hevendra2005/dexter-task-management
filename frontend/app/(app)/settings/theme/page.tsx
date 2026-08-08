'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import clsx from 'clsx';

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-lg">
      <h1 className="mb-1 text-lg font-semibold text-ink">Theme</h1>
      <p className="mb-6 text-sm text-ink-muted">
        Choose how Dexter looks to you. Your selection is saved and persists
        across sessions.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {(['light', 'dark'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={clsx(
              'rounded-xl border p-4 text-left transition',
              theme === t
                ? 'border-accent ring-1 ring-accent'
                : 'border-border hover:border-ink-muted',
            )}
          >
            <div
              className={clsx(
                'mb-3 flex h-20 items-center justify-center rounded-lg',
                t === 'light' ? 'bg-gray-100' : 'bg-gray-900',
              )}
            >
              {t === 'light' ? (
                <Sun className="h-6 w-6 text-gray-500" />
              ) : (
                <Moon className="h-6 w-6 text-gray-300" />
              )}
            </div>
            <span className="text-sm font-medium capitalize text-ink">{t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
