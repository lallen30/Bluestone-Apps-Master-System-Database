'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, usersAPI, appScreensAPI, screenElementsAPI, modulesAPI } from '@/lib/api';
import { Users, Globe, Activity, LogOut, Monitor, Layers, Sparkles, Package, FileText } from 'lucide-react';
import Icon from '@mdi/react';
import * as mdiIcons from '@mdi/js';

// Convert icon name to mdi path key (e.g., 'home' -> 'mdiHome')
const toMdiKey = (iconName: string): string => {
  if (!iconName) return '';
  return 'mdi' + iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

// Get MDI path by icon name
const getMdiPath = (iconName: string): string | null => {
  if (!iconName) return null;
  const key = toMdiKey(iconName);
  return (mdiIcons as any)[key] || null;
};

// Get icon for element category
const getCategoryIcon = (category: string): string => {
  const categoryIcons: { [key: string]: string } = {
    'Input': 'form-textbox',
    'Selection': 'format-list-checks',
    'DateTime': 'calendar-clock',
    'Media': 'image-multiple',
    'Display': 'monitor',
    'Content': 'file-document',
    'Navigation': 'navigation',
    'Interactive': 'gesture-tap',
    'Advanced': 'cog',
    'action': 'gesture-tap-button',
    'detail': 'information',
    'forms': 'form-select',
    'lists': 'format-list-bulleted',
    'messaging': 'message',
    'search': 'magnify',
  };
  return categoryIcons[category] || 'layers';
};

export default function MasterDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, logout } = useAuthStore();
  const [apps, setApps] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [screens, setScreens] = useState<any[]>([]);
  const [screenElements, setScreenElements] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('auth_token');
    
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // If we have a token but store hasn't hydrated yet, wait
    if (token && !user) {
      return;
    }

    if (user?.role_level !== 1) {
      router.push('/dashboard');
      return;
    }

    // Fetch data
    Promise.all([
      appsAPI.getAll(),
      usersAPI.getAll(),
      appScreensAPI.getAll(),
      screenElementsAPI.getAll(),
      modulesAPI.getAll(),
    ])
      .then(([appsResponse, usersResponse, screensResponse, elementsResponse, modulesResponse]) => {
        const appsData = Array.isArray(appsResponse.data) ? appsResponse.data : [];
        const usersData = Array.isArray(usersResponse.data) ? usersResponse.data : [];
        const screensData = Array.isArray(screensResponse.data) ? screensResponse.data : [];
        const elementsData = Array.isArray(elementsResponse.data) ? elementsResponse.data : [];
        const modulesData = Array.isArray(modulesResponse.data) ? modulesResponse.data : [];
        
        console.log('Dashboard data loaded:', {
          apps: appsData.length,
          users: usersData.length,
          screens: screensData.length,
          elements: elementsData.length,
          modules: modulesData.length
        });
        console.log('Apps data:', appsData);
        console.log('Users data:', usersData);
        
        setApps(appsData);
        setUsers(usersData);
        setScreens(screensData);
        setScreenElements(elementsData);
        setModules(modulesData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Apps',
      value: apps.length,
      icon: Globe,
      color: 'bg-blue-500',
    },
    {
      title: 'Administrators',
      value: users.length,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'App Screens',
      value: screens.length,
      icon: Monitor,
      color: 'bg-indigo-500',
    },
    {
      title: 'Elements',
      value: screenElements.length,
      icon: Layers,
      color: 'bg-pink-500',
    },
    {
      title: 'Active Apps',
      value: apps.filter((app) => app.is_active).length,
      icon: Activity,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Master Admin Portal</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.first_name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => router.push('/master/apps')}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Apps</h3>
                <p className="text-sm text-gray-500">Manage applications</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => router.push('/master/screens')}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Screens</h3>
                <p className="text-sm text-gray-500">Manage screens</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => router.push('/master/screen-elements')}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Elements</h3>
                <p className="text-sm text-gray-500">Element library</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => router.push('/master/app-templates')}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">App Templates</h3>
                <p className="text-sm text-gray-500">Template management</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/master/modules')}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Modules</h3>
                <p className="text-sm text-gray-500">Navigation & UI modules</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/master/forms')}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Forms</h3>
                <p className="text-sm text-gray-500">Reusable form templates</p>
              </div>
            </div>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Apps List */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
            <button
              onClick={() => router.push('/master/apps')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Manage Apps →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apps.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No applications found. Create your first app to get started.
                    </td>
                  </tr>
                ) : (
                  apps.slice(0, 10).map((app) => (
                    <tr 
                      key={app.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/app/${app.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{app.name}</div>
                        <div className="text-sm text-gray-500">{app.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{app.domain}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            app.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {app.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.user_count || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {apps.length > 10 && (
            <div className="px-6 py-4 border-t border-gray-200 text-center">
              <button
                onClick={() => router.push('/master/apps')}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View All ({apps.length} total)
              </button>
            </div>
          )}
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">App Administrators</h2>
            <button
              onClick={() => router.push('/master/users')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Manage Administrators →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.slice(0, 10).map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {u.first_name} {u.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.role_level === 1
                            ? 'bg-purple-100 text-purple-800'
                            : u.role_level === 2
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {u.role_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length > 10 && (
            <div className="px-6 py-4 border-t border-gray-200 text-center">
              <button
                onClick={() => router.push('/master/users')}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View All ({users.length} total)
              </button>
            </div>
          )}
        </div>

        {/* Screens List */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">App Screens</h2>
            <button
              onClick={() => router.push('/master/screens')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Manage Screens →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apps
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {screens.slice(0, 10).map((screen) => (
                  <tr key={screen.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/master/screens/${screen.id}`)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          {screen.icon && getMdiPath(screen.icon) ? (
                            <Icon path={getMdiPath(screen.icon)!} size={0.7} className="text-indigo-600" />
                          ) : (
                            <Monitor className="w-4 h-4 text-indigo-600" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{screen.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {screen.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{screen.app_count || 0} apps</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(screen.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {screens.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                      No screens created yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {screens.length > 10 && (
            <div className="px-6 py-4 border-t border-gray-200 text-center">
              <button
                onClick={() => router.push('/master/screens')}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View All ({screens.length} total)
              </button>
            </div>
          )}
        </div>

        {/* Screen Elements Summary */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Elements</h2>
            <button
              onClick={() => router.push('/master/screen-elements')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View Library →
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.isArray(screenElements) && Object.entries(
                screenElements.reduce((acc: any, element: any) => {
                  acc[element.category] = (acc[element.category] || 0) + 1;
                  return acc;
                }, {})
              ).map(([category, count]) => {
                const categoryIconPath = getMdiPath(getCategoryIcon(category));
                return (
                  <div key={category} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {categoryIconPath ? (
                        <Icon path={categoryIconPath} size={0.7} className="text-gray-500" />
                      ) : (
                        <Layers className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-sm font-medium text-gray-900">{category}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{count as number}</p>
                    <p className="text-xs text-gray-500 mt-1">elements</p>
                  </div>
                );
              })}
            </div>
            {(!Array.isArray(screenElements) || screenElements.length === 0) && (
              <p className="text-center text-sm text-gray-500 py-8">
                No screen elements available
              </p>
            )}
          </div>
        </div>

        {/* Modules Summary */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Modules</h2>
            <button
              onClick={() => router.push('/master/modules')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View Library →
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.isArray(modules) && Object.entries(
                modules.reduce((acc: any, module: any) => {
                  const typeLabel = module.module_type === 'header_bar' ? 'Header Bar' : 
                                   module.module_type === 'footer_bar' ? 'Footer Bar' : 
                                   module.module_type === 'floating_action_button' ? 'FAB' : 
                                   module.module_type;
                  acc[typeLabel] = (acc[typeLabel] || 0) + 1;
                  return acc;
                }, {})
              ).map(([type, count]) => (
                <div key={type} className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-gray-900">{type}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{count as number}</p>
                  <p className="text-xs text-gray-500 mt-1">modules</p>
                </div>
              ))}
            </div>
            {(!Array.isArray(modules) || modules.length === 0) && (
              <p className="text-center text-sm text-gray-500 py-8">
                No modules available
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
