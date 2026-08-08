'use client';

import { useTheme } from '@/components/ThemeProvider';
import { COLOR_SWATCHES } from '@/lib/types';
import clsx from 'clsx';

export default function ColorSettingsPage() {
  const { colorMode, setColorMode } = useTheme();

  return (
    <div className="max-w-lg">
      <h1 className="mb-1 text-lg font-semibold text-ink">Color</h1>
      <p className="mb-6 text-sm text-ink-muted">
        Pick an accent color for buttons, links and highlights across Dexter.
      </p>

      <div className="grid grid-cols-3 gap-4">
        {COLOR_SWATCHES.map((c) => (
          <button
            key={c.key}
            onClick={() => setColorMode(c.key)}
            className={clsx(
              'flex flex-col items-center gap-2 rounded-xl border p-4 transition',
              colorMode === c.key
                ? 'border-accent ring-1 ring-accent'
                : 'border-border hover:border-ink-muted',
            )}
          >
            <span
              className="h-8 w-8 rounded-full"
              style={{ backgroundColor: c.hex }}
            />
            <span className="text-sm text-ink">{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
