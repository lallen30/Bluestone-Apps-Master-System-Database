'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, permissionsAPI, appScreensAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { Monitor, Sparkles, Edit, Eye, EyeOff } from 'lucide-react';

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

  const handlePublishToggle = async (screenId: number, isPublished: boolean) => {
    try {
      const appId = parseInt(params.id as string);
      
      if (isPublished) {
        await appScreensAPI.unpublishForApp(appId, screenId);
      } else {
        await appScreensAPI.publishForApp(appId, screenId);
      }
      
      // Refresh the screens list
      fetchData();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update publish status. Please try again.');
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
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Screen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Elements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {screens.map((screen) => (
                  <tr key={screen.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Monitor className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{screen.name}</div>
                          <div className="text-sm text-gray-500">{screen.description || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {screen.category ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {screen.category}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{screen.element_count || 0} elements</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        screen.is_published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {screen.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePublishToggle(screen.id, screen.is_published)}
                          className={`p-2 rounded-lg ${
                            screen.is_published
                              ? 'text-gray-600 hover:bg-gray-100'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={screen.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {screen.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => router.push(`/app/${params.id}/screens/${screen.id}`)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                          title="Edit Content"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
