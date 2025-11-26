'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appTemplatesAPI } from '@/lib/api';
import { ArrowLeft, Plus, Search, Edit, Trash2, Sparkles, Eye, Copy, FileText, Monitor, Layers, ChevronDown, ChevronRight } from 'lucide-react';

export default function AppTemplates() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [templates, setTemplates] = useState<any[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [previewScreens, setPreviewScreens] = useState<any[]>([]);
  const [expandedScreens, setExpandedScreens] = useState<Set<number>>(new Set());
  const [duplicatingTemplate, setDuplicatingTemplate] = useState<any>(null);
  const [duplicateName, setDuplicateName] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    icon: '',
    is_active: true
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

    fetchTemplates();
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTemplates(templates);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = templates.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description?.toLowerCase().includes(query) ||
        template.category?.toLowerCase().includes(query)
      );
      setFilteredTemplates(filtered);
    }
  }, [searchQuery, templates]);

  const fetchTemplates = async () => {
    try {
      const response = await appTemplatesAPI.getAll();
      const templatesData = Array.isArray(response.data) ? response.data : [];
      setTemplates(templatesData);
      setFilteredTemplates(templatesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setLoading(false);
    }
  };

  const handleOpenModal = (template?: any) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        description: template.description || '',
        category: template.category || '',
        icon: template.icon || '',
        is_active: template.is_active
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        icon: '',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTemplate(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      icon: '',
      is_active: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Template name is required');
      return;
    }

    try {
      if (editingTemplate) {
        await appTemplatesAPI.update(editingTemplate.id, formData);
      } else {
        if (!user?.id) {
          alert('User ID is required');
          return;
        }
        await appTemplatesAPI.create({
          ...formData,
          created_by: user.id
        });
      }
      
      handleCloseModal();
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    }
  };

  const handleOpenDuplicateModal = (template: any) => {
    setDuplicatingTemplate(template);
    setDuplicateName(`${template.name} (Copy)`);
    setShowDuplicateModal(true);
  };

  const handleCloseDuplicateModal = () => {
    setShowDuplicateModal(false);
    setDuplicatingTemplate(null);
    setDuplicateName('');
  };

  const handleDuplicate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!duplicateName.trim()) {
      alert('Template name is required');
      return;
    }

    if (!user?.id) {
      alert('User not authenticated');
      return;
    }

    try {
      const response = await appTemplatesAPI.duplicate(duplicatingTemplate.id, {
        name: duplicateName,
        created_by: user.id
      });
      
      handleCloseDuplicateModal();
      fetchTemplates();
      
      // Navigate to the new template
      if (response.data?.id) {
        router.push(`/master/app-templates/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error duplicating template:', error);
      alert('Failed to duplicate template. Please try again.');
    }
  };

  const handlePreview = async (template: any) => {
    try {
      const response = await appTemplatesAPI.getById(template.id);
      setPreviewTemplate(response.data.template);
      setPreviewScreens(response.data.screens || []);
      setExpandedScreens(new Set());
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error loading template preview:', error);
      alert('Failed to load template preview. Please try again.');
    }
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setPreviewTemplate(null);
    setPreviewScreens([]);
    setExpandedScreens(new Set());
  };

  const toggleScreenExpand = (screenId: number) => {
    const newExpanded = new Set(expandedScreens);
    if (newExpanded.has(screenId)) {
      newExpanded.delete(screenId);
    } else {
      newExpanded.add(screenId);
    }
    setExpandedScreens(newExpanded);
  };

  const handleDelete = async (templateId: number, templateName: string) => {
    if (!confirm(`Are you sure you want to delete "${templateName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await appTemplatesAPI.delete(templateId);
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading templates...</p>
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/master')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">App Templates</h1>
                  <p className="text-sm text-gray-500">Manage app templates for quick app creation</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Template
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Templates Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Screens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <button
                          onClick={() => router.push(`/master/app-templates/${template.id}`)}
                          className="text-sm font-medium text-gray-900 hover:text-primary text-left"
                        >
                          {template.name}
                        </button>
                        <div className="text-sm text-gray-500 line-clamp-1">{template.description || 'No description'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {template.category ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {template.category}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{template.screen_count || 0} screens</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      template.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(template.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handlePreview(template)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Preview Template"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/master/app-templates/${template.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Screens"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDuplicateModal(template)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Duplicate Template"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(template)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                        title="Edit Template"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id, template.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete Template"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No templates found' : 'No templates yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? 'Try adjusting your search query' 
                : 'Create your first app template to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Template
              </button>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="E-Commerce App"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Complete e-commerce solution with product catalog, cart, and checkout"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="E-Commerce"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (Lucide icon name)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="ShoppingCart"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active (visible to users)
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
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Duplicate Template Modal */}
      {showDuplicateModal && duplicatingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Duplicate Template</h2>
              <p className="text-sm text-gray-600 mt-1">
                Create a copy of "{duplicatingTemplate.name}"
              </p>
            </div>

            <form onSubmit={handleDuplicate} className="p-6 space-y-4">
              {/* Original Template Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">{duplicatingTemplate.name}</p>
                    <p className="text-xs text-blue-700">
                      {duplicatingTemplate.screen_count || 0} screens • {duplicatingTemplate.category || 'No category'}
                    </p>
                  </div>
                </div>
              </div>

              {/* New Template Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={duplicateName}
                  onChange={(e) => setDuplicateName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter name for the copy"
                  required
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  All screens and modules will be copied to the new template
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseDuplicateModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Template Modal */}
      {showPreviewModal && previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{previewTemplate.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">{previewTemplate.description || 'No description'}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {previewTemplate.category && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {previewTemplate.category}
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        previewTemplate.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {previewTemplate.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleClosePreview}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{previewScreens.length}</div>
                <div className="text-sm text-gray-600 mt-1">Total Screens</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {previewScreens.reduce((sum, screen) => sum + (screen.elements?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Modules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {new Set(previewScreens.map(s => s.screen_category).filter(Boolean)).size}
                </div>
                <div className="text-sm text-gray-600 mt-1">Categories</div>
              </div>
            </div>

            {/* Screens List */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Screens & Modules</h3>
              
              {previewScreens.length > 0 ? (
                <div className="space-y-3">
                  {previewScreens.map((screen, index) => (
                    <div key={screen.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Screen Header */}
                      <button
                        onClick={() => toggleScreenExpand(screen.id)}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm font-bold text-blue-600">
                            {index + 1}
                          </div>
                          <Monitor className="w-5 h-5 text-gray-600" />
                          <div className="text-left">
                            <div className="font-medium text-gray-900">{screen.screen_name}</div>
                            <div className="text-xs text-gray-500">
                              {screen.elements?.length || 0} modules
                              {screen.screen_category && ` • ${screen.screen_category}`}
                              {screen.is_home_screen && ' • Home Screen'}
                            </div>
                          </div>
                        </div>
                        {expandedScreens.has(screen.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      {/* Screen Modules (Expanded) */}
                      {expandedScreens.has(screen.id) && (
                        <div className="p-4 bg-white">
                          {screen.elements && screen.elements.length > 0 ? (
                            <div className="space-y-2">
                              {screen.elements.map((element: any, idx: number) => (
                                <div key={element.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center text-xs font-bold text-purple-600">
                                    {idx + 1}
                                  </div>
                                  <Layers className="w-4 h-4 text-purple-600" />
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">
                                      {element.label || element.element_name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {element.element_type}
                                      {element.field_key && ` • ${element.field_key}`}
                                      {element.is_required && ' • Required'}
                                    </div>
                                  </div>
                                  {element.element_category && (
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                      {element.element_category}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500 text-sm">
                              No modules configured
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No screens in this template</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={handleClosePreview}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleClosePreview();
                    router.push(`/master/app-templates/${previewTemplate.id}`);
                  }}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View & Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
