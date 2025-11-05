 /** 
  * Environment helpers for the frontend. Centralizes all runtime configuration parsing.
  */

 /**
  * Normalize a base URL by trimming trailing slashes.
  * @param {string} url
  * @returns {string}
  */
 function normalizeBase(url) {
   return String(url || '').replace(/\/+$/, '');
 }

 // PUBLIC_INTERFACE
 export function getApiBase() {
   /**
    * Determine API base URL from env vars.
    * Preference order:
    * 1) REACT_APP_API_BASE
    * 2) REACT_APP_BACKEND_URL
    * 3) '/api' (default relative proxy path)
    */
   const base =
     process.env.REACT_APP_API_BASE ||
     process.env.REACT_APP_BACKEND_URL ||
     '/api';
   return normalizeBase(base);
 }

 // PUBLIC_INTERFACE
 export function getFrontendUrl() {
   /** Returns the configured frontend/site URL if provided. */
   return normalizeBase(process.env.REACT_APP_FRONTEND_URL || '');
 }

 // PUBLIC_INTERFACE
 export function getHealthcheckPath() {
   /**
    * Returns an optional healthcheck path to probe on the API base.
    * Example: '/healthz' or '/health'
    * If not set, returns empty string which indicates healthcheck is disabled.
    */
   const p = process.env.REACT_APP_HEALTHCHECK_PATH || '';
   if (!p) return '';
   return p.startsWith('/') ? p : `/${p}`;
 }

 // PUBLIC_INTERFACE
 export function getWsUrl() {
   /**
    * Placeholder parser for WebSocket URL without implementing sockets.
    * Accepts REACT_APP_WS_URL. If provided, returns a normalized absolute URL.
    * If not provided, returns empty string.
    */
   const raw = process.env.REACT_APP_WS_URL || '';
   if (!raw) return '';

   try {
     // If absolute, URL() succeeds directly. If relative, resolve against frontend URL or window.location.
     const base = getFrontendUrl() || (typeof window !== 'undefined' ? window.location.origin : '');
     const u = new URL(raw, base || undefined);
     return u.toString().replace(/\/+$/, '');
   } catch {
     // If URL parsing fails, return raw trimmed (best effort).
     return normalizeBase(raw);
   }
 }

 // PUBLIC_INTERFACE
 export function getEnableCredentials() {
   /**
    * Single switch to enable fetch credentials to be sent cross-origin.
    * Set REACT_APP_ENABLE_CREDENTIALS to 'true' to enable.
    */
   return String(process.env.REACT_APP_ENABLE_CREDENTIALS || '').toLowerCase() === 'true';
 }

 // PUBLIC_INTERFACE
 export function getFeatureFlags() {
   /**
    * Returns parsed feature flags if provided as JSON in REACT_APP_FEATURE_FLAGS.
    * Fallback is empty object.
    */
   const raw = process.env.REACT_APP_FEATURE_FLAGS;
   if (!raw) return {};
   try {
     return JSON.parse(raw);
   } catch {
     return {};
   }
 }

 // PUBLIC_INTERFACE
 export function isVerboseErrorsEnabled() {
   /**
    * Returns true if feature flag verboseErrors is enabled.
    * Configure via REACT_APP_FEATURE_FLAGS='{"verboseErrors":true}'
    */
   const flags = getFeatureFlags();
   return !!flags.verboseErrors;
 }

 // PUBLIC_INTERFACE
 export function isHealthcheckBannerEnabled() {
   /**
    * Returns true if healthcheck banner feature flag is enabled.
    * Configure via REACT_APP_FEATURE_FLAGS='{"healthcheckBanner":true}'
    */
   const flags = getFeatureFlags();
   return !!flags.healthcheckBanner;
 }
