'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useAppStore } from '@/lib/store';
import { permissionsAPI } from '@/lib/api';
import { Globe, LogOut, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, logout } = useAuthStore();
  const [userApps, setUserApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Log immediately on component mount (before any effects)
  console.log('Dashboard: Component mounted/rendered');
  console.log('Dashboard: Initial state - isAuthenticated:', isAuthenticated, 'user:', user);

  useEffect(() => {
    // Check if we have a token in localStorage (more reliable than store state during hydration)
    const token = localStorage.getItem('auth_token');
    const authStorage = localStorage.getItem('auth-storage');
    
    console.log('Dashboard: token exists?', !!token);
    console.log('Dashboard: auth-storage exists?', !!authStorage);
    console.log('Dashboard: isAuthenticated?', isAuthenticated);
    console.log('Dashboard: user?', user);
    
    if (!token && !isAuthenticated) {
      console.log('Dashboard: No token and not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    // If we have a token but store hasn't hydrated yet, wait
    if (token && !user) {
      console.log('Dashboard: Waiting for user data to load...');
      return;
    }

    // Redirect master admin to master dashboard
    if (user?.role_level === 1) {
      router.push('/master');
      return;
    }

    // Fetch user's assigned apps only if we have a user ID
    if (user?.id) {
      console.log('Dashboard: Fetching apps for user:', user.id, user.email);
      setLoading(true); // Reset loading state
      permissionsAPI
        .getUserPermissions(user.id)
        .then((response) => {
          console.log('Dashboard: Received apps:', response.data);
          const apps = response.data || [];
          setUserApps(apps);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching apps:', error);
          setUserApps([]); // Set empty array on error
          setLoading(false);
        });
    }
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
          <p className="text-gray-600 mt-1">Select an application to manage</p>
        </div>

        {/* Apps Grid */}
        {userApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userApps.map((app) => (
              <div
                key={app.app_id}
                onClick={() => router.push(`/app/${app.app_id}`)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200 hover:border-primary"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{app.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{app.domain}</p>
                
                {/* Permissions Badges */}
                <div className="flex flex-wrap gap-2">
                  {app.can_view === 1 || app.can_view === true ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      View
                    </span>
                  ) : null}
                  {app.can_edit === 1 || app.can_edit === true ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      Edit
                    </span>
                  ) : null}
                  {app.can_delete === 1 || app.can_delete === true ? (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                      Delete
                    </span>
                  ) : null}
                  {app.can_manage_users === 1 || app.can_manage_users === true ? (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                      Users
                    </span>
                  ) : null}
                  {app.can_manage_settings === 1 || app.can_manage_settings === true ? (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                      Settings
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
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
