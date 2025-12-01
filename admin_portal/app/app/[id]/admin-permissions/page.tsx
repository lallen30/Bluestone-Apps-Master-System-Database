'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, permissionsAPI, appScreensAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { 
  ArrowLeft, Save, Shield, Monitor, Menu, Mail, Home, Calendar,
  Eye, Edit, Trash2, Plus, Settings, Users, CheckCircle, XCircle,
  UserCog, ChevronDown, ChevronRight
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
  can_manage_users: boolean;
  can_manage_settings: boolean;
  custom_permissions: any;
}

interface ScreenPermissions {
  can_edit_content: boolean;
  can_menu_config: boolean;
  can_module_config: boolean;
  can_toggle_publish: boolean;
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

const defaultMenuAccess = {
  property_listings: true,
  bookings: true,
  contact_submissions: true,
  menus: false,
  app_users: false,
  roles: false,
};

export default function AdminPermissionsOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();
  
  const [app, setApp] = useState<any>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Only Master Admin can access this page
    if (user && user.role_level !== 1) {
      router.push(`/app/${appId}`);
      return;
    }

    if (token && !user) {
      return;
    }

    fetchData();
  }, [isAuthenticated, user, appId, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch app details
      const appResponse = await appsAPI.getById(parseInt(appId));
      setApp(appResponse.data);

      // Fetch admin users
      const usersResponse = await permissionsAPI.getAppUsers(parseInt(appId));
      setAdminUsers(usersResponse.data || []);

      // Fetch screens
      const screensResponse = await appScreensAPI.getAppScreens(parseInt(appId));
      setScreens(screensResponse.data || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const toggleUserExpanded = (userId: number) => {
    setExpandedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const parseCustomPermissions = (customPerms: any): CustomPermissions | null => {
    if (!customPerms) return null;
    try {
      return typeof customPerms === 'string' ? JSON.parse(customPerms) : customPerms;
    } catch {
      return null;
    }
  };

  const getMenuAccessSummary = (customPerms: CustomPermissions | null) => {
    if (!customPerms?.menu_access) return 'Default (All Access)';
    const access = customPerms.menu_access;
    const enabled = Object.entries(access).filter(([_, v]) => v).map(([k]) => k.replace(/_/g, ' '));
    if (enabled.length === 6) return 'Full Access';
    if (enabled.length === 0) return 'No Menu Access';
    return `${enabled.length}/6 items`;
  };

  const getScreenPermissionsSummary = (customPerms: CustomPermissions | null) => {
    if (!customPerms?.screens) return 'Default';
    const screenCount = Object.keys(customPerms.screens).length;
    return `${screenCount} screens configured`;
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-600" />
                Administrator Permissions Overview
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage detailed permissions for all administrators
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Permission System</h3>
              <p className="text-sm text-blue-700 mt-1">
                Each administrator can have custom permissions that control:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• <strong>General Permissions:</strong> View, Edit, Delete, Publish, Manage Users, Manage Settings</li>
                <li>• <strong>Screen Actions:</strong> What actions they can perform on each screen (View, Add, Edit, Delete)</li>
                <li>• <strong>Menu Access:</strong> Which sidebar menu items they can see and access</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Administrators List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Administrators ({adminUsers.length})</h2>
          </div>
          
          <div className="divide-y">
            {adminUsers.map((adminUser) => {
              const customPerms = parseCustomPermissions(adminUser.custom_permissions);
              const isExpanded = expandedUsers.has(adminUser.user_id);
              
              return (
                <div key={adminUser.user_id} className="hover:bg-gray-50">
                  {/* User Row */}
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleUserExpanded(adminUser.user_id)}
                  >
                    <div className="flex items-center gap-4">
                      <button className="text-gray-400">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserCog className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {adminUser.first_name} {adminUser.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{adminUser.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        adminUser.role_level === 1
                          ? 'bg-purple-100 text-purple-800'
                          : adminUser.role_level === 2
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {adminUser.role_name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Quick Permission Badges */}
                      <div className="flex gap-1">
                        {adminUser.can_view && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">View</span>}
                        {adminUser.can_edit && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Edit</span>}
                        {adminUser.can_delete && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Delete</span>}
                        {adminUser.can_publish && <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">Publish</span>}
                      </div>
                      
                      <Button
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/app/${appId}/users/${adminUser.user_id}/permissions`);
                        }}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 ml-14 bg-gray-50 rounded-b-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                        {/* General Permissions */}
                        <div className="bg-white p-4 rounded-lg border">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-purple-600" />
                            General Permissions
                          </h4>
                          <div className="space-y-2">
                            {[
                              { key: 'can_manage_users', label: 'Manage Users', value: adminUser.can_manage_users },
                              { key: 'can_manage_settings', label: 'Manage Settings', value: adminUser.can_manage_settings },
                            ].map((perm) => (
                              <div key={perm.key} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{perm.label}</span>
                                {perm.value ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-gray-300" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Menu Access */}
                        <div className="bg-white p-4 rounded-lg border">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Menu className="w-4 h-4 text-blue-600" />
                            Menu Access
                          </h4>
                          {customPerms?.menu_access ? (
                            <div className="space-y-2">
                              {[
                                { key: 'property_listings', label: 'Property Listings', icon: Home },
                                { key: 'bookings', label: 'Bookings', icon: Calendar },
                                { key: 'contact_submissions', label: 'Contact Submissions', icon: Mail },
                                { key: 'menus', label: 'Menus', icon: Menu },
                                { key: 'app_users', label: 'App Users', icon: Users },
                                { key: 'roles', label: 'Roles', icon: Shield },
                              ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 flex items-center gap-2">
                                    <item.icon className="w-3 h-3" />
                                    {item.label}
                                  </span>
                                  {customPerms.menu_access[item.key as keyof typeof customPerms.menu_access] ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-gray-300" />
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">Default (Full Access)</p>
                          )}
                        </div>
                        
                        {/* Screen Permissions */}
                        <div className="bg-white p-4 rounded-lg border">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-green-600" />
                            Screen Permissions
                          </h4>
                          {customPerms?.screens && Object.keys(customPerms.screens).length > 0 ? (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {screens.slice(0, 5).map((screen) => {
                                const perms = customPerms.screens[screen.id];
                                if (!perms) return null;
                                return (
                                  <div key={screen.id} className="text-sm">
                                    <span className="text-gray-600">{screen.name}</span>
                                    <div className="flex gap-1 mt-1">
                                      {perms.can_edit_content && <span className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Edit</span>}
                                      {perms.can_menu_config && <span className="px-1 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">Menu</span>}
                                      {perms.can_module_config && <span className="px-1 py-0.5 bg-green-100 text-green-700 rounded text-xs">Module</span>}
                                      {perms.can_toggle_publish && <span className="px-1 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Publish</span>}
                                    </div>
                                  </div>
                                );
                              })}
                              {Object.keys(customPerms.screens).length > 5 && (
                                <p className="text-xs text-gray-400">
                                  +{Object.keys(customPerms.screens).length - 5} more screens
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">Default (Based on general permissions)</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
