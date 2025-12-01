'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, permissionsAPI, appScreensAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { 
  ArrowLeft, Save, Shield, Monitor, Menu, Mail, Home, Calendar,
  Eye, Edit, Settings, Users, CheckCircle, XCircle, LayoutGrid, Package, RefreshCw, Trash2
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface Screen {
  id: number;
  name: string;
  screen_key: string;
}

interface AdminUser {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_name: string;
  role_level: number;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_publish: boolean;
  can_manage_admins: boolean;
  can_manage_users: boolean;
  can_manage_settings: boolean;
  custom_permissions: any;
}

interface ScreenPermissions {
  can_edit_content: boolean;      // Edit Content button
  can_menu_config: boolean;       // Menu Config button (LayoutGrid)
  can_module_config: boolean;     // Module Config button (Package)
  can_toggle_publish: boolean;    // Toggle Published/Draft status
}

interface CustomPermissions {
  screens: Record<number, ScreenPermissions>;
  menu_access: {
    property_listings: boolean;
    bookings: boolean;
    contact_submissions: boolean;
    menus: boolean;
    app_users: boolean;
    roles: boolean;
  };
}

const defaultScreenPermissions: ScreenPermissions = {
  can_edit_content: true,
  can_menu_config: false,
  can_module_config: false,
  can_toggle_publish: false,
};

const defaultMenuAccess = {
  property_listings: true,
  bookings: true,
  contact_submissions: true,
  menus: false,
  app_users: false,
  roles: false,
};

export default function AdminPermissionsPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;
  const userId = params.userId as string;
  const { user, isAuthenticated } = useAuthStore();
  
  const [app, setApp] = useState<any>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'screens' | 'menu'>('general');
  
  // Form state
  const [generalPermissions, setGeneralPermissions] = useState({
    can_view: true,
    can_edit: false,
    can_delete: false,
    can_publish: false,
    can_manage_admins: false,
    can_manage_users: false,
    can_manage_settings: false,
  });
  
  const [screenPermissions, setScreenPermissions] = useState<Record<number, ScreenPermissions>>({});
  const [menuAccess, setMenuAccess] = useState(defaultMenuAccess);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Only Master Admin can access this page
    if (user && user.role_level !== 1) {
      router.push(`/app/${appId}/users`);
      return;
    }

    if (token && !user) {
      return;
    }

    fetchData();
  }, [isAuthenticated, user, appId, userId, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch app details
      const appResponse = await appsAPI.getById(parseInt(appId));
      setApp(appResponse.data);

      // Fetch admin user permissions
      const usersResponse = await permissionsAPI.getAppUsers(parseInt(appId));
      const foundUser = usersResponse.data?.find((u: AdminUser) => u.user_id === parseInt(userId));
      
      if (!foundUser) {
        router.push(`/app/${appId}/users`);
        return;
      }
      
      setAdminUser(foundUser);
      
      // Set general permissions (convert 0/1 to boolean)
      setGeneralPermissions({
        can_view: !!foundUser.can_view,
        can_edit: !!foundUser.can_edit,
        can_delete: !!foundUser.can_delete,
        can_publish: !!foundUser.can_publish,
        can_manage_admins: !!foundUser.can_manage_admins,
        can_manage_users: !!foundUser.can_manage_users,
        can_manage_settings: !!foundUser.can_manage_settings,
      });
      
      // Parse custom permissions
      let customPerms: CustomPermissions | null = null;
      if (foundUser.custom_permissions) {
        try {
          customPerms = typeof foundUser.custom_permissions === 'string' 
            ? JSON.parse(foundUser.custom_permissions) 
            : foundUser.custom_permissions;
        } catch (e) {
          console.error('Error parsing custom permissions:', e);
        }
      }
      
      if (customPerms?.menu_access) {
        setMenuAccess({ ...defaultMenuAccess, ...customPerms.menu_access });
      }

      // Fetch screens
      const screensResponse = await appScreensAPI.getAppScreens(parseInt(appId));
      const screensList = screensResponse.data || [];
      setScreens(screensList);
      
      // Initialize screen permissions
      const initialScreenPerms: Record<number, ScreenPermissions> = {};
      screensList.forEach((screen: Screen) => {
        if (customPerms?.screens?.[screen.id]) {
          initialScreenPerms[screen.id] = customPerms.screens[screen.id];
        } else {
          initialScreenPerms[screen.id] = { ...defaultScreenPermissions };
        }
      });
      setScreenPermissions(initialScreenPerms);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!adminUser) return;
    
    setSaving(true);
    try {
      const customPermissions: CustomPermissions = {
        screens: screenPermissions,
        menu_access: menuAccess,
      };

      await permissionsAPI.updatePermissions(
        adminUser.user_id,
        parseInt(appId),
        {
          ...generalPermissions,
          custom_permissions: customPermissions,
        }
      );
      
      alert('Permissions saved successfully!');
      router.push(`/app/${appId}/users`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const toggleScreenPermission = (screenId: number, permission: keyof ScreenPermissions) => {
    setScreenPermissions(prev => ({
      ...prev,
      [screenId]: {
        ...prev[screenId],
        [permission]: !prev[screenId]?.[permission],
      }
    }));
  };

  const setAllScreenPermissions = (permission: keyof ScreenPermissions, value: boolean) => {
    setScreenPermissions(prev => {
      const updated = { ...prev };
      screens.forEach(screen => {
        updated[screen.id] = {
          ...updated[screen.id],
          [permission]: value,
        };
      });
      return updated;
    });
  };

  if (loading) {
    return (
      <AppLayout appId={appId} appName={app?.name || 'Loading...'}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading permissions...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout appId={appId} appName={app?.name || ''}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/app/${appId}/users`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Administrators</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-600" />
                Manage Permissions
              </h1>
              <p className="text-gray-600 mt-1">
                Configure detailed permissions for <strong>{adminUser?.first_name} {adminUser?.last_name}</strong>
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-sm">
                  {adminUser?.role_name}
                </span>
              </p>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Permissions'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-4">
            {[
              { id: 'general', label: 'General Permissions', icon: Shield },
              { id: 'screens', label: 'Screen Actions', icon: Monitor },
              { id: 'menu', label: 'Menu Access', icon: Menu },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* General Permissions Tab */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General App Permissions</h2>
            <p className="text-sm text-gray-500 mb-6">
              These are the base permissions that control overall access to the app.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'can_manage_admins', label: 'Manage Administrators', description: 'Can manage app administrators', icon: Shield },
                { key: 'can_manage_users', label: 'Manage Users', description: 'Can manage mobile app users', icon: Users },
                { key: 'can_manage_settings', label: 'Manage Settings', description: 'Can change app settings', icon: Settings },
              ].map((perm) => (
                <div
                  key={perm.key}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    generalPermissions[perm.key as keyof typeof generalPermissions]
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setGeneralPermissions(prev => ({
                    ...prev,
                    [perm.key]: !prev[perm.key as keyof typeof prev]
                  }))}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <perm.icon className={`w-5 h-5 ${
                        generalPermissions[perm.key as keyof typeof generalPermissions]
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{perm.label}</p>
                        <p className="text-sm text-gray-500">{perm.description}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      generalPermissions[perm.key as keyof typeof generalPermissions]
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}>
                      {generalPermissions[perm.key as keyof typeof generalPermissions] && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Screen Actions Tab */}
        {activeTab === 'screens' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Screen Action Button Permissions</h2>
              <p className="text-sm text-gray-500">
                Control which action buttons this administrator can see and use on the Screens page.
              </p>
              
              {/* Legend */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-600 mb-2">Action Buttons:</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Edit className="w-3 h-3" /> Edit Content - Edit screen elements</span>
                  <span className="flex items-center gap-1"><LayoutGrid className="w-3 h-3" /> Menu Config - Configure menu placement</span>
                  <span className="flex items-center gap-1"><Package className="w-3 h-3" /> Module Config - Assign modules</span>
                  <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Publish/Draft - Toggle screen status</span>
                </div>
              </div>
              
              {/* Bulk actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 mr-2">Set all:</span>
                {[
                  { key: 'can_edit_content', label: 'Edit' },
                  { key: 'can_menu_config', label: 'Menu' },
                  { key: 'can_module_config', label: 'Module' },
                  { key: 'can_toggle_publish', label: 'Publish' },
                ].map((perm) => (
                  <div key={perm.key} className="flex gap-1">
                    <button
                      onClick={() => setAllScreenPermissions(perm.key as keyof ScreenPermissions, true)}
                      className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      All {perm.label}
                    </button>
                    <button
                      onClick={() => setAllScreenPermissions(perm.key as keyof ScreenPermissions, false)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      None
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Screen
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      <Edit className="w-4 h-4 mx-auto mb-1" />
                      Edit Content
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      <LayoutGrid className="w-4 h-4 mx-auto mb-1" />
                      Menu Config
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      <Package className="w-4 h-4 mx-auto mb-1" />
                      Module Config
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      <RefreshCw className="w-4 h-4 mx-auto mb-1" />
                      Publish/Draft
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {screens.map((screen) => (
                    <tr key={screen.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{screen.name}</span>
                          <span className="text-xs text-gray-400">({screen.screen_key})</span>
                        </div>
                      </td>
                      {['can_edit_content', 'can_menu_config', 'can_module_config', 'can_toggle_publish'].map((perm) => (
                        <td key={perm} className="px-4 py-4 text-center">
                          <button
                            onClick={() => toggleScreenPermission(screen.id, perm as keyof ScreenPermissions)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              screenPermissions[screen.id]?.[perm as keyof ScreenPermissions]
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            {screenPermissions[screen.id]?.[perm as keyof ScreenPermissions] ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <XCircle className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Menu Access Tab */}
        {activeTab === 'menu' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Sidebar Menu Access</h2>
            <p className="text-sm text-gray-500 mb-6">
              Control which menu items this administrator can see and access in the sidebar.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'property_listings', label: 'Property Listings', description: 'View and manage property listings', icon: Home },
                { key: 'bookings', label: 'Bookings', description: 'View and manage bookings', icon: Calendar },
                { key: 'contact_submissions', label: 'Contact Submissions', description: 'View contact form submissions', icon: Mail },
                { key: 'menus', label: 'Menus', description: 'Manage app navigation menus', icon: Menu },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    menuAccess[item.key as keyof typeof menuAccess]
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setMenuAccess(prev => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev]
                  }))}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${
                        menuAccess[item.key as keyof typeof menuAccess]
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      menuAccess[item.key as keyof typeof menuAccess]
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}>
                      {menuAccess[item.key as keyof typeof menuAccess] && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
