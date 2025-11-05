# To-Do Frontend (React) – Product Requirements Document (PRD)

## Executive Summary
The To-Do Frontend is a lightweight, single-page React application that enables users to add, edit, delete, and mark tasks as complete. It prioritizes responsiveness, accessibility, and clarity, while maintaining a modern, clean look and minimal dependencies. The app integrates with a planned backend via REST (and is compatible with future GraphQL) to persist tasks. In the absence of a reachable backend, the UI remains responsive through optimistic updates and graceful rollbacks, with optional verbose error feedback controlled via feature flags.

## Goals and Non-Goals
### Goals
- Provide a simple and efficient to-do management experience: add, edit, delete, and complete tasks.
- Keep the interface responsive, with optimistic UI updates and minimal disruption during transient API failures.
- Centralize runtime configuration using environment variables, including support for feature flags.
- Maintain a minimal dependency footprint and fast load times with vanilla CSS and fetch-based API calls.
- Adhere to the provided style guide and color theme for a modern, coherent UI.

### Non-Goals
- Implement real-time synchronization or WebSocket updates (may be introduced later).
- Provide advanced state management frameworks (e.g., Redux) or multi-page routing.
- Implement offline persistence or a full i18n solution (readiness only).
- Implement authentication, authorization, or role-based features.

## Personas and User Stories
### Personas
- Casual Tasker: Wants a quick way to jot tasks and mark them complete.
- Daily Planner: Edits task titles and maintains a clean list to track daily goals.
- Reliability-Seeker: Expects the app to behave gracefully even when the network is unreliable.

### User Stories
- As a user, I can add a task by entering a title and pressing Enter or clicking Add.
- As a user, I can mark tasks as complete and see a clear visual indication.
- As a user, I can edit a task inline, saving with Enter or blur and canceling with Escape.
- As a user, I can delete a task and see it removed immediately.
- As a user, I can view total and completed counts in the header.
- As a user, I can refresh the task list at any time.
- As a user, I can see a subtle empty state when there are no tasks.
- As a user (optional via feature flag), I can see a non-blocking API health banner and verbose error alerts.

## Functional Requirements
### Core Features
- Add Task: Input and button to add a new task. Disabled while globally loading.
- Edit Task: Inline edit on double-click or via Edit button; save on Enter/blur, cancel on Escape.
- Delete Task: Remove a task with immediate UI feedback.
- Complete Task: Toggle completion with a checkbox.
- List Tasks: Display tasks in a list with accessible roles and labels.
- Counts: Header displays total and completed counts.
- Refresh: Manual refresh button.

### Filtering
- Basic display only; no filters are implemented at this time. Future enhancement may include show: all/active/completed.

### Persistence via API
- The frontend interacts with a backend API using:
  - GET /tasks
  - POST /tasks
  - PUT /tasks/{id}
  - PATCH /tasks/{id}
  - DELETE /tasks/{id}
- API base URL is configurable via environment variables (see Environment Variables Mapping). If a call fails, the UI uses optimistic updates and quiet rollbacks to minimize disruption.

### Feature Flags
- verboseErrors: Show an inline error alert and console warnings.
- healthcheckBanner: Display a non-blocking API health status banner in the header if REACT_APP_HEALTHCHECK_PATH is provided.

## Non-Functional Requirements
### Performance
- Minimal dependencies and CSS-only theming for fast load and interaction.
- Optimistic updates minimize perceived latency.
- Basic client retry/backoff for network and 5xx errors.

### Accessibility
- Use semantic roles (banner, main, contentinfo, list, listitem).
- Keyboard support: Enter/Escape for add/edit flows.
- aria-labels and aria-live regions for alerts and status updates.

### i18n Readiness
- Text is centralized in components and can be externalized in future iterations. Current implementation uses English strings.

### Security Considerations
- No authentication built-in. Future support for credentials (cookies) controlled via REACT_APP_ENABLE_CREDENTIALS.
- CORS and CSRF are back-end dependent; the client can include credentials if enabled.

## Success Metrics
- Task action success rate: ≥ 99% under normal network conditions.
- Time-to-Interactive: comparable to CRA baseline; no heavy libraries.
- Accessibility: No critical issues in Lighthouse/axe; keyboard navigation works across core flows.
- Error resilience: No app crashes during backend outages; optimistic UI remains usable.

## Open Questions and Assumptions
- Assumption: Backend provides REST endpoints under REACT_APP_API_BASE with JSON responses.
- Assumption: Task model contains { id, title, completed }.
- Open Question: Will authentication be required? If yes, how should tokens/cookies be handled?
- Open Question: Should GraphQL be added now or only as future enhancement?

## Styling and Theming
- Theme is modern and light by default, aligned with provided colors:
  - primary #3b82f6, secondary #64748b, success #06b6d4, error #EF4444
  - background #f9fafb, surface #ffffff, text #111827
- Dark mode available via [data-theme="dark"] and toggle in the header.
- Components styled with CSS variables in theme.css and base rules in index.css.

## Error Handling and Loading States
- Loading: Displays a polite loading indicator for the list.
- Empty state: Subtle note when no tasks are present.
- Errors: By default, silent with optimistic rollback. When verboseErrors is enabled, show inline alert and console warnings.
- Health banner: Optional, non-blocking status based on API health endpoint and feature flag.

## Routing (SPA Considerations)
- Single-page application without client-side routes. Future features may introduce routing for filters or task details.

## Telemetry and Logging
- REACT_APP_LOG_LEVEL present for future use; not currently wired.
- verboseErrors flag triggers console warnings and inline alerts.
- NEXT telemetry flags (REACT_APP_NEXT_TELEMETRY_DISABLED) are present for parity but not applicable to CRA runtime.

## Build and Deployment
- Built with Create React App scripts: start, test, build.
- Environment variables prefixed with REACT_APP_ are read at build time.
- Default dev server port: 3000.

## Environment Variables Mapping
- REACT_APP_API_BASE: Primary API base; fallback to REACT_APP_BACKEND_URL; otherwise /api.
- REACT_APP_BACKEND_URL: Secondary API base fallback.
- REACT_APP_FRONTEND_URL: Used to resolve relative WS URLs.
- REACT_APP_WS_URL: Placeholder for future WebSocket integration.
- REACT_APP_NODE_ENV: Informational; not used directly.
- REACT_APP_NEXT_TELEMETRY_DISABLED: Not applicable to CRA runtime; reserved.
- REACT_APP_ENABLE_SOURCE_MAPS: CRA build behavior; reserved.
- REACT_APP_PORT: Dev server port; CRA uses 3000 by default.
- REACT_APP_TRUST_PROXY: Reserved.
- REACT_APP_LOG_LEVEL: Reserved for future logging verbosity.
- REACT_APP_HEALTHCHECK_PATH: Optional API health path (e.g., /healthz) for header banner.
- REACT_APP_FEATURE_FLAGS: JSON string enabling features like verboseErrors and healthcheckBanner.
- REACT_APP_EXPERIMENTS_ENABLED: Reserved.

## Future Enhancements
- Filters (All/Active/Completed) and search.
- Real-time updates via WebSockets.
- Authentication and user profiles.
- Offline support and local caching.
- Localization/internationalization.
- Improved telemetry using REACT_APP_LOG_LEVEL and error reporting services.

## Dependencies and External Interfaces
- Dependency on a backend service providing task CRUD endpoints.
- Interface via REST using fetch; GraphQL can be considered later with minimal changes to the API layer.

---
Sources:
- to_do_frontend/src/App.js
- to_do_frontend/src/components/Header.js
- to_do_frontend/src/components/TaskInput.js
- to_do_frontend/src/components/TaskItem.js
- to_do_frontend/src/components/TaskList.js
- to_do_frontend/src/state/useTasks.js
- to_do_frontend/src/api/client.js
- to_do_frontend/src/api/tasksApi.js
- to_do_frontend/src/utils/env.js
- to_do_frontend/src/styles/theme.css
- to_do_frontend/src/index.css
- to_do_frontend/README.md
