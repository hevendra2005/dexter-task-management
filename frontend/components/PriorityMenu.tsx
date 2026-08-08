'use client';

import { useState } from 'react';
import { Priority, PRIORITY_LABELS } from '@/lib/types';
import { SignalHigh, SignalMedium, SignalLow, Ban, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const ICONS: Record<Priority, any> = {
  no_priority: Ban,
  urgent: AlertTriangle,
  high: SignalHigh,
  medium: SignalMedium,
  low: SignalLow,
};

const COLORS: Record<Priority, string> = {
  no_priority: 'text-ink-muted',
  urgent: 'text-red-500',
  high: 'text-red-500',
  medium: 'text-amber-500',
  low: 'text-ink-muted',
};

const ORDER: Priority[] = ['no_priority', 'urgent', 'high', 'medium', 'low'];

export default function PriorityMenu({
  value,
  onChange,
}: {
  value: Priority;
  onChange: (p: Priority) => void;
}) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[value];

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={clsx(
          'flex items-center gap-1 rounded px-1.5 py-0.5 text-xs hover:bg-surface-muted',
          COLORS[value],
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {PRIORITY_LABELS[value]}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-20 mt-1 w-40 rounded-lg border border-border bg-surface p-1 text-sm shadow-lg">
            {ORDER.map((p) => {
              const PIcon = ICONS[p];
              return (
                <button
                  key={p}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(p);
                    setOpen(false);
                  }}
                  className={clsx(
                    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-muted',
                    COLORS[p],
                  )}
                >
                  <PIcon className="h-3.5 w-3.5" />
                  {PRIORITY_LABELS[p]}
                  {value === p && <span className="ml-auto text-ink">✓</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
