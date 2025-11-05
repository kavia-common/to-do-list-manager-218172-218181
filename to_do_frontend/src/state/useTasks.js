import { useCallback, useEffect, useRef, useState } from 'react';
import { listTasks, createTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask, toggleTaskComplete as apiToggleComplete } from '../api/tasksApi';

// PUBLIC_INTERFACE
export function useTasks() {
  /**
   * Manages tasks list with loading/error state and provides CRUD handlers.
   * Minimal optimistic updates with rollback on failure.
   */
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    refresh();
    return () => { mounted.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const safeSet = useCallback((setter) => {
    if (mounted.current) setter();
  }, []);

  // PUBLIC_INTERFACE
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTasks();
      safeSet(() => setTasks(Array.isArray(data) ? data : []));
    } catch (e) {
      safeSet(() => setError(e?.message || 'Failed to load tasks'));
    } finally {
      safeSet(() => setLoading(false));
    }
  }, [safeSet]);

  // PUBLIC_INTERFACE
  const addTask = useCallback(async (title) => {
    if (!title || !title.trim()) return;
    const tempId = `tmp-${Date.now()}`;
    const optimisticTask = { id: tempId, title: title.trim(), completed: false };
    setTasks((prev) => [optimisticTask, ...prev]);
    try {
      const created = await createTask(title.trim());
      setTasks((prev) => prev.map(t => (t.id === tempId ? created : t)));
    } catch (e) {
      setTasks((prev) => prev.filter(t => t.id !== tempId));
      setError(e?.message || 'Failed to add task');
    }
  }, []);

  // PUBLIC_INTERFACE
  const updateTask = useCallback(async (id, updates) => {
    if (!id) return;
    const prev = tasks;
    setTasks((cur) => cur.map(t => (t.id === id ? { ...t, ...updates } : t)));
    try {
      const updated = await apiUpdateTask(id, updates);
      setTasks((cur) => cur.map(t => (t.id === id ? updated : t)));
    } catch (e) {
      setTasks(prev); // rollback
      setError(e?.message || 'Failed to update task');
    }
  }, [tasks]);

  // PUBLIC_INTERFACE
  const deleteTask = useCallback(async (id) => {
    if (!id) return;
    const prev = tasks;
    setTasks((cur) => cur.filter(t => t.id !== id));
    try {
      await apiDeleteTask(id);
    } catch (e) {
      setTasks(prev); // rollback
      setError(e?.message || 'Failed to delete task');
    }
  }, [tasks]);

  // PUBLIC_INTERFACE
  const toggleComplete = useCallback(async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const nextCompleted = !task.completed;
    const prev = tasks;
    setTasks((cur) => cur.map(t => (t.id === id ? { ...t, completed: nextCompleted } : t)));
    try {
      await apiToggleComplete(id, nextCompleted);
    } catch (e) {
      setTasks(prev); // rollback
      setError(e?.message || 'Failed to toggle complete');
    }
  }, [tasks]);

  return {
    tasks,
    loading,
    error,
    refresh,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };
}
