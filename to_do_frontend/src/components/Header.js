import React, { useEffect, useMemo, useState } from 'react';
import { getApiBase, getHealthcheckPath } from '../utils/env';

/**
 * Header component with title, counters, refresh and theme toggle.
 * PUBLIC_INTERFACE
 */
export default function Header({ title, totalCount = 0, completedCount = 0, onRefresh, theme, onToggleTheme }) {
  // Optional, non-blocking healthcheck based on env.
  const healthPath = getHealthcheckPath();
  const apiBase = useMemo(() => getApiBase(), []);
  const [health, setHealth] = useState({ status: 'idle' }); // idle | ok | fail

  useEffect(() => {
    let cancelled = false;
    if (!healthPath) return;

    const controller = new AbortController();
    const url = `${apiBase}${healthPath.startsWith('/') ? '' : '/'}${healthPath}`;

    // Fire and forget, don't block UI.
    fetch(url, { method: 'GET', signal: controller.signal })
      .then((res) => {
        if (!cancelled) setHealth({ status: res.ok ? 'ok' : 'fail' });
      })
      .catch(() => {
        if (!cancelled) setHealth({ status: 'fail' });
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [apiBase, healthPath]);

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

      {healthPath && (
        <div className="container" aria-live="polite" style={{ marginTop: 8 }}>
          <div
            className="helper"
            role="note"
            title={`Healthcheck ${health.status === 'ok' ? 'passed' : health.status === 'fail' ? 'failed' : 'pending'}`}
          >
            API health: {health.status === 'idle' ? 'checking…' : health.status === 'ok' ? 'ok' : 'unavailable'}
          </div>
        </div>
      )}
    </header>
  );
}
