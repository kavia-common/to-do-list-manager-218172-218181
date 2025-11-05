import { apiRequest } from './client';

// PUBLIC_INTERFACE
export async function listTasks() {
  /** Retrieve all tasks. Returns an array of tasks. */
  return apiRequest('/tasks', { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function createTask(title) {
  /** Create a new task with a title. Returns created task. */
  return apiRequest('/tasks', { method: 'POST', body: { title } });
}

// PUBLIC_INTERFACE
export async function updateTask(id, updates) {
  /** Update an existing task by id with fields in updates. Returns updated task. */
  return apiRequest(`/tasks/${encodeURIComponent(id)}`, { method: 'PUT', body: updates });
}

// PUBLIC_INTERFACE
export async function deleteTask(id) {
  /** Delete task by id. Returns success or deleted task. */
  return apiRequest(`/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// PUBLIC_INTERFACE
export async function toggleTaskComplete(id, completed) {
  /** Toggle completion status of a task. Returns updated task. */
  return apiRequest(`/tasks/${encodeURIComponent(id)}`, { method: 'PATCH', body: { completed } });
}
