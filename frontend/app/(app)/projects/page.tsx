'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreHorizontal, Search } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import { Project } from '@/lib/types';
import PriorityMenu from '@/components/PriorityMenu';
import MemberAvatar from '@/components/MemberAvatar';

export default function ProjectsPage() {
  const { workspace, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  const load = useCallback(async () => {
    if (!workspace) return;
    setLoading(true);
    try {
      setProjects(await api.listProjects(workspace.id));
    } finally {
      setLoading(false);
    }
  }, [workspace]);

  useEffect(() => {
    load();
  }, [load]);

  const addProject = async () => {
    if (!workspace || !newName.trim()) return;
    const created = await api.createProject(workspace.id, { name: newName });
    setProjects((p) => [created, ...p]);
    setNewName('');
    setAdding(false);
  };

  const updateProject = async (id: string, data: any) => {
    const updated = await api.updateProject(id, data);
    setProjects((p) => p.map((x) => (x.id === id ? updated : x)));
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-border px-6 py-3">
        <h1 className="text-sm font-semibold text-ink">Projects</h1>
        <div className="ml-auto flex items-center gap-1.5">
          <button className="rounded-md p-1.5 text-ink-muted hover:bg-surface-muted">
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-surface hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Project
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <p className="text-sm text-ink-muted">Loading projects...</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <table className="w-full text-sm">
              <thead className="bg-surface-muted text-xs text-ink-muted">
                <tr>
                  <th className="px-3 py-2 text-left">Projects</th>
                  <th className="px-3 py-2 text-left">Priority</th>
                  <th className="px-3 py-2 text-left">Lead</th>
                  <th className="px-3 py-2 text-left">Due Date</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => router.push(`/projects/${p.id}`)}
                    className="cursor-pointer border-t border-border hover:bg-surface-muted"
                  >
                    <td className="px-3 py-2 text-ink">{p.name}</td>
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      <PriorityMenu
                        value={p.priority}
                        onChange={(pr) => updateProject(p.id, { priority: pr })}
                      />
                    </td>
                    <td className="px-3 py-2">
                      {p.lead ? <MemberAvatar user={p.lead} size={20} /> : '-'}
                    </td>
                    <td className="px-3 py-2 text-ink-muted">
                      {p.dueDate ? p.dueDate.slice(0, 10) : '-'}
                    </td>
                    <td className="px-3 py-2">
                      <MoreHorizontal className="h-4 w-4 text-ink-muted" />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className="px-3 py-2">
                    {adding ? (
                      <input
                        autoFocus
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addProject()}
                        onBlur={addProject}
                        placeholder="Project name"
                        className="w-56 rounded-md border border-border bg-transparent px-2 py-1 text-sm outline-none focus:border-accent"
                      />
                    ) : (
                      <button
                        onClick={() => setAdding(true)}
                        className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
                      >
                        <Plus className="h-3 w-3" /> Add Project
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
