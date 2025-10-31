import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};

// Apps API
export const appsAPI = {
  getAll: async () => {
    const response = await api.get('/apps');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/apps/${id}`);
    return response.data;
  },
  
  getByDomain: async (domain: string) => {
    const response = await api.get(`/apps/by-domain/${domain}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/apps', data);
    return response.data;
  },
  
  update: async (id: number, data: any) => {
    const response = await api.put(`/apps/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/apps/${id}`);
    return response.data;
  },
  
  getSettings: async (id: number) => {
    const response = await api.get(`/apps/${id}/settings`);
    return response.data;
  },
  
  updateSettings: async (id: number, settings: any) => {
    const response = await api.put(`/apps/${id}/settings`, settings);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/users', data);
    return response.data;
  },
  
  update: async (id: number, data: any) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Screens API
export const screensAPI = {
  getAll: async () => {
    const response = await api.get('/screens');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/screens/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/screens', data);
    return response.data;
  },
  
  update: async (id: number, data: any) => {
    const response = await api.put(`/screens/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/screens/${id}`);
    return response.data;
  },
};

// Screen Elements API
export const screenElementsAPI = {
  getAll: async () => {
    const response = await api.get('/screen-elements');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/screen-elements/${id}`);
    return response.data;
  },
  
  getByCategory: async (category: string) => {
    const response = await api.get(`/screen-elements/category/${category}`);
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get('/screen-elements/categories');
    return response.data;
  },
};

// App Screens API
export const appScreensAPI = {
  // Screen management
  getAll: async () => {
    const response = await api.get('/app-screens');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/app-screens/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/app-screens', data);
    return response.data;
  },
  
  update: async (id: number, data: any) => {
    const response = await api.put(`/app-screens/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/app-screens/${id}`);
    return response.data;
  },
  
  // Element instances
  addElement: async (data: any) => {
    const response = await api.post('/app-screens/elements', data);
    return response.data;
  },
  
  updateElement: async (id: number, data: any) => {
    const response = await api.put(`/app-screens/elements/${id}`, data);
    return response.data;
  },
  
  deleteElement: async (id: number) => {
    const response = await api.delete(`/app-screens/elements/${id}`);
    return response.data;
  },
  
  // App assignments
  getAppScreens: async (appId: number) => {
    const response = await api.get(`/app-screens/app/${appId}`);
    return response.data;
  },
  
  assignToApp: async (data: { app_id: number; screen_id: number; display_order?: number }) => {
    const response = await api.post('/app-screens/app/assign', data);
    return response.data;
  },
  
  unassignFromApp: async (appId: number, screenId: number) => {
    const response = await api.delete(`/app-screens/app/${appId}/${screenId}`);
    return response.data;
  },
  
  // App screen content
  getAppScreenContent: async (appId: number, screenId: number) => {
    const response = await api.get(`/app-screens/app/${appId}/screen/${screenId}`);
    return response.data;
  },
  
  saveScreenContent: async (appId: number, screenId: number, contentData: any[]) => {
    const response = await api.post(`/app-screens/app/${appId}/screen/${screenId}/content`, { content: contentData });
    return response.data;
  },
  
  updateContent: async (data: any) => {
    const response = await api.post('/app-screens/app/content', data);
    return response.data;
  },
  
  // Aliases for convenience
  assignScreen: async (data: { app_id: number; screen_id: number; display_order?: number }) => {
    const response = await api.post('/app-screens/app/assign', data);
    return response.data;
  },
  
  unassignScreen: async (appId: number, screenId: number) => {
    const response = await api.delete(`/app-screens/app/${appId}/${screenId}`);
    return response.data;
  },
};

// Permissions API
export const permissionsAPI = {
  assign: async (data: any) => {
    const response = await api.post('/permissions', data);
    return response.data;
  },
  
  assignUserToApp: async (data: any) => {
    const response = await api.post('/permissions', data);
    return response.data;
  },
  
  updatePermissions: async (userId: number, appId: number, data: any) => {
    const response = await api.put(`/permissions/${userId}/${appId}`, data);
    return response.data;
  },
  
  revoke: async (userId: number, appId: number) => {
    const response = await api.delete(`/permissions/${userId}/${appId}`);
    return response.data;
  },
  
  removeUserFromApp: async (userId: number, appId: number) => {
    const response = await api.delete(`/permissions/${userId}/${appId}`);
    return response.data;
  },
  
  getUserPermissions: async (userId: number) => {
    const response = await api.get(`/permissions/user/${userId}`);
    return response.data;
  },
  
  getAppUsers: async (appId: number) => {
    const response = await api.get(`/permissions/app/${appId}`);
    return response.data;
  },
};

export default api;
