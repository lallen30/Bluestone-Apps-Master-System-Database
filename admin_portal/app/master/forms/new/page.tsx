'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formsAPI } from '@/lib/api';
import { FileText, Save, X, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NewFormPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    form_key: '',
    description: '',
    form_type: 'create',
    layout: 'single_column',
    submit_button_text: 'Submit',
    success_message: '',
    error_message: '',
    icon: 'file-text',
    category: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.form_key) {
      alert('Name and Form Key are required');
      return;
    }

    try {
      setSaving(true);
      const response = await formsAPI.create(formData);

      if (response.success) {
        alert('Form created successfully!');
        router.push(`/master/forms/${response.form_id}`);
      } else {
        alert(response.message || 'Failed to create form');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create form');
    } finally {
      setSaving(false);
    }
  };

  const generateFormKey = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      form_key: generateFormKey(name)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
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
                <h1 className="text-2xl font-bold text-gray-900">Create New Form</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => router.push('/master/forms')}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Creating...' : 'Create Form'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Form Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Property Listing Form"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Form Key *
                </label>
                <input
                  type="text"
                  value={formData.form_key}
                  onChange={(e) => setFormData({ ...formData, form_key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                  placeholder="e.g., property_listing_form"
                  pattern="[a-z0-9_]+"
                  title="Only lowercase letters, numbers, and underscores"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Unique identifier (lowercase, underscores only)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Describe what this form is used for..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Form Type
                  </label>
                  <select
                    value={formData.form_type}
                    onChange={(e) => setFormData({ ...formData, form_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="create">Create</option>
                    <option value="edit">Edit</option>
                    <option value="search">Search</option>
                    <option value="filter">Filter</option>
                    <option value="multi_step">Multi-Step</option>
                    <option value="wizard">Wizard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Layout
                  </label>
                  <select
                    value={formData.layout}
                    onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="single_column">Single Column</option>
                    <option value="two_column">Two Column</option>
                    <option value="grid">Grid</option>
                    <option value="wizard">Wizard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., real_estate, e-commerce, social"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for grouping and filtering forms
                </p>
              </div>
            </div>
          </div>

          {/* Submit Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Submit Button Text
                </label>
                <input
                  type="text"
                  value={formData.submit_button_text}
                  onChange={(e) => setFormData({ ...formData, submit_button_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Submit, Create Listing, Save"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Success Message
                </label>
                <textarea
                  value={formData.success_message}
                  onChange={(e) => setFormData({ ...formData, success_message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={2}
                  placeholder="Message shown after successful submission"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Error Message
                </label>
                <textarea
                  value={formData.error_message}
                  onChange={(e) => setFormData({ ...formData, error_message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={2}
                  placeholder="Message shown if submission fails"
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">Next Steps</h3>
                <p className="text-sm text-blue-700">
                  After creating the form, you'll be able to add fields by selecting elements from the library. 
                  You can reuse existing elements like text inputs, dropdowns, date pickers, and more.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
