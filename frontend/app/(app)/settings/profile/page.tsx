'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import MemberAvatar from '@/components/MemberAvatar';

export default function ProfileSettingsPage() {
  const { user, refreshUser, logout } = useAuth();
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setTitle(user.title || '');
      setUsername(user.username || '');
    }
  }, [user]);

  const save = async () => {
    setSaving(true);
    try {
      await api.updateMe({ fullName, title, username });
      await refreshUser();
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-lg font-semibold text-ink">Profile</h1>

      <div className="mb-6 flex items-center gap-3">
        <MemberAvatar user={user} size={56} />
      </div>

      <label className="mb-1 block text-xs text-ink-muted">Email</label>
      <input
        disabled
        value={user.email || 'Guest account (no email)'}
        className="mb-4 w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-ink-muted"
      />

      <label className="mb-1 block text-xs text-ink-muted">Full name</label>
      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="mb-4 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-accent"
      />

      <label className="mb-1 block text-xs text-ink-muted">
        Title
        <span className="ml-1 text-ink-muted/60">Your job title or role</span>
      </label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-accent"
      />

      <label className="mb-1 block text-xs text-ink-muted">
        Username
        <span className="ml-1 text-ink-muted/60">One word, like a nickname or first name</span>
      </label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-6 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-accent"
      />

      <button
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save changes'}
      </button>

      <div className="mt-10 border-t border-border pt-6">
        <h2 className="mb-2 text-sm font-medium text-ink">Workspace access</h2>
        <button
          onClick={logout}
          className="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-500 hover:bg-red-100"
        >
          Leave Workspace
        </button>
      </div>
    </div>
  );
}
