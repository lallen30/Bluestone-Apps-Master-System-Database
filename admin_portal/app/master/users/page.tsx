'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { usersAPI, appsAPI, permissionsAPI } from '@/lib/api';
import { Plus, Edit, Trash2, Users as UsersIcon, ArrowLeft, Shield } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  role_name: string;
  role_level: number;
  is_active: boolean;
}

interface App {
  id: number;
  name: string;
  domain: string;
}

interface Permission {
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_publish: boolean;
  can_manage_users: boolean;
  can_manage_settings: boolean;
}

export default function UsersManagement() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedApps, setSelectedApps] = useState<number[]>([]);
  const [permissions, setPermissions] = useState<Record<number, Permission>>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role_id: 3,
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  const roles = [
    { id: 1, name: 'Master Admin', level: 1 },
    { id: 2, name: 'Admin', level: 2 },
    { id: 3, name: 'Editor', level: 3 },
  ];

  useEffect(() => {
    if (!isAuthenticated || user?.role_level !== 1) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [isAuthenticated, user, router]);

  const fetchData = async () => {
    try {
      const [usersResponse, appsResponse] = await Promise.all([
        usersAPI.getAll(),
        appsAPI.getAll(),
      ]);
      setUsers(usersResponse.data || []);
      setApps(appsResponse.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!isEditModalOpen && !formData.password) errors.password = 'Password is required';
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await usersAPI.create(formData);
      setIsCreateModalOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      setFormErrors({ submit: error.response?.data?.message || 'Failed to create user' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedUser) return;

    setSubmitting(true);
    try {
      const updateData: any = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role_id: formData.role_id,
        is_active: formData.is_active,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      await usersAPI.update(selectedUser.id, updateData);
      setIsEditModalOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      setFormErrors({ submit: error.response?.data?.message || 'Failed to update user' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      await usersAPI.delete(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setSubmitting(false);
    }
  };

  const openPermissionsModal = async (user: User) => {
    setSelectedUser(user);
    setSubmitting(true);
    try {
      const response = await permissionsAPI.getUserPermissions(user.id);
      const userPerms = response.data || [];
      
      // Set selected apps
      const appIds = userPerms.map((p: any) => p.app_id);
      setSelectedApps(appIds);
      
      // Set permissions for each app
      const permsMap: Record<number, Permission> = {};
      userPerms.forEach((p: any) => {
        permsMap[p.app_id] = {
          can_view: p.can_view,
          can_edit: p.can_edit,
          can_delete: p.can_delete,
          can_publish: p.can_publish,
          can_manage_users: p.can_manage_users,
          can_manage_settings: p.can_manage_settings,
        };
      });
      setPermissions(permsMap);
      setIsPermissionsModalOpen(true);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      // Save permissions for each selected app
      for (const appId of selectedApps) {
        const perm = permissions[appId] || {
          can_view: true,
          can_edit: false,
          can_delete: false,
          can_publish: false,
          can_manage_users: false,
          can_manage_settings: false,
        };
        
        await permissionsAPI.assign({
          user_id: selectedUser.id,
          app_id: appId,
          ...perm,
        });
      }
      
      // Remove permissions for unselected apps
      const response = await permissionsAPI.getUserPermissions(selectedUser.id);
      const currentPerms = response.data || [];
      for (const perm of currentPerms) {
        if (!selectedApps.includes(perm.app_id)) {
          await permissionsAPI.revoke(selectedUser.id, perm.app_id);
        }
      }
      
      setIsPermissionsModalOpen(false);
      resetPermissions();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save permissions');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleApp = (appId: number) => {
    if (selectedApps.includes(appId)) {
      setSelectedApps(selectedApps.filter(id => id !== appId));
    } else {
      setSelectedApps([...selectedApps, appId]);
      // Initialize default permissions for new app
      if (!permissions[appId]) {
        // If user is Admin (role_level 2), check all permissions by default
        // If user is Editor (role_level 3), check View and Edit by default
        const isAdmin = selectedUser?.role_level === 2;
        const isEditor = selectedUser?.role_level === 3;
        setPermissions({
          ...permissions,
          [appId]: {
            can_view: true,
            can_edit: isAdmin || isEditor,
            can_delete: isAdmin,
            can_publish: isAdmin,
            can_manage_users: isAdmin,
            can_manage_settings: isAdmin,
          },
        });
      }
    }
  };

  const updatePermission = (appId: number, key: keyof Permission, value: boolean) => {
    setPermissions({
      ...permissions,
      [appId]: {
        ...(permissions[appId] || {}),
        [key]: value,
      } as Permission,
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: '',
      first_name: user.first_name,
      last_name: user.last_name,
      role_id: user.role_id,
      is_active: user.is_active,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role_id: 3,
      is_active: true,
    });
    setFormErrors({});
    setSelectedUser(null);
  };

  const resetPermissions = () => {
    setSelectedApps([]);
    setPermissions({});
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading users...</p>
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
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                  <p className="text-sm text-gray-500">Manage users and permissions</p>
                </div>
              </div>
            </div>
            <Button onClick={openCreateModal}>
              <Plus className="w-5 h-5 mr-2" />
              Create User
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
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
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {u.first_name} {u.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.role_level === 1
                            ? 'bg-purple-100 text-purple-800'
                            : u.role_level === 2
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {u.role_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openPermissionsModal(u)}
                        className="text-purple-600 hover:text-purple-900 mr-4"
                        title="Manage Permissions"
                      >
                        <Shield className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openEditModal(u)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Edit User"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(u)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                        disabled={u.id === user?.id}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formErrors.first_name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formErrors.last_name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.last_name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              value={formData.role_id}
              onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
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
              {submitting ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formErrors.first_name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formErrors.last_name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.last_name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              value={formData.role_id}
              onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>? 
            This action cannot be undone and will remove all associated permissions.
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
              {submitting ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Permissions Modal */}
      <Modal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        title={`Manage Permissions - ${selectedUser?.first_name} ${selectedUser?.last_name}`}
        size="xl"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Select which apps this user can access and configure their permissions for each app.
          </p>

          <div className="space-y-4">
            {apps.map((app) => (
              <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id={`app-${app.id}`}
                    checked={selectedApps.includes(app.id)}
                    onChange={() => toggleApp(app.id)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor={`app-${app.id}`} className="ml-2 text-sm font-medium text-gray-900">
                    {app.name}
                  </label>
                  <span className="ml-2 text-xs text-gray-500">({app.domain})</span>
                </div>

                {selectedApps.includes(app.id) && (
                  <div className="ml-6 grid grid-cols-2 gap-3">
                    {[
                      { key: 'can_view', label: 'View' },
                      { key: 'can_edit', label: 'Edit' },
                      { key: 'can_delete', label: 'Delete' },
                      { key: 'can_publish', label: 'Publish' },
                      { key: 'can_manage_users', label: 'Manage Users' },
                      { key: 'can_manage_settings', label: 'Manage Settings' },
                    ].map((perm) => (
                      <div key={perm.key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`${app.id}-${perm.key}`}
                          checked={permissions[app.id]?.[perm.key as keyof Permission] || false}
                          onChange={(e) =>
                            updatePermission(app.id, perm.key as keyof Permission, e.target.checked)
                          }
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label
                          htmlFor={`${app.id}-${perm.key}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {perm.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPermissionsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSavePermissions}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Permissions'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
