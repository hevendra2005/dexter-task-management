'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { TaskStatus, Priority, STATUS_LABELS, PRIORITY_LABELS } from '@/lib/types';

export default function AddTaskModal({
  defaultStatus = 'todo',
  projectId,
  onClose,
  onCreate,
}: {
  defaultStatus?: TaskStatus;
  projectId?: string;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    status: TaskStatus;
    priority: Priority;
    dueDate?: string;
  }) => Promise<void>;
}) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<Priority>('no_priority');
  const [dueDate, setDueDate] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      await onCreate({ title, status, priority, dueDate: dueDate || undefined });
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">New Task</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-surface-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="mb-3 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />

        <div className="mb-3 grid grid-cols-2 gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="rounded-lg border border-border bg-transparent px-2 py-1.5 text-sm text-ink"
          >
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="rounded-lg border border-border bg-transparent px-2 py-1.5 text-sm text-ink"
          >
            {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mb-4 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-ink"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-ink-muted hover:bg-surface-muted"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={busy || !title.trim()}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg disabled:opacity-50"
          >
            {busy ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
