import React from 'react';

/**
 * Header component with title, counters, refresh and theme toggle.
 * PUBLIC_INTERFACE
 */
export default function Header({ title, totalCount = 0, completedCount = 0, onRefresh, theme, onToggleTheme }) {
  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <div className="brand">
          <div className="icon-pill" aria-hidden="true">📝</div>
          <h1 className="title">{title}</h1>
        </div>

        <div className="row">
          <div className="counters" aria-label="Task counters">
            <span title="Total tasks">Total: {totalCount}</span>
            <span aria-hidden="true">•</span>
            <span title="Completed tasks">Done: {completedCount}</span>
          </div>
          <button
            type="button"
            className="btn ghost"
            onClick={onRefresh}
            aria-label="Refresh tasks"
            title="Refresh"
          >
            ↻ Refresh
          </button>
          <button
            type="button"
            className="btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </header>
  );
}
