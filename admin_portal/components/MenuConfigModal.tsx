'use client';

import { useState, useEffect } from 'react';
import { X, Menu as MenuIcon, LayoutGrid } from 'lucide-react';

interface MenuConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  screen: any;
  onSave: (config: MenuConfig) => Promise<void>;
}

export interface MenuConfig {
  show_in_tabbar: boolean;
  tabbar_order: number | null;
  tabbar_icon: string;
  tabbar_label: string;
  show_in_sidebar: boolean;
  sidebar_order: number | null;
}

const ICON_OPTIONS = [
  { value: 'home', label: 'Home' },
  { value: 'search', label: 'Search/Explore' },
  { value: 'favorite', label: 'Favorites' },
  { value: 'person', label: 'Profile' },
  { value: 'settings', label: 'Settings' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'message', label: 'Messages' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'map', label: 'Map' },
  { value: 'camera', label: 'Camera' },
  { value: 'image', label: 'Gallery' },
  { value: 'bookmark', label: 'Bookmarks' },
  { value: 'share', label: 'Share' },
  { value: 'list', label: 'List' },
  { value: 'grid-view', label: 'Grid' },
  { value: 'menu', label: 'Menu' },
];

export default function MenuConfigModal({ isOpen, onClose, screen, onSave }: MenuConfigModalProps) {
  const [config, setConfig] = useState<MenuConfig>({
    show_in_tabbar: false,
    tabbar_order: null,
    tabbar_icon: 'home',
    tabbar_label: screen?.name || '',
    show_in_sidebar: true,
    sidebar_order: null,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (screen) {
      setConfig({
        show_in_tabbar: screen.show_in_tabbar || false,
        tabbar_order: screen.tabbar_order,
        tabbar_icon: screen.tabbar_icon || 'home',
        tabbar_label: screen.tabbar_label || screen.name,
        show_in_sidebar: screen.show_in_sidebar !== undefined ? screen.show_in_sidebar : true,
        sidebar_order: screen.sidebar_order,
      });
    }
  }, [screen]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(config);
      onClose();
    } catch (error) {
      console.error('Error saving menu config:', error);
      alert('Failed to save menu configuration');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Menu Configuration</h2>
            <p className="text-sm text-gray-600 mt-1">Configure where "{screen?.name}" appears in the app</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tabbar Section */}
          <div className="border border-blue-200 rounded-lg p-5 bg-blue-50/50">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Bottom Tab Bar</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add this screen to the bottom navigation bar (2-5 screens recommended)
                </p>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.show_in_tabbar}
                      onChange={(e) =>
                        setConfig({ ...config, show_in_tabbar: e.target.checked })
                      }
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      Show in tab bar
                    </span>
                  </label>

                  {config.show_in_tabbar && (
                    <div className="ml-8 space-y-4 pt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tab Label <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={config.tabbar_label}
                          onChange={(e) =>
                            setConfig({ ...config, tabbar_label: e.target.value })
                          }
                          placeholder="e.g., Explore, Home, Profile"
                          maxLength={15}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Keep it short (max 15 characters)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tab Icon <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={config.tabbar_icon}
                          onChange={(e) =>
                            setConfig({ ...config, tabbar_icon: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {ICON_OPTIONS.map((icon) => (
                            <option key={icon.value} value={icon.value}>
                              {icon.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Display Order
                        </label>
                        <input
                          type="number"
                          value={config.tabbar_order || ''}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              tabbar_order: e.target.value ? parseInt(e.target.value) : null,
                            })
                          }
                          placeholder="Leave empty for auto-order"
                          min="0"
                          max="10"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Lower numbers appear first. Leave empty to auto-assign.
                        </p>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs text-yellow-800">
                          <strong>⚠️ Important:</strong> Tab bars work best with 2-5 screens.
                          Too many tabs can make navigation confusing.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="border border-purple-200 rounded-lg p-5 bg-purple-50/50">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <MenuIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Sidebar Menu</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add this screen to the sidebar/menu list (unlimited screens)
                </p>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.show_in_sidebar}
                      onChange={(e) =>
                        setConfig({ ...config, show_in_sidebar: e.target.checked })
                      }
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      Show in sidebar menu
                    </span>
                  </label>

                  {config.show_in_sidebar && (
                    <div className="ml-8 space-y-4 pt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Display Order
                        </label>
                        <input
                          type="number"
                          value={config.sidebar_order || ''}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              sidebar_order: e.target.value ? parseInt(e.target.value) : null,
                            })
                          }
                          placeholder="Leave empty for auto-order"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Lower numbers appear first. Leave empty to auto-assign.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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
            disabled={saving || (config.show_in_tabbar && !config.tabbar_label.trim())}
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
