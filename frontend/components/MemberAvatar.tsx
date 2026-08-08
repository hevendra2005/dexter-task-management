'use client';

import { User } from '@/lib/types';

const PALETTE = ['#7C3AED', '#F97316', '#0EA5E9', '#EC4899', '#22C55E', '#EAB308'];

function colorFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function MemberAvatar({
  user,
  size = 22,
}: {
  user: Pick<User, 'id' | 'fullName' | 'avatarUrl'>;
  size?: number;
}) {
  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  if (user.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt={user.fullName}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-medium text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        backgroundColor: colorFor(user.id),
      }}
    >
      {initials}
    </span>
  );
}
