import apiClient from './client';
import { API_CONFIG } from './config';

export interface AppScreen {
  id: number;
  name: string;
  description: string;
  category?: string;
  icon?: string;
  is_published?: boolean;
  element_count: number;
  display_order: number;
  show_in_tabbar?: boolean;
  tabbar_order?: number | null;
  tabbar_icon?: string;
  tabbar_label?: string;
  show_in_sidebar?: boolean;
  sidebar_order?: number | null;
}

export interface ScreenElement {
  id: number;
  element_type: string;
  label: string;
  field_key: string;
  field_name?: string; // Deprecated, use field_key
  placeholder?: string;
  is_required: boolean;
  display_order: number;
  options?: any;
  content_value?: string; // Saved content from admin
  default_value?: string;
  config?: any; // Element configuration (dropdown options, upload settings, etc.)
}

export interface ScreenContent {
  screen: AppScreen;
  elements: ScreenElement[];
  data?: any;
}

export interface MenuItem {
  id: number;
  screen_id: number;
  display_order: number;
  label: string | null;
  icon: string | null;
  screen_name: string;
  screen_category: string;
}

export interface Menu {
  id: number;
  name: string;
  menu_type: 'tabbar' | 'sidebar_left' | 'sidebar_right';
  icon: string;
  description: string | null;
  items: MenuItem[];
}

export const screensService = {
  // Get all published screens for the app (mobile endpoint)
  getAppScreens: async (): Promise<AppScreen[]> => {
    const response = await apiClient.get(`/mobile/apps/${API_CONFIG.APP_ID}/screens`);
    const payload = response.data?.data;
    const screens: AppScreen[] = payload?.screens || [];
    return screens;
  },

  // Get tabbar screens (for bottom navigation)
  getTabbarScreens: async (): Promise<AppScreen[]> => {
    const screens = await screensService.getAppScreens();
    return screens
      .filter((screen: AppScreen) => !!screen.show_in_tabbar)
      .sort((a: AppScreen, b: AppScreen) => (a.tabbar_order ?? 99) - (b.tabbar_order ?? 99));
  },

  // Get sidebar screens (for menu list)
  getSidebarScreens: async (): Promise<AppScreen[]> => {
    const screens = await screensService.getAppScreens();
    return screens
      .filter((screen: AppScreen) => !!screen.show_in_sidebar)
      .sort((a: AppScreen, b: AppScreen) => (a.sidebar_order ?? 99) - (b.sidebar_order ?? 99));
  },

  // Get screen content (elements and data)
  getScreenContent: async (screenId: number): Promise<ScreenContent> => {
    const response = await apiClient.get(
      `/mobile/apps/${API_CONFIG.APP_ID}/screens/${screenId}`
    );
    return response.data.data;
  },

  // Save screen content/submission
  saveScreenContent: async (screenId: number, data: any): Promise<any> => {
    const response = await apiClient.post(
      `/mobile/apps/${API_CONFIG.APP_ID}/screens/${screenId}/submit`,
      { submission_data: data }
    );
    return response.data;
  },

  // Get menus for a specific screen
  getScreenMenus: async (screenId: number): Promise<Menu[]> => {
    const response = await apiClient.get(
      `/mobile/apps/${API_CONFIG.APP_ID}/screens/${screenId}/menus`
    );
    return response.data.data || [];
  },
};
