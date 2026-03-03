const isProd = import.meta.env.PROD;
const prodBaseUrl = import.meta.env.VITE_API_URL || '';

export const API_URL = isProd
    ? `${prodBaseUrl}/api`
    : `http://${window.location.hostname}:5000/api`;

export const BASE_URL = isProd
    ? prodBaseUrl
    : `http://${window.location.hostname}:5000`;
