'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Plus } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import { Project, Task, TaskStatus, STATUS_LABELS, Priority } from '@/lib/types';
import PriorityMenu from '@/components/PriorityMenu';
import MemberAvatar from '@/components/MemberAvatar';
import AddTaskModal from '@/components/AddTaskModal';
import TaskDrawer from '@/components/TaskDrawer';

const STATUS_ORDER: TaskStatus[] = ['todo', 'doing', 'completed', 'on_hold'];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { workspace } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalStatus, setModalStatus] = useState<TaskStatus | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!workspace) return;
    setLoading(true);
    try {
      const [p, t] = await Promise.all([
        api.listProjects(workspace.id).then((all: Project[]) =>
          all.find((x) => x.id === id),
        ),
        api.listTasks(workspace.id, id),
      ]);
      setProject(p || null);
      setTasks(t);
    } finally {
      setLoading(false);
    }
  }, [workspace, id]);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      backlog: [],
      todo: [],
      doing: [],
      completed: [],
      on_hold: [],
    };
    tasks.forEach((t) => map[t.status]?.push(t));
    return map;
  }, [tasks]);

  const createTask = async (data: {
    title: string;
    status: TaskStatus;
    priority: Priority;
    dueDate?: string;
  }) => {
    if (!workspace) return;
    const created = await api.createTask(workspace.id, { ...data, projectId: id });
    setTasks((prev) => [created, ...prev]);
  };

  const updateTask = async (taskId: string, data: any) => {
    const updated = await api.updateTask(taskId, data);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    setActiveTask((prev) => (prev && prev.id === taskId ? updated : prev));
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-border px-6 py-3">
        <button
          onClick={() => router.push('/projects')}
          className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Projects
        </button>
        <span className="text-ink-muted">/</span>
        <h1 className="text-sm font-semibold text-ink">
          {loading ? 'Loading...' : project?.name}
        </h1>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <p className="text-sm text-ink-muted">Loading...</p>
        ) : (
          <div className="flex flex-col gap-6">
            {STATUS_ORDER.map((status) => (
              <div key={status}>
                <h2 className="mb-2 text-sm font-medium text-ink">
                  {STATUS_LABELS[status]}{' '}
                  <span className="text-ink-muted">
                    ({grouped[status].length})
                  </span>
                </h2>
                <div className="overflow-hidden rounded-lg border border-border bg-surface">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-muted text-xs text-ink-muted">
                      <tr>
                        <th className="px-3 py-2 text-left">Task</th>
                        <th className="px-3 py-2 text-left">Priority</th>
                        <th className="px-3 py-2 text-left">Members</th>
                        <th className="px-3 py-2 text-left">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grouped[status].map((task) => (
                        <tr
                          key={task.id}
                          onClick={() => setActiveTask(task)}
                          className="cursor-pointer border-t border-border hover:bg-surface-muted"
                        >
                          <td className="px-3 py-2 text-ink">{task.title}</td>
                          <td className="px-3 py-2">
                            <PriorityMenu
                              value={task.priority}
                              onChange={(p) => updateTask(task.id, { priority: p })}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex -space-x-1.5">
                              {task.members?.slice(0, 3).map((m) => (
                                <MemberAvatar key={m.id} user={m} size={20} />
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-ink-muted">
                            {task.dueDate ? task.dueDate.slice(0, 10) : '-'}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={4} className="px-3 py-1.5">
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
              </div>
            ))}
          </div>
        )}
      </div>

      {modalStatus && (
        <AddTaskModal
          defaultStatus={modalStatus}
          projectId={id}
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
