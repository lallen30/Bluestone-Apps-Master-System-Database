'use client';

import { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import { modulesAPI } from '@/lib/api';

interface Module {
  id: number;
  name: string;
  module_type: string;
  description: string | null;
  default_config: any;
  is_active: boolean;
}

interface ModuleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenId: number;
  screenName: string;
  onSave: () => void;
}

export default function ModuleAssignmentModal({
  isOpen,
  onClose,
  screenId,
  screenName,
  onSave,
}: ModuleAssignmentModalProps) {
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [assignedModules, setAssignedModules] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, screenId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [modulesResponse, assignedResponse] = await Promise.all([
        modulesAPI.getAll(),
        modulesAPI.getScreenModules(screenId),
      ]);

      setAvailableModules(modulesResponse.data || []);
      const assigned = (assignedResponse.data || []).map((m: any) => m.module_id);
      setAssignedModules(assigned);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleModule = (moduleId: number) => {
    setAssignedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Get currently assigned modules
      const currentResponse = await modulesAPI.getScreenModules(screenId);
      const currentModuleIds = (currentResponse.data || []).map((m: any) => m.module_id);

      // Find modules to add and remove
      const toAdd = assignedModules.filter((id) => !currentModuleIds.includes(id));
      const toRemove = currentModuleIds.filter((id: number) => !assignedModules.includes(id));

      // Add new modules
      for (const moduleId of toAdd) {
        await modulesAPI.assignToScreen(screenId, moduleId);
      }

      // Remove unselected modules
      for (const moduleId of toRemove) {
        await modulesAPI.removeFromScreen(screenId, moduleId);
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving modules:', error);
      alert(error.response?.data?.message || 'Failed to save modules');
    } finally {
      setSaving(false);
    }
  };

  const getModuleTypeLabel = (type: string) => {
    switch (type) {
      case 'header_bar':
        return 'Header Bar';
      case 'footer_bar':
        return 'Footer Bar';
      case 'floating_action_button':
        return 'Floating Action Button';
      default:
        return type;
    }
  };

  const getModuleTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'header_bar':
        return 'bg-blue-100 text-blue-800';
      case 'footer_bar':
        return 'bg-green-100 text-green-800';
      case 'floating_action_button':
        return 'bg-purple-100 text-purple-800';
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
            <h2 className="text-xl font-bold text-gray-900">Assign Modules</h2>
            <p className="text-sm text-gray-600 mt-1">Add navigation modules to "{screenName}"</p>
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
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading modules...</p>
            </div>
          ) : availableModules.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No modules available</p>
              <a
                href="/master/modules"
                className="text-blue-600 hover:underline text-sm mt-2 inline-block"
              >
                Go to Modules →
              </a>
            </div>
          ) : (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 What are modules?</strong>
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Modules are navigation components like header bars and footers that appear on screens. 
                  Select which modules should display on this screen.
                </p>
              </div>

              <div className="space-y-3">
                {availableModules.map((module) => (
                  <label
                    key={module.id}
                    className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={assignedModules.includes(module.id)}
                      onChange={() => handleToggleModule(module.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{module.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getModuleTypeBadgeColor(module.module_type)}`}>
                          {getModuleTypeLabel(module.module_type)}
                        </span>
                      </div>
                      {module.description && (
                        <p className="text-sm text-gray-600">{module.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <p className="text-sm text-gray-600">
            {assignedModules.length} module{assignedModules.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Modules'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
