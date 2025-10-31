'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, permissionsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { Monitor, Sparkles } from 'lucide-react';

export default function AppScreens() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [app, setApp] = useState<any>(null);
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

        {/* Coming Soon Card */}
        <div className="max-w-2xl mx-auto mt-16">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Monitor className="w-10 h-10 text-white" />
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <h2 className="text-3xl font-bold text-gray-900">Coming Soon</h2>
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            
            <p className="text-lg text-gray-600 mb-6">
              Screen management functionality is currently under development.
            </p>
            
            <div className="bg-white rounded-lg p-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">What's coming:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Edit content for screens</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Version control and publishing workflow</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
