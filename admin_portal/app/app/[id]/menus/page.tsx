'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Menu as MenuIcon, Smartphone, SidebarIcon, Users, Shield, Settings, Copy } from 'lucide-react';
import { menuAPI, appsAPI, rolesAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';

interface Role {
  id: number;
  name: string;
  description: string | null;
}

interface Menu {
  id: number;
  app_id: number;
  name: string;
  menu_type: 'tabbar' | 'sidebar_left' | 'sidebar_right';
  icon: string;
  description: string | null;
  is_active: boolean;
  item_count: number;
  created_at: string;
  updated_at: string;
  roles?: { id: number; name: string }[];
}

export default function MenusPage() {
  const params = useParams();
  const router = useRouter();
  const appId = parseInt(params.id as string);

  const [menus, setMenus] = useState<Menu[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [appName, setAppName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [duplicatingMenu, setDuplicatingMenu] = useState<Menu | null>(null);
  const [duplicateName, setDuplicateName] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [savingRoles, setSavingRoles] = useState(false);
  const [newMenu, setNewMenu] = useState({
    name: '',
    menu_type: 'tabbar' as 'tabbar' | 'sidebar_left' | 'sidebar_right',
    icon: 'menu',
    description: '',
  });
  const [editMenuData, setEditMenuData] = useState({
    name: '',
    icon: 'menu',
    description: '',
  });

  useEffect(() => {
    fetchAppDetails();
    fetchMenus();
    fetchRoles();
  }, [appId]);

  const fetchAppDetails = async () => {
    try {
      const response = await appsAPI.getById(appId);
      setAppName(response.data?.name || 'App');
    } catch (error) {
      console.error('Error fetching app details:', error);
    }
  };

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getAppMenusWithRoles(appId);
      setMenus(response.data || []);
    } catch (error) {
      console.error('Error fetching menus:', error);
      // Fallback to regular menus API if roles endpoint fails
      try {
        const fallbackResponse = await menuAPI.getAppMenus(appId);
        setMenus(fallbackResponse.data || []);
      } catch (fallbackError) {
        console.error('Error fetching menus (fallback):', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await rolesAPI.getAppRoles(appId);
      setRoles(response.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleCreateMenu = async () => {
    if (!newMenu.name || !newMenu.menu_type) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await menuAPI.createMenu(appId, newMenu);
      setShowCreateModal(false);
      setNewMenu({ name: '', menu_type: 'tabbar', icon: 'menu', description: '' });
      fetchMenus();
    } catch (error: any) {
      console.error('Error creating menu:', error);
      alert(error.response?.data?.message || 'Failed to create menu');
    }
  };

  const handleEditMenu = (menu: Menu) => {
    setEditingMenu(menu);
    setEditMenuData({
      name: menu.name,
      icon: menu.icon || 'menu',
      description: menu.description || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateMenu = async () => {
    if (!editMenuData.name || !editingMenu) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await menuAPI.updateMenu(editingMenu.id, editMenuData);
      setShowEditModal(false);
      setEditingMenu(null);
      setEditMenuData({ name: '', icon: 'menu', description: '' });
      fetchMenus();
    } catch (error: any) {
      console.error('Error updating menu:', error);
      alert(error.response?.data?.message || 'Failed to update menu');
    }
  };

  const handleDeleteMenu = async (menuId: number, menuName: string) => {
    if (!confirm(`Are you sure you want to delete "${menuName}"? This will remove all menu items and screen assignments.`)) {
      return;
    }

    try {
      await menuAPI.deleteMenu(menuId);
      fetchMenus();
    } catch (error: any) {
      console.error('Error deleting menu:', error);
      alert(error.response?.data?.message || 'Failed to delete menu');
    }
  };

  const handleManageRoles = (menu: Menu) => {
    setEditingMenu(menu);
    setSelectedRoleIds(menu.roles?.map(r => r.id) || []);
    setShowRolesModal(true);
  };

  const handleSaveRoles = async () => {
    if (!editingMenu) return;

    try {
      setSavingRoles(true);
      await menuAPI.updateMenuRoleAccess(editingMenu.id, selectedRoleIds, appId);
      setShowRolesModal(false);
      setEditingMenu(null);
      setSelectedRoleIds([]);
      fetchMenus();
    } catch (error: any) {
      console.error('Error saving menu roles:', error);
      alert(error.response?.data?.message || 'Failed to save menu roles');
    } finally {
      setSavingRoles(false);
    }
  };

  const toggleRole = (roleId: number) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleDuplicateMenu = (menu: Menu) => {
    setDuplicatingMenu(menu);
    setDuplicateName(`${menu.name} (Copy)`);
    setShowDuplicateModal(true);
  };

  const handleConfirmDuplicate = async () => {
    if (!duplicatingMenu || !duplicateName.trim()) {
      alert('Please enter a name for the duplicate menu');
      return;
    }

    try {
      await menuAPI.duplicateMenu(duplicatingMenu.id, duplicateName.trim());
      setShowDuplicateModal(false);
      setDuplicatingMenu(null);
      setDuplicateName('');
      fetchMenus();
    } catch (error: any) {
      console.error('Error duplicating menu:', error);
      alert(error.response?.data?.message || 'Failed to duplicate menu');
    }
  };

  const getMenuTypeIcon = (type: string) => {
    switch (type) {
      case 'tabbar':
        return <Smartphone className="w-5 h-5" />;
      case 'sidebar_left':
        return <SidebarIcon className="w-5 h-5" />;
      case 'sidebar_right':
        return <SidebarIcon className="w-5 h-5 transform scale-x-[-1]" />;
      default:
        return <MenuIcon className="w-5 h-5" />;
    }
  };

  const getMenuTypeLabel = (type: string) => {
    switch (type) {
      case 'tabbar':
        return 'Tab Bar';
      case 'sidebar_left':
        return 'Left Sidebar';
      case 'sidebar_right':
        return 'Right Sidebar';
      default:
        return type;
    }
  };

  const getMenuTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'tabbar':
        return 'bg-blue-100 text-blue-800';
      case 'sidebar_left':
        return 'bg-purple-100 text-purple-800';
      case 'sidebar_right':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AppLayout appId={appId.toString()} appName={appName}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading menus...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout appId={appId.toString()} appName={appName}>
      <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menus</h1>
          <p className="text-gray-600 mt-1">
            Create and manage tab bars and sidebar menus for your app
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Create Menu
        </button>
      </div>

      {/* Menus List */}
      {menus.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <MenuIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No menus yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first menu to organize navigation in your mobile app
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Create Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Menu Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getMenuTypeBadgeColor(menu.menu_type)}`}>
                    {getMenuTypeIcon(menu.menu_type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{menu.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getMenuTypeBadgeColor(menu.menu_type)}`}>
                      {getMenuTypeLabel(menu.menu_type)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {menu.description && (
                <p className="text-sm text-gray-600 mb-4">{menu.description}</p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                <span>{menu.item_count} items</span>
                <span className={menu.is_active ? 'text-green-600' : 'text-gray-400'}>
                  {menu.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Roles */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase">Visible to Roles</span>
                </div>
                {menu.roles && menu.roles.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {menu.roles.map(role => (
                      <span
                        key={role.id}
                        className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full"
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    All roles (no restrictions)
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/app/${appId}/menus/${menu.id}`)}
                  className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  title="Manage menu items"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleManageRoles(menu)}
                  className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                  title="Manage role access"
                >
                  <Users className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditMenu(menu)}
                  className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                  title="Edit menu name and description"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicateMenu(menu)}
                  className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  title="Duplicate menu"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMenu(menu.id, menu.name)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  title="Delete menu"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Menu Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Menu</h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menu Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newMenu.name}
                  onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                  placeholder="e.g., Main Navigation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Menu Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menu Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={newMenu.menu_type}
                  onChange={(e) => setNewMenu({ ...newMenu, menu_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="tabbar">Tab Bar (Bottom Navigation)</option>
                  <option value="sidebar_left">Left Sidebar</option>
                  <option value="sidebar_right">Right Sidebar</option>
                </select>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menu Icon
                </label>
                <select
                  value={newMenu.icon}
                  onChange={(e) => setNewMenu({ ...newMenu, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="menu">Menu (☰)</option>
                  <option value="menu-2">Menu Alt</option>
                  <option value="align-justify">Align Justify</option>
                  <option value="more-vertical">More Vertical (⋮)</option>
                  <option value="more-horizontal">More Horizontal (⋯)</option>
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                  <option value="settings">Settings</option>
                  <option value="filter">Filter</option>
                  <option value="search">Search</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Icon displayed in header bar for sidebar menus
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newMenu.description}
                  onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
                  placeholder="Optional description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewMenu({ name: '', menu_type: 'tabbar', icon: 'menu', description: '' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMenu}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Menu Modal */}
      {showEditModal && editingMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Menu</h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menu Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editMenuData.name}
                  onChange={(e) => setEditMenuData({ ...editMenuData, name: e.target.value })}
                  placeholder="e.g., Main Navigation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Menu Type (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menu Type
                </label>
                <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                  {getMenuTypeLabel(editingMenu.menu_type)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Menu type cannot be changed after creation
                </p>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menu Icon
                </label>
                <select
                  value={editMenuData.icon}
                  onChange={(e) => setEditMenuData({ ...editMenuData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="menu">Menu (☰)</option>
                  <option value="menu-2">Menu Alt</option>
                  <option value="align-justify">Align Justify</option>
                  <option value="more-vertical">More Vertical (⋮)</option>
                  <option value="more-horizontal">More Horizontal (⋯)</option>
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                  <option value="settings">Settings</option>
                  <option value="filter">Filter</option>
                  <option value="search">Search</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Icon displayed in header bar for sidebar menus
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editMenuData.description}
                  onChange={(e) => setEditMenuData({ ...editMenuData, description: e.target.value })}
                  placeholder="Optional description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMenu(null);
                  setEditMenuData({ name: '', icon: 'menu', description: '' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMenu}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Roles Modal */}
      {showRolesModal && editingMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Manage Role Access</h2>
                <p className="text-sm text-gray-500">{editingMenu.name}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Select which roles can see this menu. If no roles are selected, the menu will be visible to all users.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {roles.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No roles defined for this app. Create roles in the Roles section first.
                </p>
              ) : (
                roles.map(role => (
                  <label
                    key={role.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRoleIds.includes(role.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoleIds.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{role.name}</div>
                      {role.description && (
                        <div className="text-xs text-gray-500">{role.description}</div>
                      )}
                    </div>
                  </label>
                ))
              )}
            </div>

            {selectedRoleIds.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>{selectedRoleIds.length}</strong> role{selectedRoleIds.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            {selectedRoleIds.length === 0 && roles.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-700">
                  No roles selected - menu will be visible to all users
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRolesModal(false);
                  setEditingMenu(null);
                  setSelectedRoleIds([]);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={savingRoles}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoles}
                disabled={savingRoles}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {savingRoles ? 'Saving...' : 'Save Roles'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Menu Modal */}
      {showDuplicateModal && duplicatingMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Copy className="w-5 h-5 text-blue-600" />
              Duplicate Menu
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Create a copy of <strong>"{duplicatingMenu.name}"</strong> with all its menu items.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Menu Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={duplicateName}
                  onChange={(e) => setDuplicateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter name for the duplicate"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDuplicateModal(false);
                  setDuplicatingMenu(null);
                  setDuplicateName('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDuplicate}
                disabled={!duplicateName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Duplicate
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppLayout>
  );
}
