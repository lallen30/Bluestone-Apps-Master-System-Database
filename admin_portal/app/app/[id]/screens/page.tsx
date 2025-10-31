'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, permissionsAPI, appScreensAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { Monitor, Sparkles, Edit, Eye } from 'lucide-react';

export default function AppScreens() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [app, setApp] = useState<any>(null);
  const [screens, setScreens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (token && !user) {
      return;
    }

    fetchData();
  }, [isAuthenticated, user, params.id, router]);

  const fetchData = async () => {
    try {
      const appId = parseInt(params.id as string);
      
      // Fetch app details
      const appResponse = await appsAPI.getById(appId);
      setApp(appResponse.data);

      // Fetch assigned screens
      const screensResponse = await appScreensAPI.getAppScreens(appId);
      setScreens(Array.isArray(screensResponse.data) ? screensResponse.data : []);

      // Check user permissions
      if (user?.id) {
        // Master Admins have full access to all apps
        if (user.role_level !== 1) {
          const permsResponse = await permissionsAPI.getUserPermissions(user.id);
          const userPerms = permsResponse.data?.find((p: any) => p.app_id === appId);
          
          if (!userPerms) {
            router.push('/master');
            return;
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout appId={params.id as string} appName={app?.name || 'Loading...'}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!app) {
    return null;
  }

  return (
    <AppLayout appId={params.id as string} appName={app.name}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Screens</h1>
          <p className="text-gray-600 mt-2">
            Manage screens and pages for {app.name}
          </p>
        </div>

        {/* Screens List */}
        {screens.length === 0 ? (
          <div className="max-w-2xl mx-auto mt-16">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Monitor className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Screens Assigned</h2>
              <p className="text-gray-600 mb-6">
                This app doesn't have any screens assigned yet. Contact your master admin to assign screens.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screens.map((screen) => (
              <div
                key={screen.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-primary" />
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    screen.assigned_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {screen.assigned_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{screen.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{screen.description || 'No description'}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{screen.element_count || 0} elements</span>
                  {screen.category && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {screen.category}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/app/${params.id}/screens/${screen.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Content
                  </button>
                  <button
                    onClick={() => alert('Preview coming soon!')}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
