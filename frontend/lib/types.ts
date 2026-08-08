export type ThemeMode = 'light' | 'dark';
export type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';
export type TaskStatus = 'backlog' | 'todo' | 'doing' | 'completed' | 'on_hold';
export type Priority = 'no_priority' | 'urgent' | 'high' | 'medium' | 'low';

export interface User {
  id: string;
  email?: string;
  fullName: string;
  title?: string;
  username?: string;
  avatarUrl?: string;
  avatarColor: string;
  isGuest: boolean;
  theme: ThemeMode;
  colorMode: ColorMode;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
}

export interface Project {
  id: string;
  name: string;
  priority: Priority;
  lead?: User | null;
  dueDate?: string;
  workspaceId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  reporter?: User;
  members: User[];
  projectId?: string;
  parentId?: string;
  subtasks?: Task[];
  workspaceId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  taskId: string;
  createdAt: string;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  doing: 'Doing',
  completed: 'Completed',
  on_hold: 'On Hold',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  no_priority: 'No Priority',
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  no_priority: 'text-ink-muted',
  urgent: 'text-red-500',
  high: 'text-red-500',
  medium: 'text-amber-500',
  low: 'text-ink-muted',
};

export const COLOR_SWATCHES: { key: ColorMode; hex: string; label: string }[] = [
  { key: 'amber', hex: '#f59e0b', label: 'Amber' },
  { key: 'blue', hex: '#6d5efc', label: 'Blue' },
  { key: 'pink', hex: '#ec4899', label: 'Pink' },
  { key: 'rose', hex: '#f43f5e', label: 'Rose' },
  { key: 'emerald', hex: '#10b981', label: 'Emerald' },
  { key: 'black', hex: '#18181b', label: 'Black' },
];
