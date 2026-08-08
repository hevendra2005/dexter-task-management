'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { api, clearToken, getToken, setToken } from '@/lib/api';
import { User, Workspace } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  workspace: Workspace | null;
  loading: boolean;
  loginAsGuest: () => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const bootstrap = useCallback(async () => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    try {
      const me = await api.me();
      setUser(me);
      const ws = await api.myWorkspace();
      setWorkspace(ws);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const loginAsGuest = useCallback(async () => {
    const { user, accessToken } = await api.guestLogin();
    setToken(accessToken);
    setUser(user);
    const ws = await api.myWorkspace();
    setWorkspace(ws);
    router.push('/tasks');
  }, [router]);

  const loginWithToken = useCallback(
    async (token: string) => {
      setToken(token);
      const me = await api.me();
      setUser(me);
      const ws = await api.myWorkspace();
      setWorkspace(ws);
      router.push('/tasks');
    },
    [router],
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setWorkspace(null);
    router.push('/login');
  }, [router]);

  const refreshUser = useCallback(async () => {
    const me = await api.me();
    setUser(me);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        loading,
        loginAsGuest,
        loginWithToken,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
