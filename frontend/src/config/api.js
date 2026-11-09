// Central API configuration for RouteSense
// In production or when hosted together with Flask, API_BASE defaults to '' (same-origin).
// When deployed separately or in local dev, it falls back to VITE_API_URL or http://localhost:5000.
export const API_BASE = 
  import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : (import.meta.env.PROD ? '' : 'http://localhost:5000');

export default API_BASE;

