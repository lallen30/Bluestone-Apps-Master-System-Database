'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { modulesAPI } from '@/lib/api';
import { Package, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';

interface Module {
  id: number;
  name: string;
  module_type: 'header_bar' | 'footer_bar' | 'floating_action_button';
  description: string | null;
  default_config: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ModulesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role_level !== 1) {
      router.push('/dashboard');
      return;
    }
    fetchModules();
  }, [user, router]);

  const fetchModules = async () => {
    try {
      const response = await modulesAPI.getAll();
      console.log('Modules API response:', response);
      const modulesData = Array.isArray(response.data) ? response.data : [];
      console.log('Modules data:', modulesData);
      setModules(modulesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching modules:', error);
      setModules([]);
      setLoading(false);
    }
  };

  const getModuleTypeLabel = (type: string) => {
    switch (type) {
      case 'header_bar':
        return 'Header Bar';
      case 'footer_bar':
        return 'Footer Bar';
      case 'floating_action_button':
        return 'Floating Action Button';
      default:
        return type;
    }
  };

  const getModuleTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'header_bar':
        return 'bg-blue-100 text-blue-800';
      case 'footer_bar':
        return 'bg-green-100 text-green-800';
      case 'floating_action_button':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/master')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Modules</h1>
                <p className="text-gray-600 mt-1">Reusable navigation and UI components</p>
              </div>
            </div>
            <button
              onClick={() => alert('Create module feature coming soon!')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Create Module
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">What are Modules?</h3>
          <p className="text-sm text-blue-800">
            Modules are reusable navigation and UI components that can be assigned to screens. 
            Unlike Elements (which are for user input), Modules provide app-wide functionality like 
            header bars, navigation menus, and floating action buttons.
          </p>
        </div>

        {/* Modules Grid */}
        {modules.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
            <p className="text-gray-600 mb-4">Create your first module to get started</p>
            <button
              onClick={() => alert('Create module feature coming soon!')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Create Module
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Module Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{module.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getModuleTypeBadgeColor(module.module_type)}`}>
                      {getModuleTypeLabel(module.module_type)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {module.description && (
                  <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                )}

                {/* Config Preview */}
                <div className="bg-gray-50 rounded p-3 mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Default Configuration:</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    {Object.entries(module.default_config || {}).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium">{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <span className={module.is_active ? 'text-green-600' : 'text-gray-400'}>
                    {module.is_active ? '● Active' : '○ Inactive'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => alert('Edit module feature coming soon!')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => alert('Delete module feature coming soon!')}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
