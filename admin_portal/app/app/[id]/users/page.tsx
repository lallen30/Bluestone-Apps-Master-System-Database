'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, permissionsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface AppUser {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_name: string;
  role_level: number;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_publish: boolean;
  can_manage_users: boolean;
  can_manage_settings: boolean;
}

export default function AppUsers() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [app, setApp] = useState<any>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [permissions, setPermissions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [formData, setFormData] = useState({
    can_view: true,
    can_edit: false,
    can_delete: false,
    can_publish: false,
    can_manage_users: false,
    can_manage_settings: false,
  });
  const [submitting, setSubmitting] = useState(false);

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
  }, [isAuthenticated, user, params.id, router]);

  const fetchData = async () => {
    try {
      const appId = parseInt(params.id as string);
      
      // Fetch app details
      const appResponse = await appsAPI.getById(appId);
      setApp(appResponse.data);

      // Check user permissions
      if (user?.id) {
        // Master Admins have full access to all apps
        if (user.role_level === 1) {
          setPermissions({
            can_view: true,
            can_edit: true,
            can_delete: true,
            can_publish: true,
            can_manage_users: true,
            can_manage_settings: true,
          });
        } else {
          const permsResponse = await permissionsAPI.getUserPermissions(user.id);
          const userPerms = permsResponse.data?.find((p: any) => p.app_id === appId);
          
          if (!userPerms || !userPerms.can_manage_users) {
            router.push(`/app/${appId}`);
            return;
          }
          
          setPermissions(userPerms);
        }
      }

      // Fetch app users
      const usersResponse = await permissionsAPI.getAppUsers(appId);
      setUsers(usersResponse.data || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const openEditModal = (appUser: AppUser) => {
    setSelectedUser(appUser);
    setFormData({
      can_view: appUser.can_view,
      can_edit: appUser.can_edit,
      can_delete: appUser.can_delete,
      can_publish: appUser.can_publish,
      can_manage_users: appUser.can_manage_users,
      can_manage_settings: appUser.can_manage_settings,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (appUser: AppUser) => {
    setSelectedUser(appUser);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      await permissionsAPI.updatePermissions(
        selectedUser.user_id,
        parseInt(params.id as string),
        formData
      );
      setIsEditModalOpen(false);
      setSelectedUser(null);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update permissions');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      await permissionsAPI.revoke(
        selectedUser.user_id,
        parseInt(params.id as string)
      );
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to remove user');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout appId={params.id as string} appName={app?.name || 'Loading...'}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!app) {
    return null;
  }

  return (
    <AppLayout appId={params.id as string} appName={app.name}>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-2">
              Manage user permissions for {app.name}
            </p>
          </div>
          <Button onClick={() => router.push('/master/users')}>
            <Plus className="w-5 h-5 mr-2" />
            Add User
          </Button>
        </div>

        {/* Users Table */}
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
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((appUser) => (
                  <tr key={appUser.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appUser.first_name} {appUser.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appUser.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appUser.role_level === 1
                            ? 'bg-purple-100 text-purple-800'
                            : appUser.role_level === 2
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {appUser.role_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {appUser.can_view && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">View</span>
                        )}
                        {appUser.can_edit && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Edit</span>
                        )}
                        {appUser.can_delete && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Delete</span>
                        )}
                        {appUser.can_manage_users && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Users</span>
                        )}
                        {appUser.can_manage_settings && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Settings</span>
                        )}
                        {!appUser.can_view && !appUser.can_edit && !appUser.can_delete && !appUser.can_manage_users && !appUser.can_manage_settings && (
                          <span className="text-xs text-gray-400 italic">No permissions</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(appUser)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Edit Permissions"
                      >
                        <Shield className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(appUser)}
                        className="text-red-600 hover:text-red-900"
                        title="Remove User"
                        disabled={appUser.user_id === user?.id}
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

        {/* Edit Permissions Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit User Permissions"
        >
          <form onSubmit={handleEdit} className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Editing permissions for <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>
            </p>

            <div className="space-y-3">
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
                    id={perm.key}
                    checked={formData[perm.key as keyof typeof formData]}
                    onChange={(e) =>
                      setFormData({ ...formData, [perm.key]: e.target.checked })
                    }
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor={perm.key} className="ml-2 text-sm text-gray-700">
                    {perm.label}
                  </label>
                </div>
              ))}
            </div>

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
          title="Remove User"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to remove <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong> from this app?
              They will lose all access to {app.name}.
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
                {submitting ? 'Removing...' : 'Remove User'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
