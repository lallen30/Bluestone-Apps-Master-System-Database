/**
 * App Configuration
 * 
 * This file centralizes all app configuration values.
 * For white-label deployments, update these values or use environment variables.
 * 
 * To create a new app instance:
 * 1. Clone this repository
 * 2. Copy .env.example to .env
 * 3. Update the values in .env
 * 4. Update app.json with new app name
 * 5. Update iOS/Android bundle identifiers
 */

import { Platform } from 'react-native';

// Import Config from react-native-config if available, otherwise use defaults
let Config: Record<string, string | undefined> = {};
try {
  // react-native-config provides environment variables from .env file
  Config = require('react-native-config').default || {};
} catch (e) {
  // react-native-config not installed, use defaults
  console.log('react-native-config not available, using default configuration');
}

/**
 * App Configuration Object
 * Values are loaded from environment variables with fallbacks to defaults
 */
// For iOS simulator, localhost works. For Android emulator, use 10.0.2.2
// For physical devices, use your Mac's local IP or the production server
const getLocalhost = () => {
  // iOS simulator can use localhost directly
  // Android emulator needs 10.0.2.2 to reach host machine
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
};

// Environment toggle: set to 'local' for development, 'production' for server
// Can also be set via .env file with USE_LOCAL_API=true
const USE_LOCAL_API = Config.USE_LOCAL_API === 'true' || false;

// Get the appropriate API URLs based on environment
const getApiUrls = () => {
  if (USE_LOCAL_API) {
    const localhost = getLocalhost();
    return {
      baseUrl: `http://${localhost}:3000/api/v1`,
      serverUrl: `http://${localhost}:3000`,
    };
  }
  return {
    baseUrl: 'http://knoxdev.org/api/v1',
    serverUrl: 'http://knoxdev.org',
  };
};

const apiUrls = getApiUrls();

export const AppConfig = {
  // API Configuration - switches between local and production based on USE_LOCAL_API
  API_BASE_URL: Config.API_BASE_URL || apiUrls.baseUrl,
  API_SERVER_URL: Config.API_SERVER_URL || apiUrls.serverUrl,
  API_TIMEOUT: parseInt(Config.API_TIMEOUT || '30000', 10),
  
  // App Identification
  APP_ID: parseInt(Config.APP_ID || '56', 10),
  APP_NAME: Config.APP_NAME || 'AAAVacationRentals',
  APP_DISPLAY_NAME: Config.APP_DISPLAY_NAME || 'AAA Vacation Rentals',
  
  // Bundle Identifiers (for reference - actual values set in native projects)
  IOS_BUNDLE_ID: Config.IOS_BUNDLE_ID || 'com.bluestoneapps.aaavacationrentals',
  ANDROID_PACKAGE: Config.ANDROID_PACKAGE || 'com.bluestoneapps.aaavacationrentals',
  
  // Feature Flags
  ENABLE_DEBUG_LOGGING: Config.ENABLE_DEBUG_LOGGING === 'true',
  ENABLE_ANALYTICS: Config.ENABLE_ANALYTICS === 'true',
  
  // App Version (can be overridden, but typically from app.json)
  VERSION: Config.APP_VERSION || '1.0.0',
};

/**
 * Helper to check if running in development mode
 */
export const isDevelopment = __DEV__;

/**
 * Helper to get full API URL for an endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  const base = AppConfig.API_BASE_URL.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};

/**
 * Helper to get full server URL for assets (images, etc.)
 */
export const getServerUrl = (path: string): string => {
  const base = AppConfig.API_SERVER_URL.replace(/\/$/, '');
  const assetPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${assetPath}`;
};

export default AppConfig;
