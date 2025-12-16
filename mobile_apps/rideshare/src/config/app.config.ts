/**
 * App Configuration
 */

let Config: Record<string, string | undefined> = {};
try {
  Config = require('react-native-config').default || {};
} catch (e) {
  console.log('react-native-config not available, using default configuration');
}

export const AppConfig = {
  // API Configuration
  API_BASE_URL: Config.API_BASE_URL || 'http://localhost:3000/api/v1',
  API_SERVER_URL: Config.API_SERVER_URL || 'http://localhost:3000',
  API_TIMEOUT: parseInt(Config.API_TIMEOUT || '30000', 10),
  
  // App Identification
  APP_ID: parseInt(Config.APP_ID || '58', 10),
  APP_NAME: Config.APP_NAME || 'Rideshare',
  APP_DISPLAY_NAME: Config.APP_DISPLAY_NAME || 'Rideshare',
  
  // Bundle Identifiers
  IOS_BUNDLE_ID: Config.IOS_BUNDLE_ID || 'com.bluestoneapps.rideshare',
  ANDROID_PACKAGE: Config.ANDROID_PACKAGE || 'com.bluestoneapps.rideshare',
  
  // Feature Flags
  ENABLE_DEBUG_LOGGING: Config.ENABLE_DEBUG_LOGGING === 'true',
  ENABLE_ANALYTICS: Config.ENABLE_ANALYTICS === 'true',
  
  // App Version
  VERSION: Config.APP_VERSION || '1.0.0',
};

export const isDevelopment = __DEV__;

export const getApiUrl = (endpoint: string): string => {
  const base = AppConfig.API_BASE_URL.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};

export const getServerUrl = (path: string): string => {
  const base = AppConfig.API_SERVER_URL.replace(/\/$/, '');
  const assetPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${assetPath}`;
};

export default AppConfig;
