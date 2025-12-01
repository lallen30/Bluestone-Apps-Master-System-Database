'use client';

import { useState, useEffect } from 'react';
import { X, Monitor } from 'lucide-react';
import { menuAPI, appScreensAPI } from '@/lib/api';

interface ScreenAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: {
    id: number;
    name: string;
  };
  appId: number;
  onSave: () => void;
}

interface Screen {
  id: number;
  name: string;
  category: string;
}

export default function ScreenAssignmentModal({ isOpen, onClose, menu, appId, onSave }: ScreenAssignmentModalProps) {
  const [allScreens, setAllScreens] = useState<Screen[]>([]);
  const [selectedScreenIds, setSelectedScreenIds] = useState<number[]>([]);
  const [originalScreenIds, setOriginalScreenIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && menu) {
      fetchData();
    }
  }, [isOpen, menu, appId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all screens for the app
      const screensResponse = await appScreensAPI.getAppScreens(appId);
      const screens = Array.isArray(screensResponse.data) ? screensResponse.data : [];
      setAllScreens(screens);
      
      // For each screen, check if this menu is assigned to it
      const screensWithThisMenu: number[] = [];
      
      for (const screen of screens) {
        try {
          const screenMenusResponse = await menuAPI.getScreenMenus(screen.id);
          const screenMenus = screenMenusResponse.data || [];
          if (screenMenus.some((m: any) => m.id === menu.id)) {
            screensWithThisMenu.push(screen.id);
          }
        } catch (error) {
          // Screen might not have any menus assigned
        }
      }
      
      setSelectedScreenIds(screensWithThisMenu);
      setOriginalScreenIds(screensWithThisMenu);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleScreen = (screenId: number) => {
    setSelectedScreenIds((prev) =>
      prev.includes(screenId)
        ? prev.filter((id) => id !== screenId)
        : [...prev, screenId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Find screens to add menu to (selected but wasn't before)
      const screensToAddMenuTo = selectedScreenIds.filter((id) => !originalScreenIds.includes(id));
      
      // Find screens to remove menu from (was selected but not anymore)
      const screensToRemoveMenuFrom = originalScreenIds.filter((id) => !selectedScreenIds.includes(id));

      // For each screen that needs the menu added
      for (const screenId of screensToAddMenuTo) {
        // Get current menus for this screen
        const screenMenusResponse = await menuAPI.getScreenMenus(screenId);
        const currentMenuIds = (screenMenusResponse.data || []).map((m: any) => m.id);
        // Add our menu to the list
        await menuAPI.assignMenusToScreen(screenId, [...currentMenuIds, menu.id]);
      }

      // For each screen that needs the menu removed
      for (const screenId of screensToRemoveMenuFrom) {
        // Get current menus for this screen
        const screenMenusResponse = await menuAPI.getScreenMenus(screenId);
        const currentMenuIds = (screenMenusResponse.data || []).map((m: any) => m.id);
        // Remove our menu from the list
        await menuAPI.assignMenusToScreen(screenId, currentMenuIds.filter((id: number) => id !== menu.id));
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving screen assignments:', error);
      alert(error.response?.data?.message || 'Failed to save screen assignments');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Display Menu on Screens</h2>
            <p className="text-sm text-gray-600 mt-1">
              Choose which screens to show "{menu.name}" on
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="text-gray-500">Loading screens...</div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 mb-4">
            {allScreens.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No screens available</p>
            ) : (
              allScreens.map((screen) => (
                <label
                  key={screen.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedScreenIds.includes(screen.id)}
                    onChange={() => handleToggleScreen(screen.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Monitor className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{screen.name}</div>
                    <div className="text-sm text-gray-500">{screen.category || 'No category'}</div>
                  </div>
                </label>
              ))
            )}
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
