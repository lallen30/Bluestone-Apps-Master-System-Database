'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, appScreensAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { ArrowLeft, Monitor, Home, Edit, Smartphone, Grid, List, Settings } from 'lucide-react';
import Icon from '@mdi/react';
import * as mdiIcons from '@mdi/js';

// Convert icon name to mdi path key
const toMdiKey = (iconName: string): string => {
  if (!iconName) return '';
  return 'mdi' + iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

const getMdiPath = (iconName: string): string | null => {
  if (!iconName) return null;
  const key = toMdiKey(iconName);
  return (mdiIcons as any)[key] || null;
};

interface Screen {
  id: number;
  name: string;
  screen_key: string;
  description: string;
  icon: string;
  is_published: boolean;
  is_home_screen: boolean;
  category: string;
}

export default function ScreenPreviewsPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();
  
  const [app, setApp] = useState<any>(null);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('large');

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
  }, [isAuthenticated, user, router, appId]);

  const fetchData = async () => {
    try {
      const [appResponse, screensResponse] = await Promise.all([
        appsAPI.getById(parseInt(appId)),
        appScreensAPI.getAppScreens(parseInt(appId))
      ]);
      
      setApp(appResponse.data);
      setScreens(screensResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGridCols = () => {
    switch (gridSize) {
      case 'small': return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6';
      case 'medium': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 'large': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const getPreviewHeight = () => {
    switch (gridSize) {
      case 'small': return 'h-48';
      case 'medium': return 'h-72';
      case 'large': return 'h-96';
    }
  };

  if (loading) {
    return (
      <AppLayout appId={appId} appName={app?.name || 'Loading...'}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading screen previews...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout appId={appId} appName={app?.name || 'App'}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/app/${appId}/screens`)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Screens</h1>
              <p className="text-gray-600">{screens.length} screens in this app</p>
            </div>
          </div>
          
        </div>

        {/* Screen Grid */}
        {screens.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No screens yet</h3>
            <p className="text-gray-600 mb-4">
              Add screens to your app to see previews here
            </p>
            <button
              onClick={() => router.push(`/app/${appId}/screens`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <List className="w-5 h-5" />
              Go to Screens
            </button>
          </div>
        ) : (
          <div className={`grid ${getGridCols()} gap-6`}>
            {screens.map((screen) => {
              const iconPath = getMdiPath(screen.icon);
              
              return (
                <div
                  key={screen.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Phone Frame Preview */}
                  <div className={`${getPreviewHeight()} bg-gradient-to-br from-gray-100 to-gray-200 relative flex items-center justify-center p-4`}>
                    {/* Phone mockup */}
                    <div className="bg-gray-900 rounded-[2rem] p-2 shadow-2xl w-full max-w-[180px] h-full">
                      <div className="bg-white rounded-[1.5rem] h-full overflow-hidden relative">
                        {/* Status bar */}
                        <div className="h-6 bg-gray-100 flex items-center justify-center">
                          <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
                        </div>
                        
                        {/* Screen content placeholder */}
                        <div className="flex-1 flex flex-col items-center justify-center p-4 h-[calc(100%-3rem)]">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${
                            screen.is_home_screen ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            {iconPath ? (
                              <Icon 
                                path={iconPath} 
                                size={1.5} 
                                className={screen.is_home_screen ? 'text-green-600' : 'text-blue-600'} 
                              />
                            ) : screen.is_home_screen ? (
                              <Home className="w-8 h-8 text-green-600" />
                            ) : (
                              <Monitor className="w-8 h-8 text-blue-600" />
                            )}
                          </div>
                          <p className="text-xs font-medium text-gray-700 text-center line-clamp-2">
                            {screen.name}
                          </p>
                        </div>
                        
                        {/* Bottom bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-100 flex items-center justify-center">
                          <div className="w-24 h-1 bg-gray-300 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {screen.is_home_screen && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500 text-white shadow">
                          Home
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full shadow ${
                        screen.is_published 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}>
                        {screen.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    
                    {/* Hover Actions - Only show for Master Admin */}
                    {user?.role_level === 1 && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => router.push(`/app/${appId}/screens/${screen.id}`)}
                          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                          title="Edit screen"
                        >
                          <Edit className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={() => router.push(`/app/${appId}/screens/${screen.id}/elements`)}
                          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                          title="Manage screen elements"
                        >
                          <Settings className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Screen Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{screen.name}</h3>
                    {screen.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{screen.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
