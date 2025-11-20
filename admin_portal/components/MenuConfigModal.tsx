'use client';

import { useState, useEffect } from 'react';
import { X, Menu as MenuIcon, Smartphone, SidebarIcon } from 'lucide-react';
import { menuAPI } from '@/lib/api';

interface MenuConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  screen: any;
  appId: number;
  onSave: (menuIds: number[]) => Promise<void>;
}

interface Menu {
  id: number;
  name: string;
  menu_type: 'tabbar' | 'sidebar_left' | 'sidebar_right';
  description: string | null;
  item_count: number;
}

export interface MenuConfig {
  show_in_tabbar: boolean;
  tabbar_order: number | null;
  tabbar_icon: string;
  tabbar_label: string;
  show_in_sidebar: boolean;
  sidebar_order: number | null;
}

export default function MenuConfigModal({ isOpen, onClose, screen, appId, onSave }: MenuConfigModalProps) {
  const [availableMenus, setAvailableMenus] = useState<Menu[]>([]);
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && screen) {
      fetchMenus();
    }
  }, [isOpen, screen, appId]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const [menusResponse, screenMenusResponse] = await Promise.all([
        menuAPI.getAppMenus(appId),
        menuAPI.getScreenMenus(screen.id),
      ]);

      setAvailableMenus(menusResponse.data || []);
      setSelectedMenuIds(screenMenusResponse.data.map((m: Menu) => m.id));
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMenu = (menuId: number) => {
    setSelectedMenuIds((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(selectedMenuIds);
      onClose();
    } catch (error) {
      console.error('Error saving menu config:', error);
      alert('Failed to save menu configuration');
    } finally {
      setSaving(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Display Menus on Screen</h2>
            <p className="text-sm text-gray-600 mt-1">Choose which menus to show on "{screen?.name}"</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading menus...</div>
          ) : availableMenus.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No menus available. Create menus first in the Menus page.</p>
              <a
                href={`/app/${appId}/menus`}
                className="text-blue-600 hover:underline"
              >
                Go to Menus →
              </a>
            </div>
          ) : (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Two ways to use menus:</strong>
                </p>
                <ul className="text-xs text-blue-700 mt-2 space-y-1 ml-4 list-disc">
                  <li><strong>Display menus ON this screen:</strong> Select menus below to show navigation on this screen</li>
                  <li><strong>Add this screen TO a menu:</strong> Go to Menus page → Manage Items to add this screen as a menu item</li>
                </ul>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Select which menus should display on the "{screen?.name}" screen.
                A screen can show multiple menus (e.g., both a tab bar and sidebar).
              </p>

              <div className="space-y-3">
                {availableMenus.map((menu) => (
                  <label
                    key={menu.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMenuIds.includes(menu.id)}
                      onChange={() => handleToggleMenu(menu.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className={`p-2 rounded-lg ${getMenuTypeBadgeColor(menu.menu_type)}`}>
                      {getMenuTypeIcon(menu.menu_type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{menu.name}</div>
                      <div className="text-sm text-gray-500">
                        {getMenuTypeLabel(menu.menu_type)} • {menu.item_count} items
                      </div>
                      {menu.description && (
                        <div className="text-xs text-gray-500 mt-1">{menu.description}</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> Menus are managed separately in the Menus page.
                  You can add/remove screens from menus and configure their order and icons there.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Configuration'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
