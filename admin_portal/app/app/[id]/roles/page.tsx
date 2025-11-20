'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, rolesAPI, appScreensAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { Shield, Users, Plus, Edit, Trash2, X, Save, Monitor } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string;
  is_default: number;
  user_count: number;
}

interface Screen {
  id: number;
  name: string;
  screen_key: string;
  description: string;
  icon: string;
  is_published: boolean;
  can_access: boolean | null;
}

export default function RolesPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();
  
  const [app, setApp] = useState<any>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleScreens, setRoleScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScreensModalOpen, setIsScreensModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    is_default: false
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

    fetchData();
  }, [isAuthenticated, user, appId, router]);

  const fetchData = async () => {
    try {
      const appResponse = await appsAPI.getById(parseInt(appId));
      setApp(appResponse.data);

      const rolesResponse = await rolesAPI.getAppRoles(parseInt(appId));
      setRoles(rolesResponse.data || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleRoleClick = async (role: Role) => {
    setSelectedRole(role);
    try {
      const screensResponse = await rolesAPI.getRoleScreens(parseInt(appId), role.id);
      setRoleScreens(screensResponse.data || []);
    } catch (error) {
      console.error('Error fetching role screens:', error);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.display_name) {
      alert('Name and display name are required');
      return;
    }
    
    setSubmitting(true);
    try {
      await rolesAPI.createRole(parseInt(appId), formData);
      setIsCreateModalOpen(false);
      setFormData({ name: '', display_name: '', description: '', is_default: false });
      fetchData();
      alert('Role created successfully');
    } catch (error: any) {
      console.error('Error creating role:', error);
      alert(error.response?.data?.message || 'Failed to create role');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      display_name: role.display_name,
      description: role.description || '',
      is_default: role.is_default === 1
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setSubmitting(true);
    try {
      await rolesAPI.updateRole(parseInt(appId), selectedRole.id, formData);
      setIsEditModalOpen(false);
      setSelectedRole(null);
      fetchData();
      alert('Role updated successfully');
    } catch (error: any) {
      console.error('Error updating role:', error);
      alert(error.response?.data?.message || 'Failed to update role');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (!confirm(`Are you sure you want to delete the role "${role.display_name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await rolesAPI.deleteRole(parseInt(appId), role.id);
      if (selectedRole?.id === role.id) {
        setSelectedRole(null);
      }
      fetchData();
      alert('Role deleted successfully');
    } catch (error: any) {
      console.error('Error deleting role:', error);
      alert(error.response?.data?.message || 'Failed to delete role');
    }
  };

  const handleManageScreens = async (role: Role) => {
    setSelectedRole(role);
    try {
      const screensResponse = await rolesAPI.getRoleScreens(parseInt(appId), role.id);
      setRoleScreens(screensResponse.data || []);
      setIsScreensModalOpen(true);
    } catch (error) {
      console.error('Error fetching role screens:', error);
      alert('Failed to load screens');
    }
  };

  const handleToggleScreenAccess = async (screen: Screen) => {
    if (!selectedRole) return;
    
    try {
      const newAccess = !screen.can_access;
      
      if (newAccess) {
        await rolesAPI.assignScreenToRole(parseInt(appId), selectedRole.id, screen.id, true);
      } else {
        await rolesAPI.removeScreenFromRole(parseInt(appId), selectedRole.id, screen.id);
      }
      
      // Refresh screens
      const screensResponse = await rolesAPI.getRoleScreens(parseInt(appId), selectedRole.id);
      setRoleScreens(screensResponse.data || []);
    } catch (error: any) {
      console.error('Error toggling screen access:', error);
      alert(error.response?.data?.message || 'Failed to update screen access');
    }
  };

  if (loading) {
    return (
      <AppLayout appId={appId} appName={app?.name || 'Loading...'}>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout appId={appId} appName={app?.name || 'App'}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mobile User Roles</h1>
            <p className="text-gray-600 mt-2">
              Manage roles and screen access for mobile app users in {app?.name}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Note: These roles apply to mobile app users from the <a href={`/app/${appId}/app-users`} className="underline font-medium">App Users</a> page, not administrators.
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Create Role
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Roles List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Roles ({roles.length})
              </h2>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {roles.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  No roles found. Create your first role to get started.
                </div>
              ) : (
                roles.map((role) => (
                  <div
                    key={role.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      selectedRole?.id === role.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 cursor-pointer" onClick={() => handleRoleClick(role)}>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{role.display_name}</h3>
                          {role.is_default === 1 && (
                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        {role.description && (
                          <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {role.user_count} users
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleManageScreens(role)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Manage screens"
                        >
                          <Monitor className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(role)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit role"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Role Details / Screens */}
          <div className="bg-white rounded-lg shadow">
            {selectedRole ? (
              <>
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedRole.display_name} - Screen Access
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {roleScreens.filter(s => s.can_access).length} of {roleScreens.length} screens accessible
                  </p>
                </div>
                <div className="p-6 max-h-[600px] overflow-y-auto">
                  {roleScreens.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No screens available for this app</p>
                  ) : (
                    <div className="space-y-2">
                      {roleScreens.map((screen) => (
                        <div
                          key={screen.id}
                          className={`flex items-center justify-between p-4 border rounded-lg ${
                            screen.can_access ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{screen.name}</p>
                            {screen.description && (
                              <p className="text-xs text-gray-600 mt-0.5">{screen.description}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {screen.is_published ? '✓ Published' : '○ Draft'}
                            </p>
                          </div>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!screen.can_access}
                              onChange={() => handleToggleScreenAccess(screen)}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {screen.can_access ? 'Accessible' : 'Blocked'}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a role to view screen access settings</p>
              </div>
            )}
          </div>
        </div>

        {/* Create Role Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Create New Role</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateRole} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name (slug) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., premium_member"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lowercase, underscores only</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Premium Member"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Describe this role..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                    Default role (auto-assign to new users)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Creating...' : 'Create Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {isEditModalOpen && selectedRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Edit Role</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateRole} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name (slug) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit_is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="edit_is_default" className="ml-2 text-sm text-gray-700">
                    Default role (auto-assign to new users)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
