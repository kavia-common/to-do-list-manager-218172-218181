import React from 'react';
import TaskItem from './TaskItem';

/**
 * PUBLIC_INTERFACE
 * TaskList renders a list of TaskItem components.
 */
export default function TaskList({ tasks = [], loading, onToggleComplete, onUpdateTask, onDeleteTask }) {
  if (loading) {
    return <div className="loading" role="status" aria-live="polite">Loading tasks…</div>;
  }

  if (!tasks.length) {
    return <div className="helper" role="note">No tasks yet. Add your first task above.</div>;
  }

  return (
    <div role="list" aria-label="Task list">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          onToggle={onToggleComplete}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
}
