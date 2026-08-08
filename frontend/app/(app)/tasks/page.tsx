'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Filter,
  Plus,
  List as ListIcon,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import {
  Task,
  TaskStatus,
  STATUS_LABELS,
  Priority,
} from '@/lib/types';
import PriorityMenu from '@/components/PriorityMenu';
import MemberAvatar from '@/components/MemberAvatar';
import AddTaskModal from '@/components/AddTaskModal';
import TaskDrawer from '@/components/TaskDrawer';
import clsx from 'clsx';

const STATUS_ORDER: TaskStatus[] = ['todo', 'doing', 'completed', 'on_hold'];

const COLUMNS = [
  { key: 'title', label: 'Task' },
  { key: 'priority', label: 'Priority' },
  { key: 'members', label: 'Members' },
  { key: 'dueDate', label: 'Due Date' },
] as const;

export default function TasksPage() {
  const { workspace } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'list' | 'board'>('list');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Set<string>>(
    new Set(['priority', 'members', 'dueDate']),
  );
  const [collapsed, setCollapsed] = useState<Set<TaskStatus>>(new Set());
  const [modalStatus, setModalStatus] = useState<TaskStatus | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!workspace) return;
    setLoading(true);
    try {
      const data = await api.listTasks(workspace.id);
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }, [workspace]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      tasks.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [tasks, search],
  );

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      backlog: [],
      todo: [],
      doing: [],
      completed: [],
      on_hold: [],
    };
    filtered.forEach((t) => map[t.status]?.push(t));
    return map;
  }, [filtered]);

  const toggleCollapsed = (s: TaskStatus) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  const createTask = async (data: {
    title: string;
    status: TaskStatus;
    priority: Priority;
    dueDate?: string;
  }) => {
    if (!workspace) return;
    const created = await api.createTask(workspace.id, data);
    setTasks((prev) => [created, ...prev]);
  };

  const updateTask = async (id: string, data: any) => {
    const updated = await api.updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    setActiveTask((prev) => (prev && prev.id === id ? updated : prev));
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-border px-6 py-3">
        <h1 className="text-sm font-semibold text-ink">Tasks</h1>
        <div className="ml-auto flex items-center gap-1.5">
          {showSearch ? (
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => !search && setShowSearch(false)}
              placeholder="Search tasks..."
              className="w-48 rounded-md border border-border bg-transparent px-2 py-1 text-sm outline-none"
            />
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="rounded-md p-1.5 text-ink-muted hover:bg-surface-muted"
            >
              <Search className="h-4 w-4" />
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setFieldsOpen((o) => !o)}
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-ink-muted hover:bg-surface-muted"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Fields
            </button>
            {fieldsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setFieldsOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-border bg-surface p-1 text-sm shadow-lg">
                  {COLUMNS.filter((c) => c.key !== 'title').map((c) => (
                    <label
                      key={c.key}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-muted"
                    >
                      <input
                        type="checkbox"
                        checked={visibleCols.has(c.key)}
                        onChange={() =>
                          setVisibleCols((prev) => {
                            const next = new Set(prev);
                            next.has(c.key) ? next.delete(c.key) : next.add(c.key);
                            return next;
                          })
                        }
                      />
                      {c.label}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          <button className="rounded-md p-1.5 text-ink-muted hover:bg-surface-muted">
            <Filter className="h-4 w-4" />
          </button>

          <div className="mx-1 flex items-center rounded-md border border-border p-0.5">
            <button
              onClick={() => setView('list')}
              className={clsx(
                'rounded px-2 py-1 text-xs',
                view === 'list' ? 'bg-accent text-accent-fg' : 'text-ink-muted',
              )}
            >
              <ListIcon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setView('board')}
              className={clsx(
                'rounded px-2 py-1 text-xs',
                view === 'board' ? 'bg-accent text-accent-fg' : 'text-ink-muted',
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={() => setModalStatus('todo')}
            className="flex items-center gap-1 rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-surface hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <p className="text-sm text-ink-muted">Loading tasks...</p>
        ) : view === 'list' ? (
          <div className="flex flex-col gap-6">
            {STATUS_ORDER.map((status) => {
              const items = grouped[status];
              const isCollapsed = collapsed.has(status);
              return (
                <div key={status}>
                  <button
                    onClick={() => toggleCollapsed(status)}
                    className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                    {STATUS_LABELS[status]}
                    <span className="text-ink-muted">({items.length})</span>
                  </button>

                  {!isCollapsed && (
                    <div className="overflow-hidden rounded-lg border border-border bg-surface">
                      <table className="w-full text-sm">
                        <thead className="bg-surface-muted text-xs text-ink-muted">
                          <tr>
                            <th className="px-3 py-2 text-left">Task</th>
                            {visibleCols.has('priority') && (
                              <th className="px-3 py-2 text-left">Priority</th>
                            )}
                            {visibleCols.has('members') && (
                              <th className="px-3 py-2 text-left">Members</th>
                            )}
                            {visibleCols.has('dueDate') && (
                              <th className="px-3 py-2 text-left">Due Date</th>
                            )}
                            <th className="px-3 py-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((task) => (
                            <tr
                              key={task.id}
                              onClick={() => setActiveTask(task)}
                              className="cursor-pointer border-t border-border hover:bg-surface-muted"
                            >
                              <td className="px-3 py-2 text-ink">{task.title}</td>
                              {visibleCols.has('priority') && (
                                <td className="px-3 py-2">
                                  <PriorityMenu
                                    value={task.priority}
                                    onChange={(p) => updateTask(task.id, { priority: p })}
                                  />
                                </td>
                              )}
                              {visibleCols.has('members') && (
                                <td className="px-3 py-2">
                                  <div className="flex -space-x-1.5">
                                    {task.members?.slice(0, 3).map((m) => (
                                      <MemberAvatar key={m.id} user={m} size={20} />
                                    ))}
                                  </div>
                                </td>
                              )}
                              {visibleCols.has('dueDate') && (
                                <td className="px-3 py-2 text-ink-muted">
                                  {task.dueDate ? task.dueDate.slice(0, 10) : '-'}
                                </td>
                              )}
                              <td className="px-3 py-2">
                                <MoreHorizontal className="h-4 w-4 text-ink-muted" />
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={5} className="px-3 py-1.5">
                              <button
                                onClick={() => setModalStatus(status)}
                                className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
                              >
                                <Plus className="h-3 w-3" /> Add Task
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STATUS_ORDER.map((status) => (
              <div key={status} className="w-72 shrink-0">
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-sm font-medium text-ink">
                    {STATUS_LABELS[status]}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-muted">
                      {grouped[status].length}
                    </span>
                    <button onClick={() => setModalStatus(status)}>
                      <Plus className="h-3.5 w-3.5 text-ink-muted" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {grouped[status].map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setActiveTask(task)}
                      className="cursor-pointer rounded-lg border border-border bg-surface p-3 shadow-sm hover:border-accent"
                    >
                      <p className="mb-2 text-sm text-ink">{task.title}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-1.5">
                          {task.members?.slice(0, 3).map((m) => (
                            <MemberAvatar key={m.id} user={m} size={18} />
                          ))}
                        </div>
                        {task.dueDate && (
                          <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[10px] text-ink-muted">
                            {task.dueDate.slice(5, 10)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setModalStatus(status)}
                    className="rounded-lg border border-dashed border-border py-1.5 text-xs text-ink-muted hover:border-accent hover:text-accent"
                  >
                    + Add Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalStatus && (
        <AddTaskModal
          defaultStatus={modalStatus}
          onClose={() => setModalStatus(null)}
          onCreate={createTask}
        />
      )}

      {activeTask && (
        <TaskDrawer
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onUpdate={updateTask}
        />
      )}
    </div>
  );
}
