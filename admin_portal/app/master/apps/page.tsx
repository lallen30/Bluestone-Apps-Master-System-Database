'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, appTemplatesAPI, appScreensAPI } from '@/lib/api';
import { Plus, Edit, Trash2, Globe, ArrowLeft, Search, Monitor, Sparkles, Copy } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface App {
  id: number;
  name: string;
  domain: string;
  description?: string;
  is_active: boolean;
  user_count?: number;
}

export default function AppsManagement() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const [apps, setApps] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [templateAppName, setTemplateAppName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    description: '',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [sortField, setSortField] = useState<'name' | 'domain' | 'status'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    // Check localStorage for token
    const token = localStorage.getItem('auth_token');
    
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Wait for store to hydrate before checking user
    if (token && !isHydrated) {
      return;
    }

    // After hydration, check if user is master admin
    if (isHydrated && user?.role_level !== 1) {
      router.push('/login');
      return;
    }

    // Only fetch apps if we have a valid user
    if (user) {
      fetchApps();
    }
  }, [isAuthenticated, user, isHydrated, router]);

  useEffect(() => {
    // Filter apps based on search query
    let filtered = apps.filter((app) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        app.name.toLowerCase().includes(searchLower) ||
        app.domain.toLowerCase().includes(searchLower) ||
        app.description?.toLowerCase().includes(searchLower)
      );
    });

    // Sort filtered apps
    filtered = filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'domain':
          aValue = a.domain.toLowerCase();
          bValue = b.domain.toLowerCase();
          break;
        case 'status':
          aValue = a.is_active ? 1 : 0;
          bValue = b.is_active ? 1 : 0;
          break;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredApps(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, apps, sortField, sortDirection]);

  const fetchApps = async () => {
    try {
      const response = await appsAPI.getAll();
      setApps(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching apps:', error);
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await appTemplatesAPI.getAll();
      setTemplates(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate || !templateAppName || !user) return;

    setSubmitting(true);
    try {
      const response = await appTemplatesAPI.createFromTemplate({
        template_id: selectedTemplate.id,
        app_name: templateAppName,
        created_by: user.id
      });

      if (response.success) {
        setIsTemplateModalOpen(false);
        setSelectedTemplate(null);
        setTemplateAppName('');
        fetchApps();
        // Navigate to the new app
        router.push(`/app/${response.data.app_id}`);
      }
    } catch (error) {
      console.error('Error creating app from template:', error);
      alert('Failed to create app from template. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const openTemplateModal = () => {
    fetchTemplates();
    setIsTemplateModalOpen(true);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentApps = filteredApps.slice(startIndex, endIndex);

  const handleSort = (field: 'name' | 'domain' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.domain.trim()) errors.domain = 'Domain is required';
    if (formData.domain && !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(formData.domain)) {
      errors.domain = 'Invalid domain format (e.g., example.com)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await appsAPI.create(formData);
      setIsCreateModalOpen(false);
      resetForm();
      fetchApps();
    } catch (error: any) {
      setFormErrors({ submit: error.response?.data?.message || 'Failed to create app' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedApp) return;

    setSubmitting(true);
    try {
      await appsAPI.update(selectedApp.id, formData);
      setIsEditModalOpen(false);
      resetForm();
      fetchApps();
    } catch (error: any) {
      setFormErrors({ submit: error.response?.data?.message || 'Failed to update app' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedApp) return;

    setSubmitting(true);
    try {
      await appsAPI.delete(selectedApp.id);
      setIsDeleteModalOpen(false);
      setSelectedApp(null);
      fetchApps();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete app');
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (app: App) => {
    setSelectedApp(app);
    setFormData({
      name: app.name,
      domain: app.domain,
      description: app.description || '',
      is_active: app.is_active,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (app: App) => {
    setSelectedApp(app);
    setIsDeleteModalOpen(true);
  };

  const openCopyModal = (app: App) => {
    setSelectedApp(app);
    setFormData({
      name: `${app.name} (Copy)`,
      domain: '',
      description: app.description || '',
      is_active: app.is_active,
    });
    setIsCopyModalOpen(true);
  };

  const handleCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedApp) return;

    setSubmitting(true);
    try {
      // Create the new app
      const createResponse = await appsAPI.create(formData);
      
      if (createResponse.success && createResponse.data?.id) {
        const newAppId = createResponse.data.id;
        
        // Get screens from the original app
        const screensResponse = await appScreensAPI.getAppScreens(selectedApp.id);
        
        console.log('Screens to copy:', screensResponse.data);
        
        if (screensResponse.success && Array.isArray(screensResponse.data)) {
          // Copy each screen to the new app
          for (const screen of screensResponse.data) {
            try {
              await appScreensAPI.assignToApp({
                app_id: newAppId,
                screen_id: screen.id, // Use 'id' not 'screen_id'
                display_order: screen.assigned_order || screen.display_order || 0
              });
              console.log(`Copied screen ${screen.id} (${screen.name}) to app ${newAppId}`);
            } catch (error) {
              console.error(`Error copying screen ${screen.id}:`, error);
            }
          }
        }
        
        setIsCopyModalOpen(false);
        resetForm();
        fetchApps();
        
        // Navigate to the new app
        router.push(`/app/${newAppId}`);
      }
    } catch (error: any) {
      console.error('Copy app error:', error);
      setFormErrors({ submit: error.response?.data?.message || 'Failed to copy app' });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      domain: '',
      description: '',
      is_active: true,
    });
    setFormErrors({});
    setSelectedApp(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading apps...</p>
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
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">App Management</h1>
                  <p className="text-sm text-gray-500">Manage all applications</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={openTemplateModal}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Sparkles className="w-4 h-4" />
                App Templates
              </button>
              <Button onClick={openCreateModal}>
                <Plus className="w-5 h-5 mr-2" />
                Create App
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search apps by name, domain, or description..."
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredApps.length)} of {filteredApps.length} apps
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortField === 'name' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortField === 'status' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentApps.map((app) => (
                  <tr 
                    key={app.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/app/${app.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{app.name}</div>
                      <div className="text-sm text-gray-500">{app.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          app.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {app.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.user_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/master/apps/${app.id}/screens`);
                        }}
                        className="text-purple-600 hover:text-purple-900 mr-4"
                        title="Manage Screens"
                      >
                        <Monitor className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCopyModal(app);
                        }}
                        className="text-green-600 hover:text-green-900 mr-4"
                        title="Copy App"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(app);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(app);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New App"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              App Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="My Application"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain *
            </label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="myapp.example.com"
            />
            {formErrors.domain && (
              <p className="mt-1 text-sm text-red-600">{formErrors.domain}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Brief description of the application"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>

          {formErrors.submit && (
            <p className="text-sm text-red-600">{formErrors.submit}</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create App'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit App"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              App Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain *
            </label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {formErrors.domain && (
              <p className="mt-1 text-sm text-red-600">{formErrors.domain}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="edit_is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="edit_is_active" className="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>

          {formErrors.submit && (
            <p className="text-sm text-red-600">{formErrors.submit}</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Copy App Modal */}
      <Modal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        title="Copy App"
      >
        <form onSubmit={handleCopy} className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Copying:</strong> {selectedApp?.name}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              All screens and their configurations will be copied to the new app.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New App Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="My Application (Copy)"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain *
            </label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="newapp.example.com"
            />
            {formErrors.domain && (
              <p className="mt-1 text-sm text-red-600">{formErrors.domain}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Brief description of the application"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="copy_is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="copy_is_active" className="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>

          {formErrors.submit && (
            <p className="text-sm text-red-600">{formErrors.submit}</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCopyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Copying...' : 'Copy App'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete App"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>{selectedApp?.name}</strong>? This action
            cannot be undone and will remove all associated data.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? 'Deleting...' : 'Delete App'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* App Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create App from Template</h2>
              <p className="text-gray-600 mt-1">
                Choose a template to get started quickly with pre-configured screens and modules
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* App Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App Name *
                </label>
                <input
                  type="text"
                  value={templateAppName}
                  onChange={(e) => setTemplateAppName(e.target.value)}
                  placeholder="Enter app name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Template *
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Template
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Screens
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {templates.map((template) => (
                        <tr
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          className={`cursor-pointer transition-colors ${
                            selectedTemplate?.id === template.id
                              ? 'bg-purple-50'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                selectedTemplate?.id === template.id
                                  ? 'bg-purple-600'
                                  : 'bg-purple-100'
                              }`}>
                                <Sparkles className={`w-4 h-4 ${
                                  selectedTemplate?.id === template.id
                                    ? 'text-white'
                                    : 'text-purple-600'
                                }`} />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{template.name}</div>
                                <div className="text-sm text-gray-600">{template.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                              {template.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {template.screen_count} screens
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selected Template Info */}
              {selectedTemplate && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Selected: {selectedTemplate.name}</h3>
                  <p className="text-sm text-purple-700 mb-2">{selectedTemplate.description}</p>
                  <p className="text-xs text-purple-600">
                    This template includes {selectedTemplate.screen_count} pre-configured screens with modules
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsTemplateModalOpen(false);
                  setSelectedTemplate(null);
                  setTemplateAppName('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFromTemplate}
                disabled={!selectedTemplate || !templateAppName || submitting}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating...' : 'Create App'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
