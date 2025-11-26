'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formsAPI } from '@/lib/api';
import { 
  FileText, Save, Plus, Edit, Trash2, GripVertical, 
  ChevronDown, ChevronUp, Settings, X, Check, ArrowLeft 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import DropdownOptionsManager from '@/components/DropdownOptionsManager';

export default function FormBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const formId = parseInt(params.id as string);

  const [form, setForm] = useState<any>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [availableElements, setAvailableElements] = useState<any[]>([]);
  const [groupedElements, setGroupedElements] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showElementPalette, setShowElementPalette] = useState(false);
  const [editingElement, setEditingElement] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchForm();
    fetchAvailableElements();
  }, [formId]);

  const fetchForm = async () => {
    try {
      const response = await formsAPI.getById(formId);
      if (response.success) {
        setForm(response.data);
        setElements(response.data.elements || []);
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      alert('Failed to load form');
      router.push('/master/forms');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableElements = async () => {
    try {
      const response = await formsAPI.getAvailableElements();
      if (response.success) {
        setAvailableElements(response.elements || []);
        setGroupedElements(response.grouped || {});
      }
    } catch (error) {
      console.error('Error fetching available elements:', error);
    }
  };

  const handleAddElement = async (element: any) => {
    const fieldKey = prompt('Enter field key (e.g., title, price, description):');
    if (!fieldKey) return;

    const label = prompt('Enter field label:', fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    if (!label) return;

    try {
      const response = await formsAPI.addElement(formId, {
        element_type: element.element_type,
        field_key: fieldKey.toLowerCase().replace(/\s+/g, '_'),
        label: label,
        placeholder: `Enter ${label.toLowerCase()}`,
        is_required: false,
        display_order: elements.length
      });

      if (response.success) {
        fetchForm();
        setShowElementPalette(false);
      } else {
        alert(response.message || 'Failed to add element');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add element');
    }
  };

  const handleDeleteElement = async (elementId: number) => {
    if (!confirm('Remove this field from the form?')) return;

    try {
      const response = await formsAPI.deleteElement(formId, elementId);
      if (response.success) {
        fetchForm();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete element');
    }
  };

  const handleUpdateElement = async () => {
    if (!editingElement) return;

    try {
      const response = await formsAPI.updateElement(formId, editingElement.id, {
        label: editingElement.label,
        placeholder: editingElement.placeholder,
        help_text: editingElement.help_text,
        is_required: editingElement.is_required,
        display_order: editingElement.display_order
      });

      if (response.success) {
        fetchForm();
        setEditingElement(null);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update element');
    }
  };

  const handleUpdateForm = async () => {
    if (!form) return;

    try {
      setSaving(true);
      const response = await formsAPI.update(formId, {
        name: form.name,
        description: form.description,
        submit_button_text: form.submit_button_text,
        success_message: form.success_message
      });

      if (response.success) {
        alert('Form updated successfully!');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update form');
    } finally {
      setSaving(false);
    }
  };

  const getElementIcon = (elementType: string) => {
    const iconMap: any = {
      text_field: '📝',
      text_area: '📄',
      email_input: '📧',
      phone_input: '📱',
      number_input: '🔢',
      currency_input: '💰',
      dropdown: '📋',
      multi_select: '☑️',
      checkbox: '✅',
      radio_button: '🔘',
      switch_toggle: '🔀',
      date_picker: '📅',
      time_picker: '⏰',
      file_upload: '📎',
      image_upload: '🖼️'
    };
    return iconMap[elementType] || '📌';
  };

  const filteredElements = selectedCategory === 'all' 
    ? availableElements 
    : availableElements.filter(el => el.category === selectedCategory);

  const categories = ['all', ...Object.keys(groupedElements)];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/master/forms')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{form.name}</h1>
                <p className="text-sm text-gray-500">{form.form_key}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowElementPalette(!showElementPalette)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
              <Button
                onClick={handleUpdateForm}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Fields List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Form Fields</h2>
                <span className="text-sm text-gray-500">{elements.length} fields</span>
              </div>

              {elements.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Fields Yet</h3>
                  <p className="text-gray-500 mb-4">Add fields to your form by clicking "Add Field"</p>
                  <Button onClick={() => setShowElementPalette(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Field
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {elements.map((element, index) => (
                    <div
                      key={element.id}
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 bg-white"
                    >
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getElementIcon(element.element_type)}</span>
                          <span className="font-medium text-gray-900">{element.label}</span>
                          {element.is_required && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Required</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="font-mono text-xs">{element.field_key}</span>
                          <span>•</span>
                          <span>{element.element_name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingElement(element)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit field"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteElement(element.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Remove field"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Settings Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Form Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Form Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={form.description || ''}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submit Button Text
                  </label>
                  <input
                    type="text"
                    value={form.submit_button_text}
                    onChange={(e) => setForm({ ...form, submit_button_text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Success Message
                  </label>
                  <textarea
                    value={form.success_message || ''}
                    onChange={(e) => setForm({ ...form, success_message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Form Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Fields</span>
                  <span className="font-semibold">{elements.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Required Fields</span>
                  <span className="font-semibold">{elements.filter(e => e.is_required).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Form Type</span>
                  <span className="font-semibold capitalize">{form.form_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Layout</span>
                  <span className="font-semibold capitalize">{form.layout.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Element Palette Modal */}
      {showElementPalette && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Add Field to Form</h2>
              <button
                onClick={() => setShowElementPalette(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              {/* Category Filter */}
              <div className="mb-4 flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>

              {/* Elements Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredElements.map(element => (
                  <button
                    key={element.id}
                    onClick={() => handleAddElement(element)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getElementIcon(element.element_type)}</span>
                      <span className="font-medium text-gray-900 text-sm">{element.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">{element.element_type}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Element Modal */}
      {editingElement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">Edit Field</h2>
              <button
                onClick={() => setEditingElement(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={editingElement.label}
                  onChange={(e) => setEditingElement({ ...editingElement, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={editingElement.placeholder || ''}
                  onChange={(e) => setEditingElement({ ...editingElement, placeholder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Help Text
                </label>
                <textarea
                  value={editingElement.help_text || ''}
                  onChange={(e) => setEditingElement({ ...editingElement, help_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={2}
                />
              </div>

              {editingElement.element_type === 'dropdown' && (
                <DropdownOptionsManager
                  options={(() => {
                    try {
                      const config = typeof editingElement.config === 'string' 
                        ? JSON.parse(editingElement.config) 
                        : editingElement.config;
                      return config?.options || [];
                    } catch {
                      return [];
                    }
                  })()}
                  onChange={(options) => {
                    const config = typeof editingElement.config === 'string'
                      ? JSON.parse(editingElement.config || '{}')
                      : { ...editingElement.config };
                    config.options = options;
                    setEditingElement({ ...editingElement, config });
                  }}
                />
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={editingElement.is_required}
                  onChange={(e) => setEditingElement({ ...editingElement, is_required: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="required" className="text-sm font-medium text-gray-700">
                  Required field
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-2 flex-shrink-0">
              <Button variant="secondary" onClick={() => setEditingElement(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateElement}>
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
