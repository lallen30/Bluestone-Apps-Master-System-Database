import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
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
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post("/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};

// Apps API
export const appsAPI = {
  getAll: async () => {
    const response = await api.get("/apps");
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
    const response = await api.post("/apps", data);
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

  setHomeScreen: async (id: number, screenId: number) => {
    const response = await api.put(`/apps/${id}/home-screen`, {
      screen_id: screenId,
    });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post("/users", data);
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
    const response = await api.get("/screens");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/screens/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post("/screens", data);
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
    const response = await api.get("/screen-elements");
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
    const response = await api.get("/screen-elements/categories");
    return response.data;
  },
};

// App Screens API
export const appScreensAPI = {
  // Screen management
  getAll: async () => {
    const response = await api.get("/app-screens");
    return response.data;
  },

  getMasterScreens: async () => {
    const response = await api.get("/app-screens");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/app-screens/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post("/app-screens", data);
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
    const response = await api.post("/app-screens/elements", data);
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

  assignToApp: async (data: {
    app_id: number;
    screen_id: number;
    display_order?: number;
  }) => {
    const response = await api.post("/app-screens/app/assign", data);
    return response.data;
  },

  unassignFromApp: async (appId: number, screenId: number) => {
    const response = await api.delete(`/app-screens/app/${appId}/${screenId}`);
    return response.data;
  },

  // Auto-sync toggle
  toggleAutoSync: async (
    appId: number,
    screenId: number,
    autoSyncEnabled: boolean
  ) => {
    const response = await api.put(
      `/app-screens/app/${appId}/screen/${screenId}/auto-sync`,
      {
        auto_sync_enabled: autoSyncEnabled,
      }
    );
    return response.data;
  },

  toggleAutoSyncAll: async (appId: number, autoSyncEnabled: boolean) => {
    const response = await api.put(`/app-screens/app/${appId}/auto-sync-all`, {
      auto_sync_enabled: autoSyncEnabled,
    });
    return response.data;
  },

  // App screen content
  getAppScreenContent: async (appId: number, screenId: number) => {
    const response = await api.get(
      `/app-screens/app/${appId}/screen/${screenId}`
    );
    return response.data;
  },

  saveScreenContent: async (
    appId: number,
    screenId: number,
    contentData: any[]
  ) => {
    const response = await api.post(
      `/app-screens/app/${appId}/screen/${screenId}/content`,
      { content: contentData }
    );
    return response.data;
  },

  updateContent: async (data: any) => {
    const response = await api.post("/app-screens/app/content", data);
    return response.data;
  },

  // Publishing (app-specific)
  publishForApp: async (appId: number, screenId: number) => {
    const response = await api.post(
      `/app-screens/app/${appId}/screen/${screenId}/publish`
    );
    return response.data;
  },

  unpublishForApp: async (appId: number, screenId: number) => {
    const response = await api.post(
      `/app-screens/app/${appId}/screen/${screenId}/unpublish`
    );
    return response.data;
  },

  // Screen ordering
  updateScreenOrder: async (
    appId: number,
    screenOrders: { screen_id: number; display_order: number }[]
  ) => {
    const response = await api.post(`/app-screens/app/${appId}/reorder`, {
      screen_orders: screenOrders,
    });
    return response.data;
  },

  // Menu configuration
  updateMenuConfig: async (appId: number, screenId: number, config: any) => {
    const response = await api.put(
      `/app-screens/app/${appId}/screen/${screenId}/menu-config`,
      config
    );
    return response.data;
  },

  // Aliases for convenience
  assignScreen: async (data: {
    app_id: number;
    screen_id: number;
    display_order?: number;
  }) => {
    const response = await api.post("/app-screens/app/assign", data);
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
    const response = await api.post("/permissions", data);
    return response.data;
  },

  assignUserToApp: async (data: any) => {
    const response = await api.post("/permissions", data);
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
    const response = await api.get("/templates");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  createFromTemplate: async (data: {
    template_id: number;
    screen_name: string;
    screen_description?: string;
    created_by: number;
  }) => {
    const response = await api.post("/templates/create-from-template", data);
    return response.data;
  },

  cloneScreen: async (
    screenId: number,
    data: { new_name: string; created_by: number }
  ) => {
    const response = await api.post(`/templates/clone/${screenId}`, data);
    return response.data;
  },
};

// App Templates API
export const appTemplatesAPI = {
  getAll: async () => {
    const response = await api.get("/app-templates");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/app-templates/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    description?: string;
    category?: string;
    icon?: string;
    is_active?: boolean;
    created_by: number;
  }) => {
    const response = await api.post("/app-templates", data);
    return response.data;
  },

  update: async (
    id: number,
    data: {
      name?: string;
      description?: string;
      category?: string;
      icon?: string;
      is_active?: boolean;
    }
  ) => {
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

  createFromTemplate: async (data: {
    template_id: number;
    app_name: string;
    app_domain?: string;
    created_by: number;
  }) => {
    const response = await api.post(
      "/app-templates/create-from-template",
      data
    );
    return response.data;
  },

  addScreen: async (
    templateId: number,
    data: {
      screen_name: string;
      screen_key: string;
      screen_description?: string;
      screen_icon?: string;
      screen_category?: string;
      display_order?: number;
      is_home_screen?: boolean;
    }
  ) => {
    const response = await api.post(
      `/app-templates/${templateId}/screens`,
      data
    );
    return response.data;
  },

  addScreenFromMaster: async (templateId: number, screenId: number) => {
    const response = await api.post(
      `/app-templates/${templateId}/screens/from-master`,
      { screen_id: screenId }
    );
    return response.data;
  },

  updateScreen: async (
    templateId: number,
    screenId: number,
    data: {
      screen_name?: string;
      screen_key?: string;
      screen_description?: string;
      screen_icon?: string;
      screen_category?: string;
      display_order?: number;
      is_home_screen?: boolean;
    }
  ) => {
    const response = await api.put(
      `/app-templates/${templateId}/screens/${screenId}`,
      data
    );
    return response.data;
  },

  deleteScreen: async (templateId: number, screenId: number) => {
    const response = await api.delete(
      `/app-templates/${templateId}/screens/${screenId}`
    );
    return response.data;
  },

  addElementToScreen: async (
    templateId: number,
    screenId: number,
    data: {
      element_id: number;
      field_key: string;
      label?: string;
      placeholder?: string;
      default_value?: string;
      is_required?: boolean;
      is_readonly?: boolean;
      display_order?: number;
      config?: any;
    }
  ) => {
    const response = await api.post(
      `/app-templates/${templateId}/screens/${screenId}/elements`,
      data
    );
    return response.data;
  },

  updateElementInScreen: async (
    templateId: number,
    screenId: number,
    elementId: number,
    data: {
      label?: string;
      placeholder?: string;
      default_value?: string;
      is_required?: boolean;
      is_readonly?: boolean;
      display_order?: number;
      config?: any;
    }
  ) => {
    const response = await api.put(
      `/app-templates/${templateId}/screens/${screenId}/elements/${elementId}`,
      data
    );
    return response.data;
  },

  deleteElementFromScreen: async (
    templateId: number,
    screenId: number,
    elementId: number
  ) => {
    const response = await api.delete(
      `/app-templates/${templateId}/screens/${screenId}/elements/${elementId}`
    );
    return response.data;
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File, appId?: number, appName?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (appId) formData.append("app_id", appId.toString());
    if (appName) formData.append("app_name", appName);
    const response = await api.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  uploadFile: async (file: File, appId?: number, appName?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (appId) formData.append("app_id", appId.toString());
    if (appName) formData.append("app_name", appName);
    const response = await api.post("/upload/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteFile: async (appFolder: string, filename: string) => {
    const response = await api.delete(`/upload/${appFolder}/${filename}`);
    return response.data;
  },
};

// App Users API
export const appUsersAPI = {
  createUser: async (
    appId: number,
    data: {
      email: string;
      password: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
      email_verified?: boolean;
    }
  ) => {
    const response = await api.post(`/apps/${appId}/users`, data);
    return response.data;
  },

  getUsers: async (
    appId: number,
    params?: {
      search?: string;
      status?: string;
      email_verified?: boolean;
      page?: number;
      per_page?: number;
      sort_by?: string;
      sort_order?: string;
    }
  ) => {
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

  updateUser: async (
    appId: number,
    userId: number,
    data: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      bio?: string;
      date_of_birth?: string;
      gender?: string;
    }
  ) => {
    const response = await api.put(`/apps/${appId}/users/${userId}`, data);
    return response.data;
  },

  updateStatus: async (appId: number, userId: number, status: string) => {
    const response = await api.put(`/apps/${appId}/users/${userId}/status`, {
      status,
    });
    return response.data;
  },

  changePassword: async (
    appId: number,
    userId: number,
    data: { password: string }
  ) => {
    const response = await api.put(
      `/apps/${appId}/users/${userId}/password`,
      data
    );
    return response.data;
  },

  deleteUser: async (appId: number, userId: number) => {
    const response = await api.delete(`/apps/${appId}/users/${userId}`);
    return response.data;
  },

  resendVerification: async (appId: number, userId: number) => {
    const response = await api.post(
      `/apps/${appId}/users/${userId}/resend-verification`
    );
    return response.data;
  },

  // Role management
  getRoles: async (appId: number, userId: number) => {
    const response = await api.get(`/apps/${appId}/users/${userId}/roles`);
    return response.data;
  },

  assignRole: async (appId: number, userId: number, roleId: number) => {
    const response = await api.post(`/apps/${appId}/users/${userId}/roles`, {
      role_id: roleId,
    });
    return response.data;
  },

  removeRole: async (appId: number, userId: number, roleId: number) => {
    const response = await api.delete(
      `/apps/${appId}/users/${userId}/roles/${roleId}`
    );
    return response.data;
  },
};

// Roles API
export const rolesAPI = {
  // Get App User roles (for mobile app users)
  getAppRoles: async (appId: number) => {
    const response = await api.get(`/apps/${appId}/roles`);
    return response.data;
  },

  // Get Administrator roles (Admin, Editor, etc.)
  getAdminRoles: async () => {
    const response = await api.get("/roles");
    return response.data;
  },

  getRoleDetails: async (appId: number, roleId: number) => {
    const response = await api.get(`/apps/${appId}/roles/${roleId}`);
    return response.data;
  },

  createRole: async (
    appId: number,
    data: {
      name: string;
      display_name: string;
      description?: string;
      is_default?: boolean;
    }
  ) => {
    const response = await api.post(`/apps/${appId}/roles`, data);
    return response.data;
  },

  updateRole: async (
    appId: number,
    roleId: number,
    data: {
      name?: string;
      display_name?: string;
      description?: string;
      is_default?: boolean;
    }
  ) => {
    const response = await api.put(`/apps/${appId}/roles/${roleId}`, data);
    return response.data;
  },

  deleteRole: async (appId: number, roleId: number) => {
    const response = await api.delete(`/apps/${appId}/roles/${roleId}`);
    return response.data;
  },

  getRoleScreens: async (appId: number, roleId: number) => {
    const response = await api.get(`/apps/${appId}/roles/${roleId}/screens`);
    return response.data;
  },

  assignScreenToRole: async (
    appId: number,
    roleId: number,
    screenId: number,
    canAccess: boolean = true
  ) => {
    const response = await api.post(`/apps/${appId}/roles/${roleId}/screens`, {
      screen_id: screenId,
      can_access: canAccess,
    });
    return response.data;
  },

  removeScreenFromRole: async (
    appId: number,
    roleId: number,
    screenId: number
  ) => {
    const response = await api.delete(
      `/apps/${appId}/roles/${roleId}/screens/${screenId}`
    );
    return response.data;
  },

  getAllPermissions: async () => {
    const response = await api.get("/permissions");
    return response.data;
  },

  // Role Home Screens
  getAllRoleHomeScreens: async (appId: number) => {
    const response = await api.get(`/apps/${appId}/role-home-screens`);
    return response.data;
  },

  getRoleHomeScreen: async (appId: number, roleId: number) => {
    const response = await api.get(
      `/apps/${appId}/roles/${roleId}/home-screen`
    );
    return response.data;
  },

  setRoleHomeScreen: async (
    appId: number,
    roleId: number,
    screenId: number | null
  ) => {
    const response = await api.put(
      `/apps/${appId}/roles/${roleId}/home-screen`,
      {
        screen_id: screenId,
      }
    );
    return response.data;
  },
};

// App Screen Elements API (for app-specific customization)
export const appScreenElementsAPI = {
  // Get all elements for an app's screen (master + overrides + custom)
  getAppScreenElements: async (appId: number, screenId: number) => {
    const response = await api.get(
      `/apps/${appId}/screens/${screenId}/elements`
    );
    return response.data;
  },

  // Create or update an override for a master element
  createOrUpdateOverride: async (
    appId: number,
    screenId: number,
    elementInstanceId: number,
    data: any
  ) => {
    const response = await api.put(
      `/apps/${appId}/screens/${screenId}/elements/${elementInstanceId}/override`,
      data
    );
    return response.data;
  },

  // Delete an override (revert to master)
  deleteOverride: async (appId: number, elementInstanceId: number) => {
    const response = await api.delete(
      `/apps/${appId}/elements/${elementInstanceId}/override`
    );
    return response.data;
  },

  // Add a custom element to an app's screen
  addCustomElement: async (appId: number, screenId: number, data: any) => {
    const response = await api.post(
      `/apps/${appId}/screens/${screenId}/elements/custom`,
      data
    );
    return response.data;
  },

  // Update a custom element
  updateCustomElement: async (
    appId: number,
    customElementId: number,
    data: any
  ) => {
    const response = await api.put(
      `/apps/${appId}/elements/custom/${customElementId}`,
      data
    );
    return response.data;
  },

  // Delete a custom element
  deleteCustomElement: async (appId: number, customElementId: number) => {
    const response = await api.delete(
      `/apps/${appId}/elements/custom/${customElementId}`
    );
    return response.data;
  },
};

// Submissions API
export const submissionsAPI = {
  // Get submissions for an app
  getSubmissions: async (
    appId: number,
    params?: {
      screenId?: string;
      dateFilter?: string;
      page?: number;
      limit?: number;
    }
  ) => {
    const response = await api.get(`/apps/${appId}/submissions`, { params });
    return response.data;
  },

  // Get submission statistics
  getStats: async (appId: number) => {
    const response = await api.get(`/apps/${appId}/submissions/stats`);
    return response.data;
  },

  // Export submissions as CSV
  exportCSV: async (
    appId: number,
    params?: { screenId?: string; dateFilter?: string }
  ) => {
    const response = await api.get(`/apps/${appId}/submissions/export`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  // Delete a submission
  deleteSubmission: async (submissionId: number) => {
    const response = await api.delete(`/submissions/${submissionId}`);
    return response.data;
  },
};

// Property Listings API
export const propertyListingsAPI = {
  // Get all listings for an app
  getListings: async (
    appId: number,
    params?: {
      search?: string;
      city?: string;
      country?: string;
      property_type?: string;
      min_price?: number;
      max_price?: number;
      bedrooms?: number;
      guests?: number;
      status?: string;
      user_id?: number;
      page?: number;
      per_page?: number;
    }
  ) => {
    const response = await api.get(`/apps/${appId}/listings`, { params });
    return response.data;
  },

  // Get a single listing by ID
  getListingById: async (appId: number, listingId: number) => {
    const response = await api.get(`/apps/${appId}/listings/${listingId}`);
    return response.data;
  },

  // Get all hosts (users with listings)
  getHosts: async (appId: number) => {
    const response = await api.get(`/apps/${appId}/hosts`);
    return response.data;
  },

  // Get all amenities
  getAmenities: async () => {
    const response = await api.get("/amenities");
    return response.data;
  },

  // Create a new listing (admin function)
  createListing: async (appId: number, data: any) => {
    const response = await api.post(`/apps/${appId}/listings`, data);
    return response.data;
  },

  // Update a listing
  updateListing: async (appId: number, listingId: number, data: any) => {
    const response = await api.put(
      `/apps/${appId}/listings/${listingId}`,
      data
    );
    return response.data;
  },

  // Delete a listing
  deleteListing: async (appId: number, listingId: number) => {
    const response = await api.delete(`/apps/${appId}/listings/${listingId}`);
    return response.data;
  },

  // Update listing status
  updateListingStatus: async (
    appId: number,
    listingId: number,
    status: string
  ) => {
    const response = await api.put(
      `/apps/${appId}/listings/${listingId}/status`,
      { status }
    );
    return response.data;
  },

  // Publish/unpublish a listing (backward compatibility)
  publishListing: async (
    appId: number,
    listingId: number,
    isPublished: boolean
  ) => {
    const response = await api.put(
      `/apps/${appId}/listings/${listingId}/publish`,
      { is_published: isPublished }
    );
    return response.data;
  },

  // ============================================
  // IMAGE MANAGEMENT
  // ============================================

  // Add image to listing
  addImage: async (
    appId: number,
    listingId: number,
    data: {
      image_url: string;
      image_key?: string;
      caption?: string;
      is_primary?: boolean;
    }
  ) => {
    const response = await api.post(
      `/apps/${appId}/listings/${listingId}/images`,
      data
    );
    return response.data;
  },

  // Update image
  updateImage: async (
    appId: number,
    listingId: number,
    imageId: number,
    data: { caption?: string; is_primary?: boolean; display_order?: number }
  ) => {
    const response = await api.put(
      `/apps/${appId}/listings/${listingId}/images/${imageId}`,
      data
    );
    return response.data;
  },

  // Delete image
  deleteImage: async (appId: number, listingId: number, imageId: number) => {
    const response = await api.delete(
      `/apps/${appId}/listings/${listingId}/images/${imageId}`
    );
    return response.data;
  },

  // ============================================
  // VIDEO MANAGEMENT
  // ============================================

  // Add video to listing
  addVideo: async (
    appId: number,
    listingId: number,
    data: {
      video_url: string;
      video_key?: string;
      thumbnail_url?: string;
      caption?: string;
    }
  ) => {
    const response = await api.post(
      `/apps/${appId}/listings/${listingId}/videos`,
      data
    );
    return response.data;
  },

  // Update video
  updateVideo: async (
    appId: number,
    listingId: number,
    videoId: number,
    data: { caption?: string; thumbnail_url?: string; display_order?: number }
  ) => {
    const response = await api.put(
      `/apps/${appId}/listings/${listingId}/videos/${videoId}`,
      data
    );
    return response.data;
  },

  // Delete video
  deleteVideo: async (appId: number, listingId: number, videoId: number) => {
    const response = await api.delete(
      `/apps/${appId}/listings/${listingId}/videos/${videoId}`
    );
    return response.data;
  },
};

// Bookings API (Admin)
export const bookingsAPI = {
  // Get all bookings for an app (admin)
  getAllBookings: async (
    appId: number,
    params?: {
      status?: string;
      host_id?: number;
      guest_id?: number;
      listing_id?: number;
      date_from?: string;
      date_to?: string;
      page?: number;
      per_page?: number;
    }
  ) => {
    const response = await api.get(`/apps/${appId}/bookings/all`, { params });
    return response.data;
  },

  // Complete past bookings (mark confirmed bookings with past checkout as completed)
  completePastBookings: async (appId: number) => {
    const response = await api.post(`/apps/${appId}/bookings/complete-past`);
    return response.data;
  },
};

// Menu API
export const menuAPI = {
  // Get all menus for an app
  getAppMenus: async (appId: number) => {
    const response = await api.get(`/app/${appId}/menus`);
    return response.data;
  },

  // Get a single menu with items
  getMenu: async (menuId: number) => {
    const response = await api.get(`/menus/${menuId}`);
    return response.data;
  },

  // Create a new menu
  createMenu: async (
    appId: number,
    data: { name: string; menu_type: string; description?: string }
  ) => {
    const response = await api.post(`/app/${appId}/menus`, data);
    return response.data;
  },

  // Update a menu
  updateMenu: async (
    menuId: number,
    data: { name?: string; description?: string; is_active?: boolean }
  ) => {
    const response = await api.put(`/menus/${menuId}`, data);
    return response.data;
  },

  // Delete a menu
  deleteMenu: async (menuId: number) => {
    const response = await api.delete(`/menus/${menuId}`);
    return response.data;
  },

  // Add a screen to a menu
  addMenuItem: async (
    menuId: number,
    data: {
      screen_id?: number;
      item_type?: "screen" | "sidebar";
      sidebar_menu_id?: number;
      sidebar_position?: "left" | "right";
      display_order?: number;
      label?: string;
      icon?: string;
    }
  ) => {
    const response = await api.post(`/menus/${menuId}/items`, data);
    return response.data;
  },

  // Add a sidebar item to a menu
  addSidebarItem: async (
    menuId: number,
    data: {
      sidebar_menu_id: number;
      sidebar_position: "left" | "right";
      display_order?: number;
      label?: string;
      icon?: string;
    }
  ) => {
    const response = await api.post(`/menus/${menuId}/items`, {
      ...data,
      item_type: "sidebar",
    });
    return response.data;
  },

  // Update a menu item
  updateMenuItem: async (
    itemId: number,
    data: {
      display_order?: number;
      label?: string | null;
      icon?: string | null;
      is_active?: boolean;
    }
  ) => {
    const response = await api.put(`/menu-items/${itemId}`, data);
    return response.data;
  },

  // Remove a menu item
  removeMenuItem: async (itemId: number) => {
    const response = await api.delete(`/menu-items/${itemId}`);
    return response.data;
  },

  // Get menus assigned to a screen
  getScreenMenus: async (screenId: number) => {
    const response = await api.get(`/screens/${screenId}/menus`);
    return response.data;
  },

  // Assign menus to a screen
  assignMenusToScreen: async (screenId: number, menuIds: number[]) => {
    const response = await api.put(`/screens/${screenId}/menus`, {
      menu_ids: menuIds,
    });
    return response.data;
  },

  // Get all menus with their role access for an app
  getAppMenusWithRoles: async (appId: number) => {
    const response = await api.get(`/app/${appId}/menus-with-roles`);
    return response.data;
  },

  // Get role access for a menu
  getMenuRoleAccess: async (menuId: number) => {
    const response = await api.get(`/menus/${menuId}/roles`);
    return response.data;
  },

  // Update role access for a menu
  updateMenuRoleAccess: async (
    menuId: number,
    roleIds: number[],
    appId: number
  ) => {
    const response = await api.put(`/menus/${menuId}/roles`, {
      role_ids: roleIds,
      app_id: appId,
    });
    return response.data;
  },

  // Get menus accessible by a specific role
  getMenusByRole: async (appId: number, roleId: number) => {
    const response = await api.get(`/app/${appId}/roles/${roleId}/menus`);
    return response.data;
  },

  // Duplicate a menu with all its items
  duplicateMenu: async (menuId: number, newName: string) => {
    const response = await api.post(`/menus/${menuId}/duplicate`, {
      name: newName,
    });
    return response.data;
  },
};

// Modules API
export const modulesAPI = {
  // Get all modules
  getAll: async () => {
    const response = await api.get("/modules");
    return response.data;
  },

  // Get a single module
  getById: async (moduleId: number) => {
    const response = await api.get(`/modules/${moduleId}`);
    return response.data;
  },

  // Get modules assigned to a screen
  getScreenModules: async (screenId: number) => {
    const response = await api.get(`/modules/screens/${screenId}`);
    return response.data;
  },

  // Assign a module to a screen
  assignToScreen: async (screenId: number, moduleId: number, config?: any) => {
    const response = await api.post(`/modules/screens/${screenId}/assign`, {
      module_id: moduleId,
      config: config || {},
    });
    return response.data;
  },

  // Remove a module from a screen
  removeFromScreen: async (screenId: number, moduleId: number) => {
    const response = await api.delete(
      `/modules/screens/${screenId}/modules/${moduleId}`
    );
    return response.data;
  },
};

// Forms API
export const formsAPI = {
  // Get all forms
  getAll: async () => {
    const response = await api.get("/forms");
    return response.data;
  },

  // Get form by ID with elements
  getById: async (formId: number) => {
    const response = await api.get(`/forms/${formId}`);
    return response.data;
  },

  // Create new form
  create: async (formData: any) => {
    const response = await api.post("/forms", formData);
    return response.data;
  },

  // Update form
  update: async (formId: number, formData: any) => {
    const response = await api.put(`/forms/${formId}`, formData);
    return response.data;
  },

  // Delete form
  delete: async (formId: number) => {
    const response = await api.delete(`/forms/${formId}`);
    return response.data;
  },

  // Add element to form
  addElement: async (formId: number, elementData: any) => {
    const response = await api.post(`/forms/${formId}/elements`, elementData);
    return response.data;
  },

  // Update form element
  updateElement: async (
    formId: number,
    elementId: number,
    elementData: any
  ) => {
    const response = await api.put(
      `/forms/${formId}/elements/${elementId}`,
      elementData
    );
    return response.data;
  },

  // Delete form element
  deleteElement: async (formId: number, elementId: number) => {
    const response = await api.delete(`/forms/${formId}/elements/${elementId}`);
    return response.data;
  },

  // Get available elements for forms
  getAvailableElements: async (category?: string) => {
    const params = category ? { category } : {};
    const response = await api.get("/elements/available-for-forms", { params });
    return response.data;
  },

  // App-specific form element overrides
  getAppFormElements: async (appId: number, formId: number) => {
    const response = await api.get(`/apps/${appId}/forms/${formId}/elements`);
    return response.data;
  },

  createOrUpdateOverride: async (
    appId: number,
    formId: number,
    elementId: number,
    overrideData: any
  ) => {
    const response = await api.post(
      `/apps/${appId}/forms/${formId}/elements/${elementId}/override`,
      overrideData
    );
    return response.data;
  },

  deleteOverride: async (appId: number, formId: number, elementId: number) => {
    const response = await api.delete(
      `/apps/${appId}/forms/${formId}/elements/${elementId}/override`
    );
    return response.data;
  },

  toggleVisibility: async (
    appId: number,
    formId: number,
    elementId: number
  ) => {
    const response = await api.patch(
      `/apps/${appId}/forms/${formId}/elements/${elementId}/visibility`
    );
    return response.data;
  },
};

// Form Submissions API (Admin)
export const formSubmissionsAPI = {
  // Get all form submissions for an app
  getAllSubmissions: async (
    appId: number,
    params?: {
      form_id?: number;
      status?: string;
      date_from?: string;
      date_to?: string;
      page?: number;
      per_page?: number;
    }
  ) => {
    const response = await api.get(`/apps/${appId}/form-submissions`, {
      params,
    });
    return response.data;
  },

  // Get forms list for filter dropdown
  getFormsList: async (appId: number) => {
    const response = await api.get(`/apps/${appId}/forms-list`);
    return response.data;
  },

  // Get a single submission
  getSubmission: async (appId: number, submissionId: number) => {
    const response = await api.get(
      `/apps/${appId}/form-submissions/${submissionId}`
    );
    return response.data;
  },

  // Update submission status
  updateStatus: async (
    appId: number,
    submissionId: number,
    data: { status: string; error_message?: string }
  ) => {
    const response = await api.put(
      `/apps/${appId}/form-submissions/${submissionId}/status`,
      data
    );
    return response.data;
  },

  // Delete a submission
  deleteSubmission: async (appId: number, submissionId: number) => {
    const response = await api.delete(
      `/apps/${appId}/form-submissions/${submissionId}`
    );
    return response.data;
  },
};

export const servicesAPI = {
  socket: null as WebSocket | null,

  async syncServiceApp() {
    const res = await fetch("http://localhost:3032/services");
    const data = await res.json();

    console.log("Full service snapshot:", data);

    return data;
  },

  connect(onServiceUpdate: (service: any) => void) {
    const url = "ws://localhost:3032/ws";

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("Connected to service guard");
    };

    this.socket.onmessage = (event) => {
      const service = JSON.parse(event.data);
      console.log("New service registered:", service);
      onServiceUpdate(service);
    };

    this.socket.onclose = () => {
      console.warn("Gateway socket disconnected. Reconnecting...");
      setTimeout(() => this.connect(onServiceUpdate), 2000);
    };

    this.socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  },

  disconnect() {
    this.socket?.close();
    this.socket = null;
  },
};

// Reports API
export const reportsAPI = {
  // Get all report screens for an app
  getReportScreens: async (appId: number) => {
    const response = await api.get(`/app/${appId}/reports`);
    return response.data;
  },

  // Get report config for a specific screen
  getReportConfig: async (appId: number, screenId: number) => {
    const response = await api.get(`/app/${appId}/reports/${screenId}/config`);
    return response.data;
  },

  // Save/update report config
  saveReportConfig: async (
    appId: number,
    screenId: number,
    config: {
      report_name?: string;
      description?: string;
      display_columns?: string[];
      filter_fields?: string[];
      action_buttons?: string[];
      view_fields?: string[];
      edit_fields?: string[];
      default_sort_field?: string;
      default_sort_order?: "asc" | "desc";
      rows_per_page?: number;
      allowed_roles?: number[];
      edit_roles?: number[];
      is_active?: boolean;
      show_date_column?: boolean;
      show_user_column?: boolean;
      column_order?: string[];
    }
  ) => {
    const response = await api.post(
      `/app/${appId}/reports/${screenId}/config`,
      config
    );
    return response.data;
  },

  // Get report data (submissions)
  getReportData: async (
    appId: number,
    screenId: number,
    params?: {
      page?: number;
      limit?: number;
      sort_field?: string;
      sort_order?: "asc" | "desc";
      [key: string]: any; // For dynamic filters
    }
  ) => {
    const response = await api.get(`/app/${appId}/reports/${screenId}/data`, {
      params,
    });
    return response.data;
  },

  // Get single submission detail
  getSubmissionDetail: async (
    appId: number,
    screenId: number,
    submissionId: number
  ) => {
    const response = await api.get(
      `/app/${appId}/reports/${screenId}/submissions/${submissionId}`
    );
    return response.data;
  },

  // Update a submission
  updateSubmission: async (
    appId: number,
    screenId: number,
    submissionId: number,
    data: Record<string, string>
  ) => {
    const response = await api.put(
      `/app/${appId}/reports/${screenId}/submissions/${submissionId}`,
      { submission_data: data }
    );
    return response.data;
  },

  // Delete a submission
  deleteSubmission: async (
    appId: number,
    screenId: number,
    submissionId: number
  ) => {
    const response = await api.delete(
      `/app/${appId}/reports/${screenId}/submissions/${submissionId}`
    );
    return response.data;
  },

  // Export report data as CSV
  exportReportData: async (appId: number, screenId: number) => {
    const response = await api.get(`/app/${appId}/reports/${screenId}/export`, {
      responseType: "blob",
    });
    return response.data;
  },
};

// Dashboard Reports API
export const dashboardReportsAPI = {
  // Get dashboard summary (all stats combined)
  getSummary: async (appId: number) => {
    const response = await api.get(`/app/${appId}/dashboard/summary`);
    return response.data;
  },

  // Get listings overview report
  getListingsOverview: async (appId: number) => {
    const response = await api.get(`/app/${appId}/dashboard/listings`);
    return response.data;
  },

  // Get users overview report
  getUsersOverview: async (appId: number) => {
    const response = await api.get(`/app/${appId}/dashboard/users`);
    return response.data;
  },

  // Get inquiries overview report
  getInquiriesOverview: async (appId: number) => {
    const response = await api.get(`/app/${appId}/dashboard/inquiries`);
    return response.data;
  },

  // Get popular listings report
  getPopularListings: async (appId: number, limit?: number) => {
    const response = await api.get(`/app/${appId}/dashboard/popular-listings`, {
      params: { limit },
    });
    return response.data;
  },
};

// Real Estate API (Inquiries & Showings)
export const realEstateAPI = {
  // Dashboard overview
  getDashboardOverview: async (appId: number) => {
    const response = await api.get(`/app/${appId}/real-estate/dashboard`);
    return response.data;
  },

  // Inquiries
  getInquiries: async (
    appId: number,
    params?: {
      status?: string;
      listing_id?: number;
      buyer_id?: number;
      agent_id?: number;
      page?: number;
      per_page?: number;
    }
  ) => {
    const response = await api.get(`/app/${appId}/inquiries`, { params });
    return response.data;
  },

  getInquiry: async (appId: number, inquiryId: number) => {
    const response = await api.get(`/app/${appId}/inquiries/${inquiryId}`);
    return response.data;
  },

  updateInquiryStatus: async (
    appId: number,
    inquiryId: number,
    status: string,
    response_message?: string
  ) => {
    const response = await api.put(
      `/app/${appId}/inquiries/${inquiryId}/status`,
      { status, response_message }
    );
    return response.data;
  },

  respondToInquiry: async (
    appId: number,
    inquiryId: number,
    response_message: string
  ) => {
    const response = await api.post(
      `/app/${appId}/inquiries/${inquiryId}/respond`,
      { response_message }
    );
    return response.data;
  },

  // Showings
  getShowings: async (
    appId: number,
    params?: {
      status?: string;
      listing_id?: number;
      buyer_id?: number;
      agent_id?: number;
      date_from?: string;
      date_to?: string;
      page?: number;
      per_page?: number;
    }
  ) => {
    const response = await api.get(`/app/${appId}/showings`, { params });
    return response.data;
  },

  getShowing: async (appId: number, showingId: number) => {
    const response = await api.get(`/app/${appId}/showings/${showingId}`);
    return response.data;
  },

  updateShowingStatus: async (
    appId: number,
    showingId: number,
    data: {
      status: string;
      scheduled_date?: string;
      scheduled_time?: string;
      agent_notes?: string;
      cancellation_reason?: string;
      feedback?: string;
      buyer_interest_level?: string;
    }
  ) => {
    const response = await api.put(
      `/app/${appId}/showings/${showingId}/status`,
      data
    );
    return response.data;
  },

  confirmShowing: async (
    appId: number,
    showingId: number,
    data?: { scheduled_date?: string; scheduled_time?: string }
  ) => {
    const response = await api.post(
      `/app/${appId}/showings/${showingId}/confirm`,
      data || {}
    );
    return response.data;
  },

  cancelShowing: async (
    appId: number,
    showingId: number,
    cancellation_reason?: string
  ) => {
    const response = await api.post(
      `/app/${appId}/showings/${showingId}/cancel`,
      { cancellation_reason }
    );
    return response.data;
  },

  completeShowing: async (
    appId: number,
    showingId: number,
    data?: {
      feedback?: string;
      buyer_interest_level?: string;
      agent_notes?: string;
    }
  ) => {
    const response = await api.post(
      `/app/${appId}/showings/${showingId}/complete`,
      data || {}
    );
    return response.data;
  },

  // Offers (Transactions)
  getOffers: async (
    appId: number,
    params?: {
      status?: string;
      listing_id?: number;
      buyer_id?: number;
      agent_id?: number;
      page?: number;
      per_page?: number;
    }
  ) => {
    const response = await api.get(`/app/${appId}/offers`, { params });
    return response.data;
  },

  getOffer: async (appId: number, offerId: number) => {
    const response = await api.get(`/app/${appId}/offers/${offerId}`);
    return response.data;
  },

  createOffer: async (
    appId: number,
    data: {
      listing_id: number;
      buyer_id: number;
      agent_id?: number;
      offer_amount: number;
      earnest_money?: number;
      down_payment_percent?: number;
      financing_type?: string;
      inspection_contingency?: boolean;
      financing_contingency?: boolean;
      appraisal_contingency?: boolean;
      sale_contingency?: boolean;
      other_contingencies?: string;
      closing_date?: string;
      possession_date?: string;
      offer_expiration?: string;
    }
  ) => {
    const response = await api.post(`/app/${appId}/offers`, data);
    return response.data;
  },

  updateOfferStatus: async (
    appId: number,
    offerId: number,
    status: string,
    response_notes?: string
  ) => {
    const response = await api.put(`/app/${appId}/offers/${offerId}/status`, {
      status,
      response_notes,
    });
    return response.data;
  },

  submitOffer: async (appId: number, offerId: number) => {
    const response = await api.post(`/app/${appId}/offers/${offerId}/submit`);
    return response.data;
  },

  counterOffer: async (
    appId: number,
    offerId: number,
    counter_amount: number,
    counter_terms?: string
  ) => {
    const response = await api.post(`/app/${appId}/offers/${offerId}/counter`, {
      counter_amount,
      counter_terms,
    });
    return response.data;
  },

  acceptOffer: async (
    appId: number,
    offerId: number,
    response_notes?: string
  ) => {
    const response = await api.post(`/app/${appId}/offers/${offerId}/accept`, {
      response_notes,
    });
    return response.data;
  },

  rejectOffer: async (
    appId: number,
    offerId: number,
    response_notes?: string
  ) => {
    const response = await api.post(`/app/${appId}/offers/${offerId}/reject`, {
      response_notes,
    });
    return response.data;
  },

  withdrawOffer: async (appId: number, offerId: number, reason?: string) => {
    const response = await api.post(
      `/app/${appId}/offers/${offerId}/withdraw`,
      { reason }
    );
    return response.data;
  },

  // Analytics
  getAgentPerformance: async (
    appId: number,
    params?: { agent_id?: number; date_from?: string; date_to?: string }
  ) => {
    const response = await api.get(`/app/${appId}/analytics/agents`, {
      params,
    });
    return response.data;
  },

  getMarketAnalytics: async (
    appId: number,
    params?: { date_from?: string; date_to?: string }
  ) => {
    const response = await api.get(`/app/${appId}/analytics/market`, {
      params,
    });
    return response.data;
  },
};

export default api;
