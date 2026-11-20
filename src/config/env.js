/**
 * Single source of truth for the backend address.
 *
 * VITE_API_URL (in .env) is the backend's full API URL, e.g. https://api.example.com/api.
 *  - Production build: the app calls that URL directly.
 *  - `npm run dev`:    the app calls the same-origin "/api" path and the Vite dev server
 *                      proxies it to VITE_API_URL's host (see vite.config.js), which avoids CORS.
 */
const configured = import.meta.env.VITE_API_URL;

if (!configured && !import.meta.env.DEV) {
  console.error("VITE_API_URL is not set. Add it to .env (see .env.example).");
}

export const API_BASE_URL = import.meta.env.DEV ? "/api" : configured;
