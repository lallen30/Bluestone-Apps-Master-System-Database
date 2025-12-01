'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, appScreenElementsAPI, appScreensAPI, screenElementsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { 
  ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, RotateCcw, 
  Settings, AlertCircle, Save, X, GripVertical 
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface Element {
  element_instance_id?: number;
  custom_element_id?: number;
  element_id: number;
  element_name: string;
  element_type: string;
  element_category: string;
  field_key: string;
  label: string;
  placeholder?: string;
  default_value?: string;
  is_required: boolean;
  is_visible?: boolean;
  is_hidden?: boolean;
  display_order: number;
  is_custom: boolean;
  has_override: boolean;
  content_value?: string;
  content_options?: any;
  config?: any;
}

export default function ManageScreenElements() {
  const router = useRouter();
  const params = useParams();
  const appId = parseInt(params.id as string);
  const screenId = parseInt(params.screenId as string);
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  
  const [app, setApp] = useState<any>(null);
  const [screen, setScreen] = useState<any>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [allElements, setAllElements] = useState<Element[]>([]); // Store all elements including hidden
  const [availableElements, setAvailableElements] = useState<any[]>([]);
  const [availableScreens, setAvailableScreens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ master: 0, overridden: 0, custom: 0, total: 0, hidden: 0 });
  const [showHidden, setShowHidden] = useState(false);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form data for override/custom element
  const [formData, setFormData] = useState<{
    custom_label: string;
    custom_placeholder: string;
    custom_default_value: string;
    is_required: boolean;
    is_hidden: boolean;
    display_order: number;
    custom_config?: any;
  }>({
    custom_label: '',
    custom_placeholder: '',
    custom_default_value: '',
    is_required: false,
    is_hidden: false,
    display_order: 0,
    custom_config: {},
  });
  
  // Add custom element form
  const [customElementForm, setCustomElementForm] = useState<{
    element_id: string;
    field_key: string;
    label: string;
    placeholder: string;
    default_value: string;
    is_required: boolean;
    display_order: number;
    custom_config: any;
  }>({
    element_id: '',
    field_key: '',
    label: '',
    placeholder: '',
    default_value: '',
    is_required: false,
    display_order: 999,
    custom_config: {},
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (token && !isHydrated) {
      return;
    }

    // Only master admins can access this page
    if (isHydrated && user?.role_level !== 1) {
      alert('Access denied. Only Master Admins can manage screen elements.');
      router.push(`/app/${appId}/screens`);
      return;
    }

    if (user) {
      fetchData();
    }
  }, [isAuthenticated, user, isHydrated, appId, screenId, router]);

  const fetchData = async () => {
    try {
      // Fetch app details
      const appResponse = await appsAPI.getById(appId);
      setApp(appResponse.data);

      // Fetch screen details
      const screenResponse = await appsAPI.getById(appId);
      setScreen({ id: screenId, name: 'Screen' }); // Simplified for now

      // Fetch elements with overrides
      const elementsResponse = await appScreenElementsAPI.getAppScreenElements(appId, screenId);
      console.log('Elements response:', elementsResponse);
      setElements(elementsResponse.elements || []);
      setAllElements([...(elementsResponse.elements || []), ...(elementsResponse.hiddenElements || [])]);
      setCounts(elementsResponse.counts || { master: 0, overridden: 0, custom: 0, total: 0, hidden: 0 });

      // Fetch available screen elements for adding custom elements
      const availableResponse = await screenElementsAPI.getAll();
      setAvailableElements(availableResponse.data || []);

      // Fetch available screens for button navigation
      const screensResponse = await appScreensAPI.getAppScreens(appId);
      setAvailableScreens(screensResponse.data || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const openEditModal = (element: Element) => {
    setSelectedElement(element);
    
    // Parse existing config if available
    let config: any = {};
    if (element.config) {
      config = typeof element.config === 'string' 
        ? JSON.parse(element.config) 
        : element.config;
    }
    
    // Convert options array to text for dropdown elements
    let optionsText = '';
    if (config.options && Array.isArray(config.options)) {
      optionsText = config.options.map((opt: any) => {
        if (typeof opt === 'string') return opt;
        if (opt.value === opt.label) return opt.label;
        return `${opt.value}:${opt.label}`;
      }).join('\n');
    }
    
    setFormData({
      custom_label: element.label || '',
      custom_placeholder: element.placeholder || '',
      custom_default_value: element.default_value || '',
      is_required: element.is_required || false,
      is_hidden: element.is_visible === false,
      display_order: element.display_order || 0,
      custom_config: {
        ...config,
        optionsText
      }
    });
    setIsEditModalOpen(true);
  };

  const handleSaveOverride = async () => {
    if (!selectedElement) return;

    setSubmitting(true);
    try {
      if (selectedElement.is_custom) {
        // Update custom element - remove optionsText before saving (it's just for UI)
        const configToSave = { ...formData.custom_config };
        delete configToSave.optionsText;
        
        await appScreenElementsAPI.updateCustomElement(
          appId,
          selectedElement.custom_element_id!,
          {
            label: formData.custom_label,
            placeholder: formData.custom_placeholder,
            default_value: formData.custom_default_value,
            is_required: formData.is_required,
            is_visible: !formData.is_hidden,
            display_order: formData.display_order,
            config: configToSave,
          }
        );
      } else {
        // Create/update override
        await appScreenElementsAPI.createOrUpdateOverride(
          appId,
          screenId,
          selectedElement.element_instance_id!,
          {
            custom_label: formData.custom_label !== selectedElement.label ? formData.custom_label : undefined,
            custom_placeholder: formData.custom_placeholder,
            custom_default_value: formData.custom_default_value,
            is_required: formData.is_required,
            is_hidden: formData.is_hidden,
            custom_display_order: formData.display_order,
            custom_config: formData.custom_config,
          }
        );
      }

      setIsEditModalOpen(false);
      setSelectedElement(null);
      fetchData();
    } catch (error) {
      console.error('Error saving override:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevertOverride = async (element: Element) => {
    if (!element.has_override || !element.element_instance_id) return;

    if (!confirm('Revert this element to its master configuration?')) return;

    try {
      await appScreenElementsAPI.deleteOverride(appId, element.element_instance_id);
      fetchData();
    } catch (error) {
      console.error('Error reverting override:', error);
      alert('Failed to revert override. Please try again.');
    }
  };

  const handleDeleteCustomElement = async (element: Element) => {
    if (!element.is_custom || !element.custom_element_id) return;

    if (!confirm(`Delete custom element "${element.label}"? This cannot be undone.`)) return;

    try {
      await appScreenElementsAPI.deleteCustomElement(appId, element.custom_element_id);
      fetchData();
    } catch (error) {
      console.error('Error deleting custom element:', error);
      alert('Failed to delete custom element. Please try again.');
    }
  };

  const handleHideMasterElement = async (element: Element) => {
    if (element.is_custom || !element.element_instance_id) return;

    if (!confirm(`Remove "${element.label}" from this app?  This Element can be brought back at any time.`)) return;

    try {
      await appScreenElementsAPI.createOrUpdateOverride(appId, screenId, element.element_instance_id, {
        is_hidden: true,
      });
      fetchData();
    } catch (error) {
      console.error('Error hiding element:', error);
      alert('Failed to hide element. Please try again.');
    }
  };

  const handleRestoreElement = async (element: Element) => {
    if (element.is_custom || !element.element_instance_id) return;

    if (!confirm(`Restore "${element.label}" to this app?`)) return;

    try {
      await appScreenElementsAPI.createOrUpdateOverride(appId, screenId, element.element_instance_id, {
        is_hidden: false,
      });
      fetchData();
    } catch (error) {
      console.error('Error restoring element:', error);
      alert('Failed to restore element. Please try again.');
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const displayList = showHidden ? allElements : elements;
    const reordered = [...displayList];
    const [movedItem] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedItem);

    // Update display orders
    const updatedElements = reordered.map((el, index) => ({
      ...el,
      display_order: index + 1
    }));

    if (showHidden) {
      setAllElements(updatedElements);
      setElements(updatedElements.filter(el => !el.is_hidden));
    } else {
      setElements(updatedElements);
    }

    // Save the new order to the backend
    saveElementOrder(updatedElements);
  };

  const saveElementOrder = async (orderedElements: Element[]) => {
    try {
      for (const element of orderedElements) {
        if (element.is_custom && element.custom_element_id) {
          // Update custom element
          await appScreenElementsAPI.updateCustomElement(appId, element.custom_element_id, {
            display_order: element.display_order
          });
        } else if (element.element_instance_id) {
          // Update override for master element
          await appScreenElementsAPI.createOrUpdateOverride(appId, screenId, element.element_instance_id, {
            custom_display_order: element.display_order
          });
        }
      }
    } catch (error) {
      console.error('Error saving element order:', error);
      alert('Failed to save new order. Please try again.');
      fetchData(); // Reload to reset
    }
  };

  const handleAddCustomElement = async () => {
    if (!customElementForm.element_id || !customElementForm.field_key) {
      alert('Please select an element type and enter a field key.');
      return;
    }

    setSubmitting(true);
    try {
      // Remove optionsText before saving (it's just for UI)
      const configToSave = { ...customElementForm.custom_config };
      delete configToSave.optionsText;
      
      await appScreenElementsAPI.addCustomElement(appId, screenId, {
        element_id: parseInt(customElementForm.element_id),
        field_key: customElementForm.field_key,
        label: customElementForm.label,
        placeholder: customElementForm.placeholder,
        default_value: customElementForm.default_value,
        is_required: customElementForm.is_required,
        display_order: customElementForm.display_order,
        config: configToSave,
      });

      setIsAddModalOpen(false);
      setCustomElementForm({
        element_id: '',
        field_key: '',
        label: '',
        placeholder: '',
        default_value: '',
        is_required: false,
        display_order: 999,
        custom_config: {},
      });
      fetchData();
    } catch (error: any) {
      console.error('Error adding custom element:', error);
      alert(error.response?.data?.message || 'Failed to add custom element. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout appId={appId.toString()} appName={app?.name || 'Loading...'}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout appId={appId.toString()} appName={app?.name || 'App'}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push(`/app/${appId}/screens`)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Screen Elements</h1>
              <p className="text-gray-600 mt-1">
                Customize elements for this app without affecting other apps
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Active Elements</div>
              <div className="text-2xl font-bold text-purple-600">{counts.total}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Master Elements</div>
              <div className="text-2xl font-bold text-gray-900">{counts.master}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Overridden</div>
              <div className="text-2xl font-bold text-blue-600">{counts.overridden}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Custom Elements</div>
              <div className="text-2xl font-bold text-green-600">{counts.custom}</div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">App-Specific Customization</h3>
              <p className="text-sm text-blue-800">
                Changes made here only affect <strong>{app?.name}</strong>. Other apps using this screen will not be affected.
                You can override existing fields or add completely new custom fields.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showHidden}
                onChange={(e) => setShowHidden(e.target.checked)}
                className="rounded border-gray-300"
              />
              Show Removed Elements ({counts.hidden})
            </label>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Element
          </Button>
        </div>

        {/* Elements List */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Field
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
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
                {(showHidden ? allElements : elements).map((element, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-gray-50 ${element.is_hidden ? 'bg-red-50' : ''}`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', index.toString());
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                      handleReorder(fromIndex, index);
                    }}
                  >
                    <td className="px-6 py-4">
                      <button className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                        <GripVertical className="w-5 h-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{element.label}</div>
                        <div className="text-sm text-gray-500">Key: {element.field_key}</div>
                        {element.content_value && (
                          <div className="text-xs text-green-600 mt-1">
                            <span className="font-medium">Content:</span> {element.content_value.length > 50 ? element.content_value.substring(0, 50) + '...' : element.content_value}
                          </div>
                        )}
                        {element.placeholder && (
                          <div className="text-xs text-gray-400">Placeholder: {element.placeholder}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {element.element_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {element.is_hidden === true && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 inline-block w-fit">
                            Removed
                          </span>
                        )}
                        {element.is_custom === true && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 inline-block w-fit">
                            Custom
                          </span>
                        )}
                        {element.has_override === true && element.is_custom !== true && element.is_hidden !== true && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 inline-block w-fit">
                            Overridden
                          </span>
                        )}
                        {element.is_custom !== true && element.has_override !== true && element.is_hidden !== true && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 inline-block w-fit">
                            Master
                          </span>
                        )}
                        {element.is_required === true && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 inline-block w-fit">
                            Required
                          </span>
                        )}
                        {element.content_value && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 inline-block w-fit">
                            Has Content
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(element)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {element.has_override && !element.is_custom && (
                          <button
                            onClick={() => handleRevertOverride(element)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                            title="Revert to Master"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        {element.is_custom ? (
                          <button
                            onClick={() => handleDeleteCustomElement(element)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Custom Element"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : element.is_hidden ? (
                          <button
                            onClick={() => handleRestoreElement(element)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Restore Element"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleHideMasterElement(element)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Remove from this App."
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit/Override Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={selectedElement?.is_custom ? 'Edit Custom Element' : 'Override Element'}
      >
        <div className="space-y-4">
          {selectedElement && !selectedElement.is_custom && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You're creating an override for this app only. Other apps will still see the original values.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              value={formData.custom_label}
              onChange={(e) => setFormData({ ...formData, custom_label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Field label"
            />
          </div>

          {selectedElement?.element_type === 'link' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action Type
                </label>
                <select
                  value={formData.custom_config?.actionType || 'url'}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    custom_config: { 
                      ...formData.custom_config, 
                      actionType: e.target.value,
                      url: e.target.value === 'url' ? formData.custom_config?.url : undefined,
                      screenId: e.target.value === 'screen' ? formData.custom_config?.screenId : undefined
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="url">Open URL</option>
                  <option value="screen">Navigate to Screen</option>
                </select>
              </div>

              {(!formData.custom_config?.actionType || formData.custom_config?.actionType === 'url') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={formData.custom_config?.url || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      custom_config: { ...formData.custom_config, url: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com"
                  />
                </div>
              )}

              {formData.custom_config?.actionType === 'screen' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Screen
                  </label>
                  <select
                    value={formData.custom_config?.screenId || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      custom_config: { ...formData.custom_config, screenId: parseInt(e.target.value) || undefined }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a screen...</option>
                    {availableScreens.map((scr: any) => (
                      <option key={scr.id} value={scr.id}>
                        {scr.name} (ID: {scr.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ) : selectedElement?.element_type === 'button' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action Type
                </label>
                <select
                  value={formData.custom_config?.actionType || 'none'}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    custom_config: { 
                      ...formData.custom_config, 
                      actionType: e.target.value,
                      url: e.target.value === 'url' ? formData.custom_config?.url : undefined,
                      screenId: e.target.value === 'screen' ? formData.custom_config?.screenId : undefined,
                      submitType: e.target.value === 'submit' ? formData.custom_config?.submitType || 'save' : undefined
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="none">No Action</option>
                  <option value="url">Open URL</option>
                  <option value="screen">Navigate to Screen</option>
                  <option value="submit">Submit Form</option>
                </select>
              </div>

              {formData.custom_config?.actionType === 'url' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={formData.custom_config?.url || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      custom_config: { ...formData.custom_config, url: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com"
                  />
                </div>
              )}

              {formData.custom_config?.actionType === 'screen' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Screen
                  </label>
                  <select
                    value={formData.custom_config?.screenId || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      custom_config: { ...formData.custom_config, screenId: parseInt(e.target.value) || undefined }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a screen...</option>
                    {availableScreens.map((scr: any) => (
                      <option key={scr.id} value={scr.id}>
                        {scr.name} (ID: {scr.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.custom_config?.actionType === 'submit' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Submit Type
                    </label>
                    <select
                      value={formData.custom_config?.submitType || 'save'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        custom_config: { ...formData.custom_config, submitType: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="save">Save Data</option>
                      <option value="login">Login</option>
                      <option value="register">Register</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Choose what happens when the button is clicked</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Redirect After Success
                    </label>
                    <select
                      value={formData.custom_config?.redirectScreenId || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        custom_config: { ...formData.custom_config, redirectScreenId: parseInt(e.target.value) || null }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">{formData.custom_config?.submitType === 'login' ? 'Default (Home screen)' : 'Stay on current screen'}</option>
                      {availableScreens.map((scr: any) => (
                        <option key={scr.id} value={scr.id}>
                          {scr.name} (ID: {scr.id})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.custom_config?.submitType === 'login' 
                        ? 'Screen to navigate to after successful login (default: Home)' 
                        : 'Screen to navigate to after successful submission'}
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={formData.custom_placeholder}
                  onChange={(e) => setFormData({ ...formData, custom_placeholder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Placeholder text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Value
                </label>
                <input
                  type="text"
                  value={formData.custom_default_value}
                  onChange={(e) => setFormData({ ...formData, custom_default_value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Default value"
                />
              </div>

              {/* Options field for dropdown/select elements */}
              {(selectedElement?.element_type === 'dropdown' || 
                selectedElement?.element_type === 'select' || 
                selectedElement?.element_type === 'Dropdown') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Options
                  </label>
                  <textarea
                    value={formData.custom_config?.optionsText ?? ''}
                    onChange={(e) => {
                      const text = e.target.value;
                      // Parse options only from non-empty lines
                      const lines = text.split('\n');
                      const options = lines
                        .filter(line => line.trim())
                        .map(line => {
                          if (line.includes(':')) {
                            const colonIndex = line.indexOf(':');
                            const value = line.substring(0, colonIndex).trim();
                            const label = line.substring(colonIndex + 1).trim();
                            return { value, label: label || value };
                          }
                          return { value: line.trim(), label: line.trim() };
                        });
                      setFormData({ 
                        ...formData, 
                        custom_config: { 
                          ...formData.custom_config, 
                          optionsText: text,
                          options 
                        }
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter one option per line, e.g.:&#10;Small&#10;Medium&#10;Large&#10;&#10;Or use value:label format:&#10;sm:Small&#10;md:Medium&#10;lg:Large"
                    rows={5}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter one option per line. Optionally use "value:label" format for different values and display labels.
                  </p>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_required}
                onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Required</span>
            </label>

            {!selectedElement?.is_custom && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_hidden}
                  onChange={(e) => setFormData({ ...formData, is_hidden: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Hidden</span>
              </label>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveOverride} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Custom Element Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Custom Element"
      >
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>Custom fields</strong> are unique to this app and don't exist in the master screen.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Element Type *
            </label>
            <select
              value={customElementForm.element_id}
              onChange={(e) => setCustomElementForm({ ...customElementForm, element_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select element type...</option>
              {availableElements
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              value={customElementForm.label}
              onChange={(e) => {
                const label = e.target.value;
                // Auto-generate field_key from label if field_key is empty or was auto-generated
                const autoKey = label
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '_')
                  .replace(/^_+|_+$/g, '');
                setCustomElementForm({ 
                  ...customElementForm, 
                  label,
                  field_key: autoKey
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Employee ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Key * (unique identifier)
            </label>
            <input
              type="text"
              value={customElementForm.field_key}
              onChange={(e) => setCustomElementForm({ ...customElementForm, field_key: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              placeholder="e.g., employee_id"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-generated from label, but you can edit it</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={customElementForm.placeholder}
              onChange={(e) => setCustomElementForm({ ...customElementForm, placeholder: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Placeholder text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Value
            </label>
            <input
              type="text"
              value={customElementForm.default_value}
              onChange={(e) => setCustomElementForm({ ...customElementForm, default_value: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Default value"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={customElementForm.display_order}
              onChange={(e) => setCustomElementForm({ ...customElementForm, display_order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Action Type for Button and Link elements */}
          {(() => {
            const selectedElement = availableElements.find(el => el.id === parseInt(customElementForm.element_id));
            const elementType = selectedElement?.element_type;
            
            if (elementType === 'button' || elementType === 'link') {
              return (
                <div className="space-y-3 border-t pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Action Type
                    </label>
                    <select
                      value={customElementForm.custom_config?.actionType || (elementType === 'button' ? 'none' : 'url')}
                      onChange={(e) => setCustomElementForm({
                        ...customElementForm,
                        custom_config: {
                          ...customElementForm.custom_config,
                          actionType: e.target.value,
                          url: e.target.value === 'url' ? customElementForm.custom_config?.url : undefined,
                          screenId: e.target.value === 'screen' ? customElementForm.custom_config?.screenId : undefined
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {elementType === 'button' && <option value="none">No Action</option>}
                      <option value="url">Open URL</option>
                      <option value="screen">Navigate to Screen</option>
                    </select>
                  </div>

                  {customElementForm.custom_config?.actionType === 'url' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL
                      </label>
                      <input
                        type="url"
                        value={customElementForm.custom_config?.url || ''}
                        onChange={(e) => setCustomElementForm({
                          ...customElementForm,
                          custom_config: {
                            ...customElementForm.custom_config,
                            url: e.target.value
                          }
                        })}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}

                  {customElementForm.custom_config?.actionType === 'screen' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Screen
                      </label>
                      <select
                        value={customElementForm.custom_config?.screenId || ''}
                        onChange={(e) => setCustomElementForm({
                          ...customElementForm,
                          custom_config: {
                            ...customElementForm.custom_config,
                            screenId: parseInt(e.target.value) || undefined
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a screen...</option>
                        {availableScreens.map((scr: any) => (
                          <option key={scr.id} value={scr.id}>
                            {scr.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Select the screen to navigate to</p>
                    </div>
                  )}
                </div>
              );
            }
            
            // Options field for dropdown/select elements
            if (elementType === 'dropdown' || elementType === 'select' || elementType === 'Dropdown') {
              return (
                <div className="space-y-3 border-t pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Options *
                    </label>
                    <textarea
                      value={customElementForm.custom_config?.optionsText ?? ''}
                      onChange={(e) => {
                        const text = e.target.value;
                        // Parse options only from non-empty lines
                        const lines = text.split('\n');
                        const options = lines
                          .filter(line => line.trim())
                          .map(line => {
                            if (line.includes(':')) {
                              const colonIndex = line.indexOf(':');
                              const value = line.substring(0, colonIndex).trim();
                              const label = line.substring(colonIndex + 1).trim();
                              return { value, label: label || value };
                            }
                            return { value: line.trim(), label: line.trim() };
                          });
                        setCustomElementForm({
                          ...customElementForm,
                          custom_config: { 
                            ...customElementForm.custom_config, 
                            optionsText: text,
                            options 
                          }
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter one option per line, e.g.:&#10;Small&#10;Medium&#10;Large&#10;&#10;Or use value:label format:&#10;sm:Small&#10;md:Medium&#10;lg:Large"
                      rows={5}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter one option per line. Optionally use "value:label" format for different values and display labels.
                    </p>
                  </div>
                </div>
              );
            }
            
            return null;
          })()}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={customElementForm.is_required}
              onChange={(e) => setCustomElementForm({ ...customElementForm, is_required: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Required</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCustomElement} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Field'}
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
