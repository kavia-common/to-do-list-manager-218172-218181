import { getApiBase } from '../utils/env';

/**
 * Simple fetch client wrapper for JSON APIs.
 * Handles JSON serialization, errors, and a basic timeout.
 */

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = 'GET', body, headers = {}, signal, timeoutMs = 10000 } = {}) {
  /** Make an HTTP request to the backend API using fetch.
   * path: string path (e.g., '/tasks')
   * options: { method, body, headers, signal, timeoutMs }
   * Returns parsed JSON or throws an Error with message and status.
   */
  const base = getApiBase();
  const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const finalSignal = signal || controller.signal;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: finalSignal,
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!res.ok) {
      let message = `Request failed with status ${res.status}`;
      if (isJson) {
        try {
          const data = await res.json();
          message = data?.message || data?.error || message;
        } catch {
          // ignore
        }
      } else {
        try {
          message = await res.text();
        } catch {
          // ignore
        }
      }
      const err = new Error(message);
      err.status = res.status;
      throw err;
    }

    if (isJson) {
      return await res.json();
    }
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}
