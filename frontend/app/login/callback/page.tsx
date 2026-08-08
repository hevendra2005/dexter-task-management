'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

function CallbackInner() {
  const { loginWithToken } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      loginWithToken(token);
    } else {
      router.replace('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div className="flex h-screen items-center justify-center text-ink-muted">
      Signing you in...
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-ink-muted">
          Signing you in...
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
