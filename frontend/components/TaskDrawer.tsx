'use client';

import { useEffect, useState } from 'react';
import { X, Send } from 'lucide-react';
import { Task, Comment, STATUS_LABELS, TaskStatus } from '@/lib/types';
import { api } from '@/lib/api';
import PriorityMenu from './PriorityMenu';
import MemberAvatar from './MemberAvatar';
import { useAuth } from './AuthProvider';

export default function TaskDrawer({
  task,
  onClose,
  onUpdate,
}: {
  task: Task;
  onClose: () => void;
  onUpdate: (id: string, data: any) => Promise<void>;
}) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [description, setDescription] = useState(task.description || '');

  useEffect(() => {
    api.listComments(task.id).then(setComments).catch(() => {});
  }, [task.id]);

  const postComment = async () => {
    if (!newComment.trim()) return;
    const comment = await api.addComment(task.id, newComment);
    setComments((c) => [...c, comment]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/30">
      <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-border bg-surface p-6">
        <div className="mb-4 flex items-start justify-between">
          <input
            defaultValue={task.title}
            onBlur={(e) =>
              e.target.value !== task.title &&
              onUpdate(task.id, { title: e.target.value })
            }
            className="w-full bg-transparent text-lg font-semibold text-ink outline-none"
          />
          <button
            onClick={onClose}
            className="ml-2 rounded p-1 hover:bg-surface-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => onUpdate(task.id, { description })}
          placeholder="Add a description..."
          rows={2}
          className="mb-4 w-full resize-none rounded-lg bg-transparent text-sm text-ink-muted outline-none"
        />

        <div className="mb-5 grid grid-cols-[100px_1fr] gap-y-3 border-y border-border py-4 text-sm">
          <span className="text-ink-muted">Status</span>
          <select
            value={task.status}
            onChange={(e) =>
              onUpdate(task.id, { status: e.target.value as TaskStatus })
            }
            className="w-fit rounded-md border border-border bg-transparent px-2 py-1 text-ink"
          >
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>

          <span className="text-ink-muted">Priority</span>
          <PriorityMenu
            value={task.priority}
            onChange={(p) => onUpdate(task.id, { priority: p })}
          />

          <span className="text-ink-muted">Due Date</span>
          <input
            type="date"
            defaultValue={task.dueDate?.slice(0, 10)}
            onChange={(e) => onUpdate(task.id, { dueDate: e.target.value })}
            className="w-fit rounded-md border border-border bg-transparent px-2 py-1 text-ink"
          />

          <span className="text-ink-muted">Members</span>
          <div className="flex items-center gap-1">
            {task.members?.length ? (
              task.members.map((m) => <MemberAvatar key={m.id} user={m} />)
            ) : (
              <span className="text-ink-muted">No members</span>
            )}
          </div>
        </div>

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mb-5">
            <h3 className="mb-2 text-sm font-medium text-ink">Subtasks</h3>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="bg-surface-muted text-ink-muted">
                  <tr>
                    <th className="px-2 py-1.5 text-left">Task</th>
                    <th className="px-2 py-1.5 text-left">Priority</th>
                    <th className="px-2 py-1.5 text-left">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {task.subtasks.map((s) => (
                    <tr key={s.id} className="border-t border-border">
                      <td className="px-2 py-1.5 text-ink">{s.title}</td>
                      <td className="px-2 py-1.5 capitalize text-ink-muted">
                        {s.priority.replace('_', ' ')}
                      </td>
                      <td className="px-2 py-1.5 text-ink-muted">
                        {s.dueDate?.slice(0, 10) || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <h3 className="mb-2 text-sm font-medium text-ink">Updates</h3>
          <div className="mb-3 flex flex-col gap-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2">
                <MemberAvatar user={c.author} />
                <div>
                  <div className="text-sm">
                    <span className="font-medium text-ink">{c.author.fullName}</span>{' '}
                    <span className="text-xs text-ink-muted">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-ink-muted">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {user && <MemberAvatar user={user} />}
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && postComment()}
              placeholder="Leave a reply..."
              className="flex-1 rounded-lg border border-border bg-transparent px-3 py-1.5 text-sm outline-none focus:border-accent"
            />
            <button
              onClick={postComment}
              className="rounded-lg bg-accent p-1.5 text-accent-fg"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
