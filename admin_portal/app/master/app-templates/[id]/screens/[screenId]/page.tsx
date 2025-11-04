'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appTemplatesAPI, screenElementsAPI } from '@/lib/api';
import { ArrowLeft, Plus, Search, Trash2, Monitor, Layers, GripVertical } from 'lucide-react';

export default function TemplateScreenModules() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;
  const screenId = params.screenId as string;
  const { user, isAuthenticated } = useAuthStore();
  const [template, setTemplate] = useState<any>(null);
  const [screen, setScreen] = useState<any>(null);
  const [screenElements, setScreenElements] = useState<any[]>([]);
  const [availableElements, setAvailableElements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredElements, setFilteredElements] = useState<any[]>([]);
  const [selectedElement, setSelectedElement] = useState<any>(null);

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
  }, [isAuthenticated, user, router, templateId, screenId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredElements(availableElements);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = availableElements.filter(element =>
        element.name.toLowerCase().includes(query) ||
        element.element_type?.toLowerCase().includes(query) ||
        element.category?.toLowerCase().includes(query)
      );
      setFilteredElements(filtered);
    }
  }, [searchQuery, availableElements]);

  const fetchData = async () => {
    try {
      // Get template and screen details
      const templateResponse = await appTemplatesAPI.getById(parseInt(templateId));
      setTemplate(templateResponse.data.template);
      
      const currentScreen = templateResponse.data.screens.find((s: any) => s.id === parseInt(screenId));
      setScreen(currentScreen);
      setScreenElements(currentScreen?.elements || []);

      // Get all available elements
      const elementsResponse = await screenElementsAPI.getAll();
      setAvailableElements(Array.isArray(elementsResponse.data) ? elementsResponse.data : []);
      setFilteredElements(Array.isArray(elementsResponse.data) ? elementsResponse.data : []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleAddElement = async (element: any) => {
    try {
      await appTemplatesAPI.addElementToScreen(parseInt(templateId), parseInt(screenId), {
        element_id: element.id,
        field_key: element.field_key || element.name.toLowerCase().replace(/\s+/g, '_'),
        label: element.name,
        display_order: screenElements.length + 1
      });
      
      setShowModal(false);
      setSearchQuery('');
      fetchData();
    } catch (error) {
      console.error('Error adding element:', error);
      alert('Failed to add module. Please try again.');
    }
  };

  const handleDeleteElement = async (elementId: number, elementName: string) => {
    if (!confirm(`Are you sure you want to remove "${elementName}"?`)) {
      return;
    }

    try {
      await appTemplatesAPI.deleteElementFromScreen(parseInt(templateId), parseInt(screenId), elementId);
      fetchData();
    } catch (error) {
      console.error('Error deleting element:', error);
      alert('Failed to remove module. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!template || !screen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Screen not found</h2>
          <button
            onClick={() => router.push(`/master/app-templates/${templateId}`)}
            className="text-primary hover:text-primary/80"
          >
            ← Back to template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/master/app-templates/${templateId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {template.name}
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{screen.screen_name}</h1>
                  {screen.screen_category && (
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mt-1">
                      {screen.screen_category}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-600">
                {screen.screen_description || 'No description'}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Module
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Modules</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{screenElements.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Template</p>
                <p className="text-xl font-bold text-gray-900 mt-2">{template.name}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Screen Key</p>
                <code className="text-sm font-bold text-gray-900 mt-2 block">{screen.screen_key}</code>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Modules Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Modules on this Screen</h2>
          </div>
          
          {screenElements.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Field Key
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {screenElements.map((element) => (
                  <tr key={element.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{element.display_order}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Layers className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{element.label || element.element_name}</div>
                          <div className="text-sm text-gray-500">{element.placeholder || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {element.element_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {element.element_category ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {element.element_category}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {element.field_key}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteElement(element.id, element.label || element.element_name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Remove Module"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
              <p className="text-gray-600 mb-4">Add modules to this screen to get started</p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Module
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Module Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add Module to Screen</h2>
            </div>

            <div className="p-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search modules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Available Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredElements.map((element) => (
                  <button
                    key={element.id}
                    onClick={() => handleAddElement(element)}
                    className="text-left p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Layers className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900">{element.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            {element.element_type}
                          </span>
                          {element.category && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {element.category}
                            </span>
                          )}
                        </div>
                        {element.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{element.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {filteredElements.length === 0 && (
                <div className="text-center py-8">
                  <Layers className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No modules found</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSearchQuery('');
                }}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
