'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { appsAPI, formsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { ArrowLeft, Settings, Edit, Eye, EyeOff, RotateCcw, Save, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import DropdownOptionsManager from '@/components/DropdownOptionsManager';

export default function AppFormElements() {
  const router = useRouter();
  const params = useParams();
  const appId = parseInt(params.id as string);
  const formId = parseInt(params.formId as string);

  const [app, setApp] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHidden, setShowHidden] = useState(false);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form data for override
  const [formData, setFormData] = useState<any>({
    custom_label: '',
    custom_placeholder: '',
    custom_default_value: '',
    custom_help_text: '',
    is_required_override: null,
    is_hidden: false,
    custom_display_order: null,
  });

  useEffect(() => {
    fetchData();
  }, [appId, formId]);

  const fetchData = async () => {
    try {
      const appResponse = await appsAPI.getById(appId);
      setApp(appResponse.data);

      // Fetch form elements with app-specific overrides
      const elementsResponse = await formsAPI.getAppFormElements(appId, formId);
      if (elementsResponse.success) {
        setElements(elementsResponse.elements || []);
      }

      // Also fetch form details
      const formResponse = await formsAPI.getById(formId);
      if (formResponse.success) {
        setForm(formResponse.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleEditClick = (element: any) => {
    setSelectedElement(element);
    setFormData({
      custom_label: element.custom_label || '',
      custom_placeholder: element.custom_placeholder || '',
      custom_default_value: element.custom_default_value || '',
      custom_help_text: element.custom_help_text || '',
      is_required_override: element.is_required_override !== null ? element.is_required_override : null,
      is_hidden: element.is_hidden || false,
      custom_display_order: element.custom_display_order || null,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveOverride = async () => {
    if (!selectedElement) return;
    
    setSubmitting(true);
    try {
      await formsAPI.createOrUpdateOverride(appId, formId, selectedElement.id, formData);
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving override:', error);
      alert('Failed to save override');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleVisibility = async (element: any) => {
    try {
      await formsAPI.toggleVisibility(appId, formId, element.id);
      fetchData();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      alert('Failed to toggle visibility');
    }
  };

  const handleResetOverride = async (element: any) => {
    if (!confirm('Reset this field to master settings?')) return;
    
    try {
      await formsAPI.deleteOverride(appId, formId, element.id);
      fetchData();
    } catch (error) {
      console.error('Error resetting override:', error);
      alert('Failed to reset override');
    }
  };

  const visibleElements = showHidden ? elements : elements.filter(el => !el.is_hidden);
  const hiddenCount = elements.filter(el => el.is_hidden).length;
  const overriddenCount = elements.filter(el => el.has_override === 1).length;

  if (loading) {
    return (
      <AppLayout appId={appId.toString()} appName={app?.name || 'Loading...'}>
        <div className="p-8">
          <div className="text-center">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout appId={appId.toString()} appName={app?.name || 'App'}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customize Form: {form?.name}</h1>
              <p className="text-gray-600 mt-1">Override form fields for this app</p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/master/forms/${formId}`)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Settings className="w-4 h-4" />
            Edit Master Form
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-gray-900">{elements.length}</div>
            <div className="text-sm text-gray-600">Total Fields</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">{overriddenCount}</div>
            <div className="text-sm text-gray-600">Overridden</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-red-600">{hiddenCount}</div>
            <div className="text-sm text-gray-600">Hidden</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">{elements.length - overriddenCount - hiddenCount}</div>
            <div className="text-sm text-gray-600">Using Master</div>
          </div>
        </div>

        {/* Toggle Hidden */}
        {hiddenCount > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowHidden(!showHidden)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {showHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showHidden ? 'Hide' : 'Show'} Hidden Fields ({hiddenCount})
            </button>
          </div>
        )}

        {/* Elements Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visibleElements.map((element: any, index: number) => (
                <tr key={element.id} className={element.is_hidden ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {element.custom_label || element.label}
                      {(element.is_required_override !== null ? element.is_required_override : element.is_required) && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">Key: {element.field_key}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {element.element_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {element.is_hidden ? (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded flex items-center gap-1 w-fit">
                        <EyeOff className="w-3 h-3" />
                        Hidden
                      </span>
                    ) : element.has_override === 1 ? (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        Overridden
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        Master
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(element)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Override"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(element)}
                        className="text-gray-600 hover:text-gray-900"
                        title={element.is_hidden ? 'Show' : 'Hide'}
                      >
                        {element.is_hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      {element.has_override === 1 && (
                        <button
                          onClick={() => handleResetOverride(element)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Reset to Master"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Override Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Override: ${selectedElement?.label}`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Label
              </label>
              <input
                type="text"
                value={formData.custom_label}
                onChange={(e) => setFormData({ ...formData, custom_label: e.target.value })}
                placeholder={selectedElement?.label}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Placeholder
              </label>
              <input
                type="text"
                value={formData.custom_placeholder}
                onChange={(e) => setFormData({ ...formData, custom_placeholder: e.target.value })}
                placeholder={selectedElement?.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Default Value
              </label>
              <input
                type="text"
                value={formData.custom_default_value}
                onChange={(e) => setFormData({ ...formData, custom_default_value: e.target.value })}
                placeholder={selectedElement?.default_value}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {selectedElement?.element_type === 'dropdown' && (
              <div>
                <DropdownOptionsManager
                  options={(() => {
                    try {
                      // Try custom config first, then fall back to master config
                      const customConfig = formData.custom_config 
                        ? (typeof formData.custom_config === 'string' ? JSON.parse(formData.custom_config) : formData.custom_config)
                        : null;
                      
                      if (customConfig?.options) {
                        return customConfig.options;
                      }
                      
                      const masterConfig = selectedElement?.config
                        ? (typeof selectedElement.config === 'string' ? JSON.parse(selectedElement.config) : selectedElement.config)
                        : null;
                      
                      return masterConfig?.options || [];
                    } catch {
                      return [];
                    }
                  })()}
                  onChange={(options) => {
                    const config = { options };
                    setFormData({ ...formData, custom_config: config });
                  }}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Leave empty to use master options. Add custom options here to override for this app only.
                </p>
              </div>
            )}

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_required_override !== null ? formData.is_required_override : selectedElement?.is_required}
                  onChange={(e) => setFormData({ ...formData, is_required_override: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Required Field</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_hidden}
                  onChange={(e) => setFormData({ ...formData, is_hidden: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Hide this field</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOverride}
                disabled={submitting}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Override'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
