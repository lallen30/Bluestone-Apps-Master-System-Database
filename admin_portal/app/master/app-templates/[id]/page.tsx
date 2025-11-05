'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appTemplatesAPI } from '@/lib/api';
import { ArrowLeft, Plus, Search, Edit, Trash2, Sparkles, Monitor, GripVertical, Eye } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableRowProps {
  screen: any;
  templateId: string;
  router: any;
  handleOpenModal: (screen: any) => void;
  handleDelete: (id: number, name: string) => void;
}

function SortableRow({ screen, templateId, router, handleOpenModal, handleDelete }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: screen.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-sm font-medium text-gray-900">{screen.display_order}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Monitor className="w-5 h-5 text-primary" />
          </div>
          <div>
            <button
              onClick={() => router.push(`/master/app-templates/${templateId}/screens/${screen.id}`)}
              className="text-sm font-medium text-gray-900 hover:text-primary text-left"
            >
              {screen.screen_name}
            </button>
            <div className="text-sm text-gray-500">{screen.screen_description || 'No description'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {screen.screen_category ? (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {screen.screen_category}
          </span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {screen.screen_key}
        </code>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {screen.elements?.length || 0} modules
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {screen.is_home_screen ? (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Home
          </span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => router.push(`/master/app-templates/${templateId}/screens/${screen.id}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="View Modules"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenModal(screen)}
            className="p-2 text-primary hover:bg-primary/10 rounded-lg"
            title="Edit Screen"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(screen.id, screen.screen_name)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete Screen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AppTemplateDetail() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();
  const [template, setTemplate] = useState<any>(null);
  const [screens, setScreens] = useState<any[]>([]);
  const [filteredScreens, setFilteredScreens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingScreen, setEditingScreen] = useState<any>(null);
  const [isReordering, setIsReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [formData, setFormData] = useState({
    screen_name: '',
    screen_key: '',
    screen_description: '',
    screen_icon: '',
    screen_category: '',
    display_order: 0,
    is_home_screen: false
  });

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

    fetchTemplateDetails();
  }, [isAuthenticated, user, router, templateId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredScreens(screens);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = screens.filter(screen =>
        screen.screen_name.toLowerCase().includes(query) ||
        screen.screen_description?.toLowerCase().includes(query) ||
        screen.screen_category?.toLowerCase().includes(query)
      );
      setFilteredScreens(filtered);
    }
  }, [searchQuery, screens]);

  const fetchTemplateDetails = async () => {
    try {
      const response = await appTemplatesAPI.getById(parseInt(templateId));
      setTemplate(response.data.template);
      setScreens(response.data.screens || []);
      setFilteredScreens(response.data.screens || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching template details:', error);
      setLoading(false);
    }
  };

  const handleOpenModal = (screen?: any) => {
    if (screen) {
      setEditingScreen(screen);
      setFormData({
        screen_name: screen.screen_name,
        screen_key: screen.screen_key,
        screen_description: screen.screen_description || '',
        screen_icon: screen.screen_icon || '',
        screen_category: screen.screen_category || '',
        display_order: screen.display_order || 0,
        is_home_screen: screen.is_home_screen || false
      });
    } else {
      setEditingScreen(null);
      setFormData({
        screen_name: '',
        screen_key: '',
        screen_description: '',
        screen_icon: '',
        screen_category: '',
        display_order: screens.length + 1,
        is_home_screen: false
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingScreen(null);
    setFormData({
      screen_name: '',
      screen_key: '',
      screen_description: '',
      screen_icon: '',
      screen_category: '',
      display_order: 0,
      is_home_screen: false
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.screen_name.trim() || !formData.screen_key.trim()) {
      alert('Screen name and key are required');
      return;
    }

    try {
      if (editingScreen) {
        await appTemplatesAPI.updateScreen(parseInt(templateId), editingScreen.id, formData);
      } else {
        await appTemplatesAPI.addScreen(parseInt(templateId), formData);
      }
      
      handleCloseModal();
      fetchTemplateDetails();
    } catch (error) {
      console.error('Error saving screen:', error);
      alert('Failed to save screen. Please try again.');
    }
  };

  const handleDelete = async (screenId: number, screenName: string) => {
    if (!confirm(`Are you sure you want to delete "${screenName}"?`)) {
      return;
    }

    try {
      await appTemplatesAPI.deleteScreen(parseInt(templateId), screenId);
      fetchTemplateDetails();
    } catch (error) {
      console.error('Error deleting screen:', error);
      alert('Failed to delete screen. Please try again.');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = filteredScreens.findIndex((screen) => screen.id === active.id);
    const newIndex = filteredScreens.findIndex((screen) => screen.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update UI
    const newScreens = arrayMove(filteredScreens, oldIndex, newIndex);
    setFilteredScreens(newScreens);
    setScreens(newScreens);

    // Update display_order on backend
    setIsReordering(true);
    try {
      // Update all affected screens with new display orders
      const updates = newScreens.map((screen, index) => ({
        id: screen.id,
        display_order: index + 1
      }));

      // Send batch update to backend
      for (const update of updates) {
        await appTemplatesAPI.updateScreen(parseInt(templateId), update.id, {
          display_order: update.display_order
        });
      }
    } catch (error) {
      console.error('Error reordering screens:', error);
      alert('Failed to reorder screens. Please try again.');
      // Revert on error
      fetchTemplateDetails();
    } finally {
      setIsReordering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Template not found</h2>
          <button
            onClick={() => router.push('/master/app-templates')}
            className="text-primary hover:text-primary/80"
          >
            ← Back to templates
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
            onClick={() => router.push('/master/app-templates')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App Templates
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{template.name}</h1>
                  {template.category && (
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mt-1">
                      {template.category}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-600">
                {template.description || 'No description'}
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Screen
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Screens</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{screens.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Home Screen</p>
                <p className="text-xl font-bold text-gray-900 mt-2">
                  {screens.find(s => s.is_home_screen)?.screen_name || 'Not set'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {new Set(screens.map(s => s.screen_category).filter(Boolean)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search screens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Screens Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isReordering && (
            <div className="px-6 py-2 bg-blue-50 border-b border-blue-200">
              <p className="text-sm text-blue-800">Saving new order...</p>
            </div>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Screen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modules
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Home
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <SortableContext
                items={filteredScreens.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredScreens.map((screen) => (
                    <SortableRow
                      key={screen.id}
                      screen={screen}
                      templateId={templateId}
                      router={router}
                      handleOpenModal={handleOpenModal}
                      handleDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </table>
          </DndContext>
        </div>

        {filteredScreens.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No screens found' : 'No screens yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? 'Try adjusting your search query' 
                : 'Add screens to this template to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Screen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingScreen ? 'Edit Screen' : 'Add New Screen'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Screen Name *
                  </label>
                  <input
                    type="text"
                    value={formData.screen_name}
                    onChange={(e) => setFormData({ ...formData, screen_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Login Screen"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Screen Key *
                  </label>
                  <input
                    type="text"
                    value={formData.screen_key}
                    onChange={(e) => setFormData({ ...formData, screen_key: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="login"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.screen_description}
                  onChange={(e) => setFormData({ ...formData, screen_description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="User login screen"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (Lucide)
                  </label>
                  <input
                    type="text"
                    value={formData.screen_icon}
                    onChange={(e) => setFormData({ ...formData, screen_icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="LogIn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.screen_category}
                    onChange={(e) => setFormData({ ...formData, screen_category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Auth"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_home_screen"
                  checked={formData.is_home_screen}
                  onChange={(e) => setFormData({ ...formData, is_home_screen: e.target.checked })}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="is_home_screen" className="text-sm font-medium text-gray-700">
                  Set as home screen
                </label>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingScreen ? 'Update Screen' : 'Add Screen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
