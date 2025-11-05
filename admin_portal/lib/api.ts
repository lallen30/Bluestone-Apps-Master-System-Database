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
  
  // Publishing (app-specific)
  publishForApp: async (appId: number, screenId: number) => {
    const response = await api.post(`/app-screens/app/${appId}/screen/${screenId}/publish`);
    return response.data;
  },
  
  unpublishForApp: async (appId: number, screenId: number) => {
    const response = await api.post(`/app-screens/app/${appId}/screen/${screenId}/unpublish`);
    return response.data;
  },
  
  // Screen ordering
  updateScreenOrder: async (appId: number, screenOrders: { screen_id: number; display_order: number }[]) => {
    const response = await api.post(`/app-screens/app/${appId}/reorder`, { screen_orders: screenOrders });
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

// Templates API
export const templatesAPI = {
  getAll: async () => {
    const response = await api.get('/templates');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },
  
  createFromTemplate: async (data: { template_id: number; screen_name: string; screen_description?: string; created_by: number }) => {
    const response = await api.post('/templates/create-from-template', data);
    return response.data;
  },
  
  cloneScreen: async (screenId: number, data: { new_name: string; created_by: number }) => {
    const response = await api.post(`/templates/clone/${screenId}`, data);
    return response.data;
  },
};

// App Templates API
export const appTemplatesAPI = {
  getAll: async () => {
    const response = await api.get('/app-templates');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/app-templates/${id}`);
    return response.data;
  },
  
  create: async (data: { name: string; description?: string; category?: string; icon?: string; is_active?: boolean; created_by: number }) => {
    const response = await api.post('/app-templates', data);
    return response.data;
  },
  
  update: async (id: number, data: { name?: string; description?: string; category?: string; icon?: string; is_active?: boolean }) => {
    const response = await api.put(`/app-templates/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/app-templates/${id}`);
    return response.data;
  },
  
  duplicate: async (id: number, data: { name: string; created_by: number }) => {
    const response = await api.post(`/app-templates/${id}/duplicate`, data);
    return response.data;
  },
  
  createFromTemplate: async (data: { template_id: number; app_name: string; app_domain?: string; created_by: number }) => {
    const response = await api.post('/app-templates/create-from-template', data);
    return response.data;
  },
  
  addScreen: async (templateId: number, data: { screen_name: string; screen_key: string; screen_description?: string; screen_icon?: string; screen_category?: string; display_order?: number; is_home_screen?: boolean }) => {
    const response = await api.post(`/app-templates/${templateId}/screens`, data);
    return response.data;
  },
  
  updateScreen: async (templateId: number, screenId: number, data: { screen_name?: string; screen_key?: string; screen_description?: string; screen_icon?: string; screen_category?: string; display_order?: number; is_home_screen?: boolean }) => {
    const response = await api.put(`/app-templates/${templateId}/screens/${screenId}`, data);
    return response.data;
  },
  
  deleteScreen: async (templateId: number, screenId: number) => {
    const response = await api.delete(`/app-templates/${templateId}/screens/${screenId}`);
    return response.data;
  },
  
  addElementToScreen: async (templateId: number, screenId: number, data: { element_id: number; field_key: string; label?: string; placeholder?: string; default_value?: string; is_required?: boolean; is_readonly?: boolean; display_order?: number; config?: any }) => {
    const response = await api.post(`/app-templates/${templateId}/screens/${screenId}/elements`, data);
    return response.data;
  },
  
  updateElementInScreen: async (templateId: number, screenId: number, elementId: number, data: { label?: string; placeholder?: string; default_value?: string; is_required?: boolean; is_readonly?: boolean; display_order?: number; config?: any }) => {
    const response = await api.put(`/app-templates/${templateId}/screens/${screenId}/elements/${elementId}`, data);
    return response.data;
  },
  
  deleteElementFromScreen: async (templateId: number, screenId: number, elementId: number) => {
    const response = await api.delete(`/app-templates/${templateId}/screens/${screenId}/elements/${elementId}`);
    return response.data;
  },
};

// App Users API
export const appUsersAPI = {
  createUser: async (appId: number, data: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    email_verified?: boolean;
  }) => {
    const response = await api.post(`/apps/${appId}/users`, data);
    return response.data;
  },
  
  getUsers: async (appId: number, params?: {
    search?: string;
    status?: string;
    email_verified?: boolean;
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: string;
  }) => {
    const response = await api.get(`/apps/${appId}/users`, { params });
    return response.data;
  },
  
  getStats: async (appId: number) => {
    const response = await api.get(`/apps/${appId}/users/stats`);
    return response.data;
  },
  
  getUser: async (appId: number, userId: number) => {
    const response = await api.get(`/apps/${appId}/users/${userId}`);
    return response.data;
  },
  
  updateUser: async (appId: number, userId: number, data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    bio?: string;
    date_of_birth?: string;
    gender?: string;
  }) => {
    const response = await api.put(`/apps/${appId}/users/${userId}`, data);
    return response.data;
  },
  
  updateStatus: async (appId: number, userId: number, status: string) => {
    const response = await api.put(`/apps/${appId}/users/${userId}/status`, { status });
    return response.data;
  },
  
  changePassword: async (appId: number, userId: number, data: { password: string }) => {
    const response = await api.put(`/apps/${appId}/users/${userId}/password`, data);
    return response.data;
  },
  
  deleteUser: async (appId: number, userId: number) => {
    const response = await api.delete(`/apps/${appId}/users/${userId}`);
    return response.data;
  },
  
  resendVerification: async (appId: number, userId: number) => {
    const response = await api.post(`/apps/${appId}/users/${userId}/resend-verification`);
    return response.data;
  },
  
  // Role management
  getRoles: async (appId: number, userId: number) => {
    const response = await api.get(`/apps/${appId}/users/${userId}/roles`);
    return response.data;
  },
  
  assignRole: async (appId: number, userId: number, roleId: number) => {
    const response = await api.post(`/apps/${appId}/users/${userId}/roles`, { role_id: roleId });
    return response.data;
  },
  
  removeRole: async (appId: number, userId: number, roleId: number) => {
    const response = await api.delete(`/apps/${appId}/users/${userId}/roles/${roleId}`);
    return response.data;
  },
};

// Roles API
export const rolesAPI = {
  getAppRoles: async (appId: number) => {
    const response = await api.get(`/apps/${appId}/roles`);
    return response.data;
  },
  
  getRoleDetails: async (appId: number, roleId: number) => {
    const response = await api.get(`/apps/${appId}/roles/${roleId}`);
    return response.data;
  },
  
  getAllPermissions: async () => {
    const response = await api.get('/permissions');
    return response.data;
  },
};

export default api;
