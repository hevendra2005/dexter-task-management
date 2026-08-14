'use client';

import { GripVertical, MoreHorizontal, Calendar, Tag as TagIcon } from 'lucide-react';
import { Task, PRIORITY_LABELS } from '@/lib/types';
import MemberAvatar from './MemberAvatar';

const AVATAR_BG = ['#7C3AED', '#F97316', '#0EA5E9', '#EC4899', '#22C55E', '#EAB308'];

function squareColorFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_BG[Math.abs(hash) % AVATAR_BG.length];
}

function formatDate(d?: string) {
  if (!d) return null;
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
}

export default function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) {
  const assignee = task.members?.[0];
  const dueLabel = formatDate(task.dueDate);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-border bg-surface p-3 shadow-sm transition hover:border-accent hover:shadow-md"
    >
      <div className="mb-2 flex items-start gap-1.5">
        <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted opacity-0 transition group-hover:opacity-60" />
        <p className="flex-1 text-sm font-medium leading-snug text-ink">
          {task.title}
        </p>
        <MoreHorizontal className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted opacity-0 transition group-hover:opacity-100" />
      </div>

      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          {assignee ? (
            <>
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold text-white"
                style={{ backgroundColor: squareColorFor(assignee.id) }}
              >
                {assignee.fullName?.[0]?.toUpperCase() || '?'}
              </span>
              <span className="truncate text-xs text-ink-muted">
                {assignee.fullName}
              </span>
            </>
          ) : (
            <span className="text-xs text-ink-muted/60">Unassigned</span>
          )}
        </div>

        {dueLabel && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-500">
            <Calendar className="h-2.5 w-2.5" />
            {dueLabel}
          </span>
        )}
      </div>

      {(task.priority !== 'no_priority' || (task.members && task.members.length > 1)) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {task.priority !== 'no_priority' && (
            <span className="flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] text-ink-muted">
              <TagIcon className="h-2.5 w-2.5" />
              {PRIORITY_LABELS[task.priority]}
            </span>
          )}
          {task.members && task.members.length > 1 && (
            <div className="flex -space-x-1.5">
              {task.members.slice(1, 4).map((m) => (
                <MemberAvatar key={m.id} user={m} size={16} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}