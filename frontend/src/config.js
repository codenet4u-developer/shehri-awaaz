// Use window.location to determine if we are running locally or on Vercel
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// In production on Vercel, the frontend and serverless API share the same domain.
// So API_URL should just be '/api' rather than 'http://localhost:5000/api'.
export const API_URL = isLocalhost
    ? `http://${window.location.hostname}:5000/api`
    : '/api';

export const BASE_URL = isLocalhost
    ? `http://${window.location.hostname}:5000`
    : '';
