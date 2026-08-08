'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { API_URL } from '@/lib/api';

export default function LoginPage() {
  const { loginAsGuest } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleGuest = async () => {
    setBusy(true);
    try {
      await loginAsGuest();
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-surface">
            <Zap className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium text-ink">Dexter</span>
        </div>

        <h1 className="text-center text-xl font-semibold text-ink">
          Let&apos;s get back on track
        </h1>
        <p className="mt-1 text-center text-sm text-ink-muted">
          Enter your email below to login to your account.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleGuest}
            disabled={busy}
            className="w-full rounded-lg bg-ink py-2.5 text-sm font-medium text-surface transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? 'Signing in...' : 'Continue as Guest'}
          </button>
          <button
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-ink transition hover:bg-surface-muted"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.64v3h3.87c2.27-2.09 3.55-5.17 3.55-8.88z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.87-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.76 0 3.34.61 4.59 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75z"
              />
            </svg>
            Login with Google
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted">
          By clicking continue, you agree to our{' '}
          <a className="underline" href="#">
            Terms of Service
          </a>{' '}
          and{' '}
          <a className="underline" href="#">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
