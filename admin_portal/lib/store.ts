import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  role_name: string;
  role_level: number;
}

interface App {
  id: number;
  name: string;
  domain: string;
  description?: string;
  is_active: boolean;
  app_type?: string;
  theme_config?: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

interface AppState {
  currentApp: App | null;
  userApps: App[];
  isMasterAdmin: boolean;
  setCurrentApp: (app: App | null) => void;
  setUserApps: (apps: App[]) => void;
  setIsMasterAdmin: (isMaster: boolean) => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => {
        localStorage.setItem('auth_token', token);
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('auth_token');
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// App Store
export const useAppStore = create<AppState>((set) => ({
  currentApp: null,
  userApps: [],
  isMasterAdmin: false,
  setCurrentApp: (app) => set({ currentApp: app }),
  setUserApps: (apps) => set({ userApps: apps }),
  setIsMasterAdmin: (isMaster) => set({ isMasterAdmin: isMaster }),
}));
