// Use relative `/api` so Vite dev server proxy (vite.config.js) can forward requests to backend and avoid CORS in development.
export const API_BASE_URL = '/api';
export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};