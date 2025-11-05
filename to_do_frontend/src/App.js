import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './styles/theme.css';
import './index.css';
import Header from './components/Header';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import { useTasks } from './state/useTasks';
import { getWsUrl } from './utils/env';

/**
 * PUBLIC_INTERFACE
 * App
 * Root component for the To-Do application. Assembles the header, input, and list.
 */
function App() {
  const [theme, setTheme] = useState('light');
  const { tasks, loading, error, addTask, updateTask, deleteTask, toggleComplete, refresh } = useTasks();
  const wsUrl = useMemo(() => getWsUrl(), []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="app-root">
      <Header
        title="My To-Do List"
        totalCount={tasks.length}
        completedCount={tasks.filter(t => t.completed).length}
        onRefresh={refresh}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="container">
        <section className="surface card">
          <TaskInput
            onAdd={addTask}
            disabled={loading}
          />

          {error && (
            <div role="alert" className="alert error" aria-live="assertive">
              {String(error)}
            </div>
          )}

          <TaskList
            tasks={tasks}
            loading={loading}
            onToggleComplete={toggleComplete}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </section>
      </main>

      <footer className="footer">
        <span className="muted">
          Built with React and fetch. Theme is {theme}.
          {wsUrl ? ` Realtime endpoint configured.` : ''}
        </span>
      </footer>
    </div>
  );
}

export default App;
