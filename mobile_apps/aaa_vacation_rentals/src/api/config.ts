import { AppConfig } from '../config/app.config';

// API Configuration - now uses centralized AppConfig
export const API_CONFIG = {
  BASE_URL: AppConfig.API_BASE_URL,
  SERVER_URL: AppConfig.API_SERVER_URL,
  APP_ID: AppConfig.APP_ID,
  TIMEOUT: AppConfig.API_TIMEOUT,
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
    PUBLISH: (id: number) =>
      `/apps/${API_CONFIG.APP_ID}/listings/${id}/publish`,
  },
  SERVICES: {
    ENABLED: `/apps/${API_CONFIG.APP_ID}/services/enabled`,
  },
  PAYMENTS: {
    // Use the create route that creates a provisional booking and returns a Checkout session
    CHECKOUT: `/apps/${API_CONFIG.APP_ID}/checkout/create`,
  },
  // Amenities
  AMENITIES: {
    GET_ALL: '/amenities',
  },
};
