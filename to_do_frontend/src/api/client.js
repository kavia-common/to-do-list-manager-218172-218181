import { getApiBase, getEnableCredentials, isVerboseErrorsEnabled } from '../utils/env';

/**
 * Simple fetch client wrapper for JSON APIs.
 * Handles JSON serialization, errors, and a basic timeout.
 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = 'GET', body, headers = {}, signal, timeoutMs = 10000, retry = { attempts: 2, baseDelayMs: 300 } } = {}) {
  /**
   * Make an HTTP request to the backend API using fetch.
   * - path: string path (e.g., '/tasks')
   * - options: { method, body, headers, signal, timeoutMs, retry }
   * Uses env-resolved API base and a single env switch to enable credentials for cross-site cookies.
   * Returns parsed JSON or throws an Error with message and status.
   * Quietly handles network errors by retrying and, if still failing, returns null instead of throwing.
   */
  const base = getApiBase();
  if (!base) {
    // No valid base detected: quietly bail
    if (isVerboseErrorsEnabled()) {
      // Minimal console warning when verboseErrors enabled
      // eslint-disable-next-line no-console
      console.warn('API base not configured; skipping network call for', path);
    }
    return null;
  }
  const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const attempts = Math.max(0, retry?.attempts ?? 2);
  const baseDelayMs = Math.max(0, retry?.baseDelayMs ?? 300);

  let lastError = null;

  for (let i = 0; i <= attempts; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const finalSignal = signal || controller.signal;
    try {
      const computedHeaders = {
        Accept: 'application/json',
        ...headers,
      };
      const hasBody = body !== undefined;
      if (hasBody) {
        computedHeaders['Content-Type'] = 'application/json';
      }

      const res = await fetch(url, {
        method,
        headers: computedHeaders,
        credentials: getEnableCredentials() ? 'include' : 'same-origin',
        body: hasBody ? JSON.stringify(body) : undefined,
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

        // For HTTP errors, don't throw to UI; just stop retries for 4xx, retry for 5xx
        if (res.status >= 500 && i < attempts) {
          lastError = err;
          clearTimeout(timer);
          await sleep(baseDelayMs * Math.pow(2, i));
          continue;
        }

        clearTimeout(timer);
        return null;
      }

      if (isJson) {
        const json = await res.json();
        clearTimeout(timer);
        return json;
      }
      const text = await res.text();
      clearTimeout(timer);
      return text;
    } catch (e) {
      // Network error (Failed to fetch, CORS, abort, etc.)
      lastError = e;
      clearTimeout(timer);
      if (i < attempts) {
        await sleep(baseDelayMs * Math.pow(2, i));
        continue;
      }
      // After retries exhausted, keep quiet and return null
      if (isVerboseErrorsEnabled()) {
        // eslint-disable-next-line no-console
        console.warn('Network call failed after retries:', { path, error: e?.message });
      }
      return null;
    }
  }

  // Fallback
  if (isVerboseErrorsEnabled() && lastError) {
    // eslint-disable-next-line no-console
    console.warn('Network call gave up:', { path, error: lastError?.message });
  }
  return null;
}
