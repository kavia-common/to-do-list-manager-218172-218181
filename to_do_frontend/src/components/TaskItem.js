import React, { useEffect, useRef, useState } from 'react';

/**
 * TaskItem represents a single task row.
 * PUBLIC_INTERFACE
 */
export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const startEdit = () => {
    setDraft(task.title);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(task.title);
    setEditing(false);
  };

  const saveEdit = () => {
    const next = draft.trim();
    if (next && next !== task.title) {
      onUpdate?.(task.id, { title: next });
    }
    setEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  return (
    <div className="task-row" role="listitem" aria-label={`Task ${task.title}`}>
      <input
        type="checkbox"
        className="checkbox"
        aria-label={task.completed ? 'Mark as not completed' : 'Mark as completed'}
        checked={!!task.completed}
        onChange={() => onToggle?.(task.id)}
      />

      <div>
        {!editing ? (
          <p
            className={`task-title ${task.completed ? 'completed' : ''}`}
            tabIndex={0}
            onDoubleClick={startEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') startEdit();
            }}
            aria-label={`Task title: ${task.title}`}
          >
            {task.title}
          </p>
        ) : (
          <input
            ref={inputRef}
            className="input"
            aria-label="Edit task title"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={saveEdit}
          />
        )}
      </div>

      <div className="task-actions">
        {!editing && (
          <button
            type="button"
            className="btn ghost"
            onClick={startEdit}
            aria-label="Edit task"
            title="Edit"
          >
            ✏️
          </button>
        )}
        {editing && (
          <>
            <button
              type="button"
              className="btn"
              onClick={saveEdit}
              aria-label="Save edits"
              title="Save"
            >
              💾
            </button>
            <button
              type="button"
              className="btn"
              onClick={cancelEdit}
              aria-label="Cancel edit"
              title="Cancel"
            >
              ✖
            </button>
          </>
        )}
        <button
          type="button"
          className="btn"
          onClick={() => onDelete?.(task.id)}
          aria-label="Delete task"
          title="Delete"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
