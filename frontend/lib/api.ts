const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dexter_token');
}

export function setToken(token: string) {
  localStorage.setItem('dexter_token', token);
}

export function clearToken() {
  localStorage.removeItem('dexter_token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  guestLogin: () => request('/auth/guest', { method: 'POST' }),
  me: () => request('/users/me'),
  updateMe: (data: any) =>
    request('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),

  myWorkspace: () => request('/workspaces/mine'),

  listProjects: (workspaceId: string) =>
    request(`/projects?workspaceId=${workspaceId}`),
  createProject: (workspaceId: string, data: any) =>
    request(`/projects?workspaceId=${workspaceId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProject: (id: string, data: any) =>
    request(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProject: (id: string) => request(`/projects/${id}`, { method: 'DELETE' }),

  listTasks: (workspaceId: string, projectId?: string) =>
    request(
      `/tasks?workspaceId=${workspaceId}${projectId ? `&projectId=${projectId}` : ''}`,
    ),
  getTask: (id: string) => request(`/tasks/${id}`),
  createTask: (workspaceId: string, data: any) =>
    request(`/tasks?workspaceId=${workspaceId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTask: (id: string, data: any) =>
    request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTask: (id: string) => request(`/tasks/${id}`, { method: 'DELETE' }),

  listComments: (taskId: string) => request(`/tasks/${taskId}/comments`),
  addComment: (taskId: string, content: string) =>
    request(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};

export { API_URL, getToken };
