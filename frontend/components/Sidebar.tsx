'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ChevronsUpDown,
  ListTodo,
  FolderKanban,
  Palette,
  Sun,
  Moon,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useTheme } from './ThemeProvider';
import { COLOR_SWATCHES } from '@/lib/types';
import clsx from 'clsx';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, workspace, logout } = useAuth();
  const { theme, colorMode, setTheme, setColorMode } = useTheme();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [subMenu, setSubMenu] = useState<'theme' | 'color' | null>(null);

  const navItems = [
    { href: '/tasks', label: 'Tasks', icon: ListTodo },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
  ];

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-sidebar text-sidebar-ink">
      <div className="flex items-center gap-2 px-4 py-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-accent-fg">
          <Zap className="h-3.5 w-3.5" />
        </span>
        <span className="text-sm font-medium text-white">
          {workspace?.name || 'Dexter'}
        </span>
        <ChevronsUpDown className="ml-auto h-3.5 w-3.5 opacity-60" />
      </div>

      <div className="px-4 pb-2 pt-2 text-[11px] font-medium uppercase tracking-wide opacity-50">
        Workspace
      </div>

      <nav className="flex flex-col gap-0.5 px-2">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition',
                active
                  ? 'bg-sidebar-active text-white'
                  : 'text-sidebar-ink hover:bg-sidebar-active hover:text-white',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 p-2">
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-sidebar-active"
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium text-white"
              style={{ backgroundColor: user?.avatarColor || '#7C3AED' }}
            >
              {(user?.fullName || 'G')[0]}
            </span>
            <span className="truncate">{user?.fullName}</span>
          </button>

          {menuOpen && (
            <div className="absolute bottom-full left-0 mb-1 w-52 rounded-lg border border-white/10 bg-[#1a1a1e] p-1 text-sm shadow-xl">
              {subMenu === null && (
                <>
                  <div className="border-b border-white/10 px-2 py-2">
                    <div className="truncate font-medium text-white">
                      {user?.fullName}
                    </div>
                    <div className="truncate text-xs opacity-60">
                      {user?.email || 'Guest account'}
                    </div>
                  </div>
                  <button
                    onClick={() => setSubMenu('theme')}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-active"
                  >
                    {theme === 'dark' ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                    Change Theme
                  </button>
                  <button
                    onClick={() => setSubMenu('color')}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-active"
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: 'var(--accent)' }}
                    />
                    Color Mode
                  </button>
                  <Link
                    href="/settings/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-active"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-red-400 hover:bg-sidebar-active"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </>
              )}

              {subMenu === 'theme' && (
                <>
                  <button
                    onClick={() => setSubMenu(null)}
                    className="mb-1 w-full px-2 py-1 text-left text-xs opacity-60 hover:opacity-100"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setTheme('light')}
                    className={clsx(
                      'flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-active',
                      theme === 'light' && 'text-white',
                    )}
                  >
                    <Sun className="h-4 w-4" /> Light{' '}
                    {theme === 'light' && <span className="ml-auto">✓</span>}
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={clsx(
                      'flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-active',
                      theme === 'dark' && 'text-white',
                    )}
                  >
                    <Moon className="h-4 w-4" /> Dark{' '}
                    {theme === 'dark' && <span className="ml-auto">✓</span>}
                  </button>
                </>
              )}

              {subMenu === 'color' && (
                <>
                  <button
                    onClick={() => setSubMenu(null)}
                    className="mb-1 w-full px-2 py-1 text-left text-xs opacity-60 hover:opacity-100"
                  >
                    ← Back
                  </button>
                  {COLOR_SWATCHES.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setColorMode(c.key)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-active"
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.label}
                      {colorMode === c.key && <span className="ml-auto">✓</span>}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
