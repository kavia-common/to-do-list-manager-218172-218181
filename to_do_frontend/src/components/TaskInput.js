import React, { useCallback, useRef, useState } from 'react';

/**
 * TaskInput component: text input and add button.
 * PUBLIC_INTERFACE
 */
export default function TaskInput({ onAdd, disabled }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const handleAdd = useCallback(() => {
    const v = value.trim();
    if (!v) return;
    onAdd?.(v);
    setValue('');
    inputRef.current?.focus();
  }, [onAdd, value]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Escape') {
      setValue('');
    }
  };

  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        <input
          ref={inputRef}
          type="text"
          className="input"
          placeholder="Add a new task..."
          aria-label="Task title"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
        />
        <button
          type="button"
          className="btn primary"
          onClick={handleAdd}
          aria-label="Add task"
          disabled={disabled || !value.trim()}
        >
          Add
        </button>
      </div>
      <div className="helper">Press Enter to add. Esc to clear.</div>
    </div>
  );
}
