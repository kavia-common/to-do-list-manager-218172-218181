# To-Do Frontend (React)

A lightweight React SPA for managing tasks with add, edit, delete, and complete actions.

- Preview: runs on http://localhost:3000
- API: expects a backend providing REST endpoints under /tasks

## Quick start
- Install and run:
  - npm install
  - npm start
- Open http://localhost:3000

## Environment variables
These are read at build time (REACT_APP_ prefix). The app primarily uses:
- REACT_APP_API_BASE: Base URL for API requests (e.g., https://api.example.com or /api). Used by src/utils/env.js and src/api/client.js.
- REACT_APP_HEALTHCHECK_PATH: Optional API health path (e.g., /healthz). When enabled via feature flags, the header shows a non-blocking health status.
- REACT_APP_FEATURE_FLAGS: JSON string for toggling UI behaviors; see example below.

Other available variables in this container (not all are currently used by code but supported for future extension):
- REACT_APP_BACKEND_URL, REACT_APP_FRONTEND_URL, REACT_APP_WS_URL, REACT_APP_NODE_ENV, REACT_APP_NEXT_TELEMETRY_DISABLED, REACT_APP_ENABLE_SOURCE_MAPS, REACT_APP_PORT, REACT_APP_TRUST_PROXY, REACT_APP_LOG_LEVEL, REACT_APP_EXPERIMENTS_ENABLED

Example .env (place in project root next to package.json):
```
# API base (absolute or relative). Defaults to /api if unset.
REACT_APP_API_BASE=/api

# Optional health endpoint path for header banner.
REACT_APP_HEALTHCHECK_PATH=/healthz

# Feature flags as JSON. Enable verbose error banner and healthcheck banner.
REACT_APP_FEATURE_FLAGS={"verboseErrors":true,"healthcheckBanner":true}

# Optional/advanced variables (for future use)
REACT_APP_BACKEND_URL=
REACT_APP_FRONTEND_URL=http://localhost:3000
REACT_APP_WS_URL=
REACT_APP_NODE_ENV=development
REACT_APP_NEXT_TELEMETRY_DISABLED=1
REACT_APP_ENABLE_SOURCE_MAPS=true
REACT_APP_PORT=3000
REACT_APP_TRUST_PROXY=false
REACT_APP_LOG_LEVEL=info
REACT_APP_EXPERIMENTS_ENABLED=false
```

Notes:
- For Create React App, changes to .env require restarting the dev server.
- getApiBase() prefers REACT_APP_API_BASE, then REACT_APP_BACKEND_URL, else falls back to /api.

## API expectations
The frontend calls these endpoints relative to REACT_APP_API_BASE:

- GET /tasks → 200 [ { id, title, completed } ]
- POST /tasks { title } → 201 { id, title, completed }
- PUT /tasks/{id} { title?, completed? } → 200 { id, title, completed }
- PATCH /tasks/{id} { completed } → 200 { id, title, completed }
- DELETE /tasks/{id} → 204 (or 200)

If the backend is unavailable, the UI remains usable with optimistic updates and quiet rollbacks; optionally shows a small error banner when verboseErrors feature flag is enabled.

## Scripts
- npm start: Start dev server on port 3000.
- npm test: Run tests.
- npm run build: Production build.

## Where env is used
- src/utils/env.js: Parsing of API base, healthcheck path, feature flags, WS URL placeholder.
- src/api/client.js: Builds request URLs from getApiBase(), optional credentials, retry/backoff.
- src/components/Header.js: Optional healthcheck banner (feature-flagged).
- src/App.js: Optional verbose error banner (feature-flagged).

