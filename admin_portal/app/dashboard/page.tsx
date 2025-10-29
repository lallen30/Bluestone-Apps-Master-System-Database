'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useAppStore } from '@/lib/store';
import { appsAPI } from '@/lib/api';
import { Globe, LogOut, Settings, Users } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { userApps, setUserApps, currentApp, setCurrentApp } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch user's apps
    appsAPI
      .getAll()
      .then((response) => {
        const apps = response.data || [];
        setUserApps(apps);
        if (apps.length > 0 && !currentApp) {
          setCurrentApp(apps[0]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching apps:', error);
        setLoading(false);
      });
  }, [isAuthenticated, router, setUserApps, setCurrentApp, currentApp]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
        {/* App Selector */}
        {userApps.length > 1 && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Application
            </label>
            <select
              value={currentApp?.id || ''}
              onChange={(e) => {
                const app = userApps.find((a) => a.id === parseInt(e.target.value));
                setCurrentApp(app || null);
              }}
              className="block w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {userApps.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name} - {app.domain}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Current App Info */}
        {currentApp && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{currentApp.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Domain</p>
                <p className="text-base font-medium text-gray-900">{currentApp.domain}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-base font-medium text-gray-900">
                  {currentApp.description || 'No description'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                    currentApp.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {currentApp.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Your Role</p>
                <p className="text-base font-medium text-gray-900">{user?.role_name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Content</h3>
                <p className="text-sm text-gray-500">Manage app content</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                <p className="text-sm text-gray-500">Manage users</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-500">App settings</p>
              </div>
            </div>
          </div>
        </div>

        {/* No Apps Message */}
        {userApps.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications</h3>
            <p className="text-gray-500">
              You don't have access to any applications yet. Contact your administrator.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
