'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, permissionsAPI, usersAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { Plus, Edit, Trash2, Shield, Settings2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface AppUser {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  role_name: string;
  role_level: number;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_publish: boolean;
  can_manage_admins: boolean;
  can_manage_users: boolean;
  can_manage_settings: boolean;
  custom_permissions: any;
}

interface Role {
  id: number;
  name: string;
  level: number;
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
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number>(0);
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

      // Fetch roles (exclude Master Admin - level 1)
      try {
        const rolesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/roles`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        const rolesData = await rolesResponse.json();
        if (rolesData.success) {
          // Filter out Master Admin role
          const filteredRoles = rolesData.data.filter((r: Role) => r.level !== 1);
          setRoles(filteredRoles);
        }
      } catch (rolesError) {
        console.error('Error fetching roles:', rolesError);
      }

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

  const openRoleModal = (appUser: AppUser) => {
    setSelectedUser(appUser);
    setSelectedRoleId(appUser.role_id || 0);
    setIsRoleModalOpen(true);
  };

  // Admin screen permissions template (based on user 2's settings)
  const adminScreenPermissions: Record<string, any> = {
    "18": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "96": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
    "97": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "98": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
    "99": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
    "100": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
    "101": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "102": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "103": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "104": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: false },
    "105": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
    "106": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
    "107": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
    "108": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
    "109": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
    "110": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
    "111": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
    "112": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
    "113": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: true },
    "114": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
    "115": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "116": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
    "117": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "127": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
    "128": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "129": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
    "130": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
    "131": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
    "132": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
    "133": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
    "134": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
    "135": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
    "137": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
  };

  // Admin menu access template (based on user 2's settings)
  const adminMenuAccess = {
    property_listings: true,
    bookings: true,
    contact_submissions: true,
    menus: true,
  };

  // Editor screen permissions template (based on user 3's settings)
  const editorScreenPermissions: Record<string, any> = {
    "18": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "96": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "97": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "98": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "99": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "100": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "101": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "102": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "103": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "104": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "105": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "106": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "107": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "108": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "109": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "110": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "111": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
    "112": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "113": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "114": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "115": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "116": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "117": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "127": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "128": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "129": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "130": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "131": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "132": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "133": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "134": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "135": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
    "137": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
  };

  // Editor menu access template
  const editorMenuAccess = {
    property_listings: false,
    bookings: false,
    contact_submissions: false,
    menus: false,
  };

  // Permission presets for each role
  const getRolePermissionPreset = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    const roleLevel = role?.level || 3;
    
    if (roleLevel === 2) {
      // Admin - use admin template
      return {
        can_view: true,
        can_edit: true,
        can_delete: true,
        can_publish: true,
        can_manage_admins: true,
        can_manage_users: true,
        can_manage_settings: true,
        custom_permissions: {
          menu_access: adminMenuAccess,
          screens: adminScreenPermissions
        }
      };
    } else {
      // Editor (level 3) - use editor template
      return {
        can_view: true,
        can_edit: true,
        can_delete: true,
        can_publish: true,
        can_manage_admins: false,
        can_manage_users: false,
        can_manage_settings: false,
        custom_permissions: {
          menu_access: editorMenuAccess,
          screens: editorScreenPermissions
        }
      };
    }
  };

  const handleRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedRoleId) return;

    setSubmitting(true);
    try {
      // Get permission preset for the new role (includes role_id for per-app role)
      const preset = getRolePermissionPreset(selectedRoleId);
      
      // Add role_id to the preset for per-app role storage
      const presetWithRole = {
        ...preset,
        role_id: selectedRoleId,
      };
      
      // Update permissions with the preset (this updates the per-app role, not the global user role)
      await permissionsAPI.updatePermissions(
        selectedUser.user_id,
        parseInt(params.id as string),
        presetWithRole
      );
      
      setIsRoleModalOpen(false);
      setSelectedUser(null);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to change role');
    } finally {
      setSubmitting(false);
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Administrators</h1>
            <p className="text-gray-600 mt-2">
              Manage administrator permissions for {app.name}
            </p>
          </div>
          <div className="flex gap-3">
            {/* Master Admin only: Permissions Overview */}
            {user?.role_level === 1 && (
              <Button 
                variant="secondary"
                onClick={() => router.push(`/app/${params.id}/admin-permissions`)}
              >
                <Shield className="w-5 h-5 mr-2" />
                Permissions Overview
              </Button>
            )}
            <Button onClick={() => router.push('/master/users')}>
              <Plus className="w-5 h-5 mr-2" />
              Add User
            </Button>
          </div>
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
                      {appUser.role_level === 1 ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {appUser.role_name}
                        </span>
                      ) : (
                        <button
                          onClick={() => openRoleModal(appUser)}
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-blue-400 transition-all ${
                            appUser.role_level === 2
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                          title="Click to change role"
                        >
                          {appUser.role_name}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {!!appUser.can_edit && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Edit</span>
                        )}
                        {!!appUser.can_publish && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">Publish</span>
                        )}
                        {!!appUser.can_manage_users && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Users</span>
                        )}
                        {!!appUser.can_manage_settings && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Settings</span>
                        )}
                        {!appUser.can_edit && !appUser.can_publish && !appUser.can_manage_users && !appUser.can_manage_settings && (
                          <span className="text-xs text-gray-400 italic">No permissions</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* Master Admin only: Advanced Permissions */}
                      {user?.role_level === 1 && (
                        <button
                          onClick={() => router.push(`/app/${params.id}/users/${appUser.user_id}/permissions`)}
                          className="text-purple-600 hover:text-purple-900 mr-4"
                          title="Manage Detailed Permissions"
                        >
                          <Settings2 className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(appUser)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Quick Edit Permissions"
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
                { key: 'can_edit', label: 'Edit Screens' },
                { key: 'can_publish', label: 'Publish Screens' },
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

        {/* Change Role Modal */}
        <Modal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          title="Change User Role"
          size="sm"
        >
          <form onSubmit={handleRoleChange} className="space-y-4">
            <p className="text-sm text-gray-600">
              Change role for <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>
            </p>

            <div className="space-y-2">
              {roles.length === 0 ? (
                <p className="text-sm text-gray-500">Loading roles...</p>
              ) : (
                roles.map((role) => (
                  <label
                    key={role.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedRoleId === role.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.id}
                      checked={selectedRoleId === role.id}
                      onChange={() => setSelectedRoleId(role.id)}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-900">{role.name}</span>
                    </div>
                  </label>
                ))
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsRoleModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !selectedRoleId}>
                {submitting ? 'Saving...' : 'Change Role'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
