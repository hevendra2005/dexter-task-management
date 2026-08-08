'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? '/tasks' : '/login');
  }, [loading, user, router]);

  return (
    <div className="flex h-screen items-center justify-center text-ink-muted">
      Loading...
    </div>
  );
}
