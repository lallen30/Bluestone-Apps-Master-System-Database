'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, appScreensAPI } from '@/lib/api';
import { ArrowLeft, Plus, X, Monitor, Check, GripVertical, Search } from 'lucide-react';

interface Screen {
  id: number;
  name: string;
  screen_key: string;
  description: string;
  category: string;
  icon: string;
  element_count: number;
  is_assigned?: boolean;
  assigned_order?: number;
  assigned_active?: boolean;
}

export default function AppScreensManagement() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState<any>(null);
  const [allScreens, setAllScreens] = useState<Screen[]>([]);
  const [assignedScreens, setAssignedScreens] = useState<Screen[]>([]);
  const [availableScreens, setAvailableScreens] = useState<Screen[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (token && !user) {
      return;
    }

    if (user?.role_level !== 1) {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [isAuthenticated, user, router, appId]);

  const fetchData = async () => {
    try {
      // Fetch app details
      const appResponse = await appsAPI.getById(parseInt(appId));
      setApp(appResponse.data);

      // Fetch all screens
      const allScreensResponse = await appScreensAPI.getAll();
      const screens = Array.isArray(allScreensResponse.data) ? allScreensResponse.data : [];
      
      // Fetch assigned screens for this app
      const assignedResponse = await appScreensAPI.getAppScreens(parseInt(appId));
      const assigned = Array.isArray(assignedResponse.data) ? assignedResponse.data : [];
      
      // Mark which screens are assigned
      const assignedIds = new Set(assigned.map((s: any) => s.id));
      const screensWithStatus = screens.map((screen: any) => {
        const assignedScreen = assigned.find((a: any) => a.id === screen.id);
        return {
          ...screen,
          is_assigned: assignedIds.has(screen.id),
          assigned_order: assignedScreen?.assigned_order || 0,
          assigned_active: assignedScreen?.assigned_active || false
        };
      });

      setAllScreens(screensWithStatus);
      setAssignedScreens(screensWithStatus.filter((s: Screen) => s.is_assigned).sort((a: Screen, b: Screen) => (a.assigned_order || 0) - (b.assigned_order || 0)));
      setAvailableScreens(screensWithStatus.filter((s: Screen) => !s.is_assigned));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleAssignScreen = async (screenId: number) => {
    try {
      await appScreensAPI.assignScreen({
        app_id: parseInt(appId),
        screen_id: screenId,
        display_order: assignedScreens.length
      });
      
      await fetchData();
    } catch (error) {
      console.error('Error assigning screen:', error);
      alert('Error assigning screen');
    }
  };

  const handleUnassignScreen = async (screenId: number) => {
    if (!confirm('Are you sure you want to unassign this screen from the app?')) {
      return;
    }

    try {
      await appScreensAPI.unassignScreen(parseInt(appId), screenId);
      await fetchData();
    } catch (error) {
      console.error('Error unassigning screen:', error);
      alert('Error unassigning screen');
    }
  };

  const moveScreen = async (screenId: number, direction: 'up' | 'down') => {
    const index = assignedScreens.findIndex(s => s.id === screenId);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
      const newScreens = [...assignedScreens];
      [newScreens[index], newScreens[index - 1]] = [newScreens[index - 1], newScreens[index]];
      setAssignedScreens(newScreens);
      
      // Update display orders in backend
      for (let i = 0; i < newScreens.length; i++) {
        await appScreensAPI.assignScreen({
          app_id: parseInt(appId),
          screen_id: newScreens[i].id,
          display_order: i
        });
      }
    } else if (direction === 'down' && index < assignedScreens.length - 1) {
      const newScreens = [...assignedScreens];
      [newScreens[index], newScreens[index + 1]] = [newScreens[index + 1], newScreens[index]];
      setAssignedScreens(newScreens);
      
      // Update display orders in backend
      for (let i = 0; i < newScreens.length; i++) {
        await appScreensAPI.assignScreen({
          app_id: parseInt(appId),
          screen_id: newScreens[i].id,
          display_order: i
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
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
              <button
                onClick={() => router.push('/master/apps')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Screens</h1>
                <p className="text-sm text-gray-500">{app?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assigned Screens */}
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Assigned Screens ({assignedScreens.length})</h2>
                <p className="text-sm text-gray-500 mt-1">Screens currently assigned to this app</p>
              </div>
              
              <div className="p-6">
                {assignedScreens.length === 0 ? (
                  <div className="text-center py-12">
                    <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No screens assigned</h3>
                    <p className="text-gray-500">Assign screens from the available list</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assignedScreens.map((screen, index) => (
                      <div
                        key={screen.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => moveScreen(screen.id, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                          
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Monitor className="w-5 h-5 text-primary" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{screen.name}</div>
                            <div className="text-sm text-gray-500">{screen.description}</div>
                            <div className="flex items-center gap-2 mt-1">
                              {screen.category && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                  {screen.category}
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {screen.element_count || 0} elements
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleUnassignScreen(screen.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Available Screens */}
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Available Screens ({availableScreens.length})</h2>
                <p className="text-sm text-gray-500 mt-1">Click to assign to this app</p>
                
                {/* Search Field */}
                <div className="mt-4 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search screens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="p-6">
                {availableScreens.length === 0 ? (
                  <div className="text-center py-12">
                    <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All screens assigned</h3>
                    <p className="text-gray-500">All available screens are already assigned to this app</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableScreens
                      .filter((screen) => {
                        if (!searchTerm) return true;
                        const search = searchTerm.toLowerCase();
                        return (
                          screen.name.toLowerCase().includes(search) ||
                          screen.description?.toLowerCase().includes(search) ||
                          screen.category?.toLowerCase().includes(search) ||
                          screen.screen_key?.toLowerCase().includes(search)
                        );
                      })
                      .map((screen) => (
                      <button
                        key={screen.id}
                        onClick={() => handleAssignScreen(screen.id)}
                        className="w-full border border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Monitor className="w-5 h-5 text-gray-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{screen.name}</div>
                            <div className="text-sm text-gray-500">{screen.description}</div>
                            <div className="flex items-center gap-2 mt-1">
                              {screen.category && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                  {screen.category}
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {screen.element_count || 0} elements
                              </span>
                            </div>
                          </div>
                          
                          <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>
                      </button>
                    ))}
                    {availableScreens.filter((screen) => {
                      if (!searchTerm) return true;
                      const search = searchTerm.toLowerCase();
                      return (
                        screen.name.toLowerCase().includes(search) ||
                        screen.description?.toLowerCase().includes(search) ||
                        screen.category?.toLowerCase().includes(search) ||
                        screen.screen_key?.toLowerCase().includes(search)
                      );
                    }).length === 0 && searchTerm && (
                      <div className="text-center py-8">
                        <Search className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No screens found matching "{searchTerm}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
