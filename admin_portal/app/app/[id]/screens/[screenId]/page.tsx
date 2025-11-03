'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, appScreensAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { ArrowLeft, Save, Monitor } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function EditScreenContent() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;
  const screenId = params.screenId as string;
  const { user, isAuthenticated } = useAuthStore();
  const [app, setApp] = useState<any>(null);
  const [screen, setScreen] = useState<any>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [contentValues, setContentValues] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
  }, [isAuthenticated, user, appId, screenId, router]);

  const fetchData = async () => {
    try {
      // Fetch app details
      const appResponse = await appsAPI.getById(parseInt(appId));
      setApp(appResponse.data);

      // Fetch screen with content
      const screenResponse = await appScreensAPI.getAppScreenContent(parseInt(appId), parseInt(screenId));
      setScreen(screenResponse.data);
      const elementsData = screenResponse.data.elements || [];
      setElements(elementsData);
      
      // Initialize content values
      const initialValues: {[key: string]: any} = {};
      elementsData.forEach((el: any) => {
        initialValues[el.id] = el.content_value || el.default_value || '';
      });
      setContentValues(initialValues);
      
      // Debug: Log elements to see what we're getting
      console.log('Elements data:', elementsData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleContentChange = (elementId: number, value: any) => {
    setContentValues(prev => ({
      ...prev,
      [elementId]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Prepare content data
      const contentData = elements.map(element => ({
        element_instance_id: element.id,
        content_value: contentValues[element.id] || null
      }));

      await appScreensAPI.saveScreenContent(parseInt(appId), parseInt(screenId), contentData);
      
      alert('Content saved successfully!');
      setSaving(false);
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout appId={appId} appName={app?.name || 'Loading...'}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!app || !screen) {
    return null;
  }

  return (
    <AppLayout appId={appId} appName={app.name}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/app/${appId}/screens`)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{screen.name}</h1>
              <p className="text-gray-600 mt-1">{screen.description || 'Edit screen content'}</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Screen Content</h2>
          
          {elements.length === 0 ? (
            <div className="text-center py-12">
              <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Elements</h3>
              <p className="text-gray-500">This screen doesn't have any elements yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {elements.map((element: any) => (
                <div key={element.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {(element.label && element.label !== '0') ? element.label : (element.element_name || element.field_key)}
                      {element.is_required === 1 && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {element.element_type === 'text_field' && (
                      <input
                        type="text"
                        placeholder={element.placeholder || ''}
                        value={contentValues[element.id] || ''}
                        onChange={(e) => handleContentChange(element.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                        disabled={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'email_input' && (
                      <input
                        type="email"
                        placeholder={element.placeholder || 'email@example.com'}
                        value={contentValues[element.id] || ''}
                        onChange={(e) => handleContentChange(element.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                        disabled={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'phone_input' && (
                      <input
                        type="tel"
                        placeholder={element.placeholder || '(555) 123-4567'}
                        value={contentValues[element.id] || ''}
                        onChange={(e) => handleContentChange(element.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                        disabled={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'url_input' && (
                      <input
                        type="url"
                        placeholder={element.placeholder || 'https://example.com'}
                        value={contentValues[element.id] || ''}
                        onChange={(e) => handleContentChange(element.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                        disabled={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'number_input' && (
                      <input
                        type="number"
                        placeholder={element.placeholder || '0'}
                        value={contentValues[element.id] || ''}
                        onChange={(e) => handleContentChange(element.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                        disabled={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'date_picker' && (
                      <input
                        type="date"
                        value={contentValues[element.id] || ''}
                        onChange={(e) => handleContentChange(element.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                        disabled={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'text_area' && (
                      <textarea
                        placeholder={element.placeholder || ''}
                        value={contentValues[element.id] || ''}
                        onChange={(e) => handleContentChange(element.id, e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                        disabled={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'heading' && (
                      <input
                        type="text"
                        placeholder="Enter heading text"
                        value={contentValues[element.id] || ''}
                        onChange={(e) => handleContentChange(element.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-xl font-bold"
                      />
                    )}
                    {element.element_type === 'paragraph' && (
                      <textarea
                        placeholder="Enter paragraph text"
                        value={contentValues[element.id] || ''}
                        onChange={(e) => handleContentChange(element.id, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    )}
                    {(element.element_type === 'rich_text_display' || element.element_type === 'rich_text_editor') && (
                      <div>
                        <div className="rich-text-editor">
                          <ReactQuill
                            theme="snow"
                            value={contentValues[element.id] || ''}
                            onChange={(value) => handleContentChange(element.id, value)}
                            placeholder={element.placeholder || 'Enter formatted content...'}
                            modules={{
                              toolbar: [
                                [{ 'header': [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                [{ 'align': [] }],
                                ['link'],
                                ['clean']
                              ]
                            }}
                            className="bg-white"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          💡 Use the toolbar above to format your content. The content will be saved as HTML.
                        </p>
                        <style jsx global>{`
                          .rich-text-editor .ql-container {
                            min-height: 300px;
                            height: auto;
                          }
                          .rich-text-editor .ql-editor {
                            min-height: 300px;
                          }
                        `}</style>
                      </div>
                    )}
                    {element.element_type === 'dropdown' && (
                      <div>
                        <select
                          value={contentValues[element.id] || ''}
                          onChange={(e) => handleContentChange(element.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          disabled={element.is_readonly}
                        >
                          <option value="">{element.placeholder || 'Select an option...'}</option>
                          {element.config?.options?.map((option: any, idx: number) => (
                            <option key={idx} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {element.element_type === 'checkbox' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={contentValues[element.id] === 'true' || contentValues[element.id] === true}
                          onChange={(e) => handleContentChange(element.id, e.target.checked.toString())}
                          className="rounded border-gray-300"
                          disabled={element.is_readonly}
                        />
                        <span className="text-sm text-gray-700">{element.label}</span>
                      </div>
                    )}
                    {element.element_type === 'radio_button' && (
                      <div className="space-y-2">
                        {element.config?.options?.map((option: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`radio_${element.id}`}
                              value={option.value}
                              checked={contentValues[element.id] === option.value}
                              onChange={(e) => handleContentChange(element.id, e.target.value)}
                              className="border-gray-300"
                              disabled={element.is_readonly}
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {!['text_field', 'text_area', 'heading', 'paragraph', 'rich_text_display', 'rich_text_editor', 'dropdown', 'checkbox', 'radio_button', 'email_input', 'phone_input', 'url_input', 'number_input', 'date_picker'].includes(element.element_type) && (
                      <div className="text-sm text-gray-500 italic">
                        {element.element_type} - Content editing coming soon
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Type: {element.element_type} • Key: {element.field_key}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Info */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>Tip:</strong> Make your changes and click "Save Changes" to update the content for this app.
            Changes are saved per app, so each app can have different content for the same screen.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
