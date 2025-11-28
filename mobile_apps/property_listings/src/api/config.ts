// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api/v1',
  SERVER_URL: 'http://localhost:3000', // Base server URL for images
  APP_ID: 28, // AirPnP App ID
  TIMEOUT: 30000,
};

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/mobile/auth/register',
    LOGIN: '/mobile/auth/login',
    LOGOUT: '/mobile/auth/logout',
    VERIFY_EMAIL: '/mobile/auth/verify-email',
  },
  // Property Listings
  LISTINGS: {
    GET_ALL: `/apps/${API_CONFIG.APP_ID}/listings`,
    MY_LISTINGS: `/apps/${API_CONFIG.APP_ID}/listings/my`,
    GET_BY_ID: (id: number) => `/apps/${API_CONFIG.APP_ID}/listings/${id}`,
    CREATE: `/apps/${API_CONFIG.APP_ID}/listings`,
    UPDATE: (id: number) => `/apps/${API_CONFIG.APP_ID}/listings/${id}`,
    DELETE: (id: number) => `/apps/${API_CONFIG.APP_ID}/listings/${id}`,
    STATUS: (id: number) => `/apps/${API_CONFIG.APP_ID}/listings/${id}/status`,
    PUBLISH: (id: number) => `/apps/${API_CONFIG.APP_ID}/listings/${id}/publish`,
  },
  // Amenities
  AMENITIES: {
    GET_ALL: '/amenities',
  },
};
