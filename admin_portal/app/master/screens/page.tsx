'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appScreensAPI } from '@/lib/api';
import { ArrowLeft, Monitor, Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function MasterScreens() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [screens, setScreens] = useState<any[]>([]);
  const [filteredScreens, setFilteredScreens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

    fetchScreens();
  }, [isAuthenticated, user, router]);

  const fetchScreens = async () => {
    try {
      const response = await appScreensAPI.getAll();
      const screensData = Array.isArray(response.data) ? response.data : [];
      setScreens(screensData);
      setFilteredScreens(screensData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching screens:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = screens.filter(screen =>
        screen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        screen.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        screen.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredScreens(filtered);
    } else {
      setFilteredScreens(screens);
    }
  }, [searchQuery, screens]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading screens...</p>
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
                onClick={() => router.push('/master')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Screens Management</h1>
                <p className="text-sm text-gray-500">{screens.length} total screens</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/master/screens/new')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Create Screen
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search screens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Screens Table */}
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
                  Apps
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
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
              {filteredScreens.map((screen) => (
                <tr key={screen.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{screen.name}</div>
                        <div className="text-sm text-gray-500">{screen.description}</div>
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
                    <div className="text-sm text-gray-900">{screen.app_count || 0} apps</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {screen.first_name} {screen.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      screen.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {screen.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/master/screens/${screen.id}`)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                        title="Edit Screen"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this screen?')) {
                            // TODO: Implement delete
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete Screen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredScreens.length === 0 && (
            <div className="text-center py-12">
              <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No screens found' : 'No screens created yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search criteria' 
                  : 'Create your first screen to get started'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => router.push('/master/screens/new')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" />
                  Create Screen
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
