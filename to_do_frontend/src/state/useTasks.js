import { useCallback, useEffect, useRef, useState } from 'react';
import { listTasks, createTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask, toggleTaskComplete as apiToggleComplete } from '../api/tasksApi';

// PUBLIC_INTERFACE
export function useTasks() {
  /**
   * Manages tasks list with loading/error state and provides CRUD handlers.
   * Minimal optimistic updates with rollback on failure.
   * On network failures, avoid loud UI errors and surface subtle empty states.
   */
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  // Keep an internal error for diagnostics but don't render loud banners by default
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  const safeSet = useCallback((setter) => {
    if (mounted.current) setter();
  }, []);

  // Background refresh with quiet retry/backoff
  const backgroundRefresh = useCallback(async () => {
    const maxAttempts = 2;
    const baseDelayMs = 300;
    for (let i = 0; i <= maxAttempts; i++) {
      const data = await listTasks();
      if (Array.isArray(data)) {
        safeSet(() => setTasks(data));
        return;
      }
      if (i < maxAttempts) {
        await new Promise((r) => setTimeout(r, baseDelayMs * Math.pow(2, i)));
      }
    }
  }, [safeSet]);

  useEffect(() => {
    mounted.current = true;
    (async () => {
      setLoading(true);
      setError(null);
      const data = await listTasks();
      safeSet(() => setTasks(Array.isArray(data) ? data : []));
      safeSet(() => setLoading(false));
      // If initial load failed (null), schedule a background retry quietly
      if (!Array.isArray(data)) {
        backgroundRefresh();
      }
    })();

    return () => { mounted.current = false; };
  }, [backgroundRefresh, safeSet]);

  // PUBLIC_INTERFACE
  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await listTasks();
    safeSet(() => setTasks(Array.isArray(data) ? data : []));
    safeSet(() => setLoading(false));
  }, [safeSet]);

  // PUBLIC_INTERFACE
  const addTask = useCallback(async (title) => {
    if (!title || !title.trim()) return;
    const tempId = `tmp-${Date.now()}`;
    const optimisticTask = { id: tempId, title: title.trim(), completed: false };
    setTasks((prev) => [optimisticTask, ...prev]);
    const created = await createTask(title.trim());
    if (created && created.id !== undefined) {
      setTasks((prev) => prev.map(t => (t.id === tempId ? created : t)));
    } else {
      // rollback quietly
      setTasks((prev) => prev.filter(t => t.id !== tempId));
      setError('Failed to add task');
    }
  }, []);

  // PUBLIC_INTERFACE
  const updateTask = useCallback(async (id, updates) => {
    if (!id) return;
    const prev = tasks;
    setTasks((cur) => cur.map(t => (t.id === id ? { ...t, ...updates } : t)));
    const updated = await apiUpdateTask(id, updates);
    if (updated && updated.id !== undefined) {
      setTasks((cur) => cur.map(t => (t.id === id ? updated : t)));
    } else {
      // rollback quietly
      setTasks(prev);
      setError('Failed to update task');
    }
  }, [tasks]);

  // PUBLIC_INTERFACE
  const deleteTask = useCallback(async (id) => {
    if (!id) return;
    const prev = tasks;
    setTasks((cur) => cur.filter(t => t.id !== id));
    const res = await apiDeleteTask(id);
    if (res === null) {
      // rollback quietly
      setTasks(prev);
      setError('Failed to delete task');
    }
  }, [tasks]);

  // PUBLIC_INTERFACE
  const toggleComplete = useCallback(async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const nextCompleted = !task.completed;
    const prev = tasks;
    setTasks((cur) => cur.map(t => (t.id === id ? { ...t, completed: nextCompleted } : t)));
    const res = await apiToggleComplete(id, nextCompleted);
    if (res === null) {
      // rollback quietly
      setTasks(prev);
      setError('Failed to toggle complete');
    }
  }, [tasks]);

  return {
    tasks,
    loading,
    error, // kept for potential verbose mode display
    refresh,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };
}
