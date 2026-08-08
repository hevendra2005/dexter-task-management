'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, User as UserIcon, Sun, Palette } from 'lucide-react';
import clsx from 'clsx';

const NAV = [
  { href: '/settings/profile', label: 'Profile', icon: UserIcon },
  { href: '/settings/theme', label: 'Theme', icon: Sun },
  { href: '/settings/color', label: 'Color', icon: Palette },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-full">
      <div className="w-56 shrink-0 border-r border-border p-4">
        <button
          onClick={() => router.push('/tasks')}
          className="mb-4 flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Back to app
        </button>
        <div className="mb-2 px-1 text-xs text-ink-muted">
          <input
            placeholder="Search"
            className="w-full rounded-md border border-border bg-transparent px-2 py-1 text-sm outline-none"
          />
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm',
                  active
                    ? 'bg-surface-muted text-ink'
                    : 'text-ink-muted hover:bg-surface-muted hover:text-ink',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto p-8">{children}</div>
    </div>
  );
}
