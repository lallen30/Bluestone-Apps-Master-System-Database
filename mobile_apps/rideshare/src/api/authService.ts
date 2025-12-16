import apiClient from './client';
import { ENDPOINTS, API_CONFIG } from './config';
import { AuthResponse } from '../types';

export const authService = {
  // Register new user
  register: async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, {
      ...data,
      app_id: API_CONFIG.APP_ID,
    });
    return response.data;
  },

  // Login user
  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      ...data,
      app_id: API_CONFIG.APP_ID,
    });
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },

  // Verify email
  verifyEmail: async (data: {
    email: string;
    verification_code: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.VERIFY_EMAIL, {
      ...data,
      app_id: API_CONFIG.APP_ID,
    });
    return response.data;
  },
};
