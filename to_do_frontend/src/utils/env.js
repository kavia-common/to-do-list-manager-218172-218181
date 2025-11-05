export function getApiBase() {
  // PUBLIC_INTERFACE
  // Determine API base URL from env vars. Prefers REACT_APP_API_BASE, then REACT_APP_BACKEND_URL, else defaults to '/api'
  const base =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    '/api';
  return base.replace(/\/+$/, ''); // trim trailing slashes
}
