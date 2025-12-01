'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, appScreensAPI, appScreenElementsAPI, uploadAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { ArrowLeft, Save, Monitor, Upload, X, Image as ImageIcon, Settings } from 'lucide-react';
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
  const [contentOptions, setContentOptions] = useState<{[key: string]: any}>({});
  const [availableScreens, setAvailableScreens] = useState<any[]>([]);
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
      console.log('🔵 NEW CODE: fetchData started');
      
      // Fetch app details
      const appResponse = await appsAPI.getById(parseInt(appId));
      setApp(appResponse.data);

      // Fetch screen with content
      const screenResponse = await appScreensAPI.getAppScreenContent(parseInt(appId), parseInt(screenId));
      setScreen(screenResponse.data);

      // Fetch available screens for button navigation
      const screensResponse = await appScreensAPI.getAppScreens(parseInt(appId));
      setAvailableScreens(screensResponse.data || []);
      
      // Fetch elements with app-specific overrides and custom elements
      const elementsResponse = await appScreenElementsAPI.getAppScreenElements(parseInt(appId), parseInt(screenId));
      const elementsData = elementsResponse.elements || [];
      
      console.log('🔵 NEW CODE: Got elements, count:', elementsData.length);
      console.log('🔵 NEW CODE: Elements data:', JSON.stringify(elementsData, null, 2));
      
      // Parse config if it's a string - WRAPPED IN TRY-CATCH
      const parsedElements = elementsData.map((el: any, index: number) => {
        try {
          if (el.config) {
            console.log(`🔵 Element ${index} config type:`, typeof el.config, 'value:', el.config);
            
            if (typeof el.config === 'string') {
              // Skip if it's the bad "[object Object]" string
              if (el.config === '[object Object]' || el.config.includes('[object Object]')) {
                console.warn('⚠️ Skipping bad config for element', el.id, el.config);
                el.config = null;
              } else {
                try {
                  el.config = JSON.parse(el.config);
                  console.log('✅ Parsed config successfully for element', el.id);
                } catch (e) {
                  console.error('❌ Error parsing config for element', el.id, ':', el.config, e);
                  el.config = null;
                }
              }
            } else {
              console.log('✅ Config already object for element', el.id);
            }
          }
        } catch (mapError) {
          console.error('❌ Error in map for element', index, mapError);
          el.config = null;
        }
        return el;
      });
      
      console.log('🔵 NEW CODE: Parsed elements successfully');
      
      setElements(parsedElements);
      
      // Initialize content values - use element_instance_id for master elements, custom_element_id for custom
      const initialValues: {[key: string]: any} = {};
      const initialOptions: {[key: string]: any} = {};
      parsedElements.forEach((el: any) => {
        // Use a unique key: element_instance_id for master elements, 'custom_' + custom_element_id for custom
        const key = el.is_custom ? `custom_${el.custom_element_id}` : el.element_instance_id;
        initialValues[key] = el.content_value || el.default_value || '';
        initialOptions[key] = el.content_options || {};
      });
      setContentValues(initialValues);
      setContentOptions(initialOptions);
      
      console.log('🔵 NEW CODE: fetchData completed successfully');
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
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
      
      // Prepare content data - handle both master elements and custom elements
      const contentData = elements.map(element => {
        const key = element.is_custom ? `custom_${element.custom_element_id}` : element.element_instance_id;
        return {
          element_instance_id: element.is_custom ? null : element.element_instance_id,
          custom_element_id: element.is_custom ? element.custom_element_id : null,
          content_value: contentValues[key] || null,
          options: contentOptions[key] || null
        };
      });

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
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/app/${appId}/screens/${screenId}/elements`)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Settings className="w-4 h-4" />
              Customize Elements
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
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
              {elements.map((element: any) => {
                // Use unique key for both master and custom elements
                const elementKey = element.is_custom ? `custom_${element.custom_element_id}` : element.element_instance_id;
                return (
                <div key={elementKey} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {(element.label && element.label !== '0') ? element.label : (element.element_name || element.field_key)}
                      {element.is_required === 1 && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {element.element_type === 'text_field' && (
                      <input
                        type="text"
                        placeholder={element.placeholder || ''}
                        value={contentValues[elementKey] || ''}
                        onChange={(e) => handleContentChange(elementKey, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                        disabled={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'email_input' && (
                      <input
                        type="email"
                        placeholder={element.placeholder || 'email@example.com'}
                        value={contentValues[elementKey] || ''}
                        onChange={(e) => handleContentChange(elementKey, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                        disabled={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'phone_input' && (
                      <input
                        type="tel"
                        placeholder={element.placeholder || '(555) 123-4567'}
                        value={contentValues[elementKey] || ''}
                        onChange={(e) => handleContentChange(elementKey, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                        disabled={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'url_input' && (
                      <input
                        type="url"
                        placeholder={element.placeholder || 'https://example.com'}
                        value={contentValues[elementKey] || ''}
                        onChange={(e) => handleContentChange(elementKey, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                        disabled={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'number_input' && (
                      <input
                        type="number"
                        placeholder={element.placeholder || '0'}
                        value={contentValues[elementKey] || ''}
                        onChange={(e) => handleContentChange(elementKey, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                        disabled={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'date_picker' && (
                      <input
                        type="date"
                        value={contentValues[elementKey] || ''}
                        onChange={(e) => handleContentChange(elementKey, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                        disabled={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'text_area' && (
                      <textarea
                        placeholder={element.placeholder || ''}
                        value={contentValues[elementKey] || ''}
                        onChange={(e) => handleContentChange(elementKey, e.target.value)}
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
                        value={contentValues[elementKey] || ''}
                        onChange={(e) => handleContentChange(elementKey, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-xl font-bold"
                      />
                    )}
                    {element.element_type === 'paragraph' && (
                      <textarea
                        placeholder="Enter paragraph text"
                        value={contentValues[elementKey] || ''}
                        onChange={(e) => handleContentChange(elementKey, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    )}
                    {(element.element_type === 'rich_text_display' || element.element_type === 'rich_text_editor') && (
                      <div>
                        <div className="rich-text-editor">
                          <ReactQuill
                            theme="snow"
                            value={contentValues[elementKey] || ''}
                            onChange={(value) => handleContentChange(elementKey, value)}
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
                          value={contentValues[elementKey] || ''}
                          onChange={(e) => handleContentChange(elementKey, e.target.value)}
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
                          checked={contentValues[elementKey] === 'true' || contentValues[elementKey] === true}
                          onChange={(e) => handleContentChange(elementKey, e.target.checked.toString())}
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
                              name={`radio_${element.element_instance_id}`}
                              value={option.value}
                              checked={contentValues[elementKey] === option.value}
                              onChange={(e) => handleContentChange(elementKey, e.target.value)}
                              className="border-gray-300"
                              disabled={element.is_readonly}
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {element.element_type === 'image_display' && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="Image URL or upload below"
                            value={contentValues[elementKey] || element.config?.imageUrl || ''}
                            onChange={(e) => handleContentChange(elementKey, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            disabled={element.is_readonly}
                          />
                          <label className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white cursor-pointer transition-colors">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm font-medium">Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const response = await uploadAPI.uploadImage(
                                      file, 
                                      app?.id, 
                                      app?.name
                                    );
                                    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${response.data.url}`;
                                    handleContentChange(elementKey, imageUrl);
                                  } catch (error) {
                                    console.error('Upload error:', error);
                                    alert('Failed to upload image. Please try again.');
                                  }
                                }
                              }}
                              disabled={element.is_readonly}
                            />
                          </label>
                        </div>
                        {(contentValues[elementKey] || element.config?.imageUrl) && (
                          <div className="mt-2 border border-gray-200 rounded-lg p-2 bg-gray-50 relative flex justify-center">
                            <img
                              src={contentValues[elementKey] || element.config?.imageUrl}
                              alt={element.config?.altText || 'Preview'}
                              className="h-auto object-contain"
                              style={{
                                maxHeight: '200px',
                                maxWidth: '100%'
                              }}
                            />
                            {!element.is_readonly && (
                              <button
                                onClick={() => handleContentChange(elementKey, '')}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                title="Remove image"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {element.element_type === 'image_upload' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary cursor-pointer transition-colors bg-gray-50 hover:bg-gray-100">
                            <Upload className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              {contentValues[elementKey] ? 'Change Image' : 'Upload Image'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const response = await uploadAPI.uploadImage(
                                      file, 
                                      app?.id, 
                                      app?.name
                                    );
                                    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${response.data.url}`;
                                    handleContentChange(elementKey, imageUrl);
                                  } catch (error) {
                                    console.error('Upload error:', error);
                                    alert('Failed to upload image. Please try again.');
                                  }
                                }
                              }}
                              disabled={element.is_readonly}
                            />
                          </label>
                          {contentValues[elementKey] && (
                            <button
                              onClick={() => handleContentChange(elementKey, '')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Remove image"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        {contentValues[elementKey] && (
                          <div className="mt-2 border border-gray-200 rounded-lg p-2 bg-gray-50 flex justify-center">
                            <img
                              src={contentValues[elementKey]}
                              alt="Uploaded image"
                              className="h-auto object-contain rounded"
                              style={{ maxHeight: '200px', maxWidth: '100%' }}
                            />
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          Max file size: 5MB • Supported formats: JPG, PNG, GIF, WebP
                        </p>
                      </div>
                    )}
                    {element.element_type === 'button' && (
                      <div className="space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                          <input
                            type="text"
                            placeholder="Button text"
                            value={contentValues[elementKey] || element.label || ''}
                            onChange={(e) => handleContentChange(elementKey, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            disabled={element.is_readonly}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
                          <select
                            value={contentOptions[elementKey]?.actionType || element.config?.actionType || 'none'}
                            onChange={(e) => {
                              setContentOptions(prev => ({
                                ...prev,
                                [elementKey]: {
                                  ...prev[elementKey],
                                  actionType: e.target.value,
                                  url: e.target.value === 'url' ? prev[elementKey]?.url : undefined,
                                  screenId: e.target.value === 'screen' ? prev[elementKey]?.screenId : undefined
                                }
                              }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            disabled={element.is_readonly}
                          >
                            <option value="none">No Action</option>
                            <option value="url">Open URL</option>
                            <option value="screen">Navigate to Screen</option>
                          </select>
                        </div>

                        {(contentOptions[elementKey]?.actionType || element.config?.actionType) === 'url' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                            <input
                              type="url"
                              placeholder="https://example.com"
                              value={contentOptions[elementKey]?.url || element.config?.url || ''}
                              onChange={(e) => {
                                setContentOptions(prev => ({
                                  ...prev,
                                  [elementKey]: {
                                    ...prev[elementKey],
                                    url: e.target.value
                                  }
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              disabled={element.is_readonly}
                            />
                          </div>
                        )}

                        {(contentOptions[elementKey]?.actionType || element.config?.actionType) === 'screen' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Screen</label>
                            <select
                              value={contentOptions[elementKey]?.screenId || element.config?.screenId || ''}
                              onChange={(e) => {
                                setContentOptions(prev => ({
                                  ...prev,
                                  [elementKey]: {
                                    ...prev[elementKey],
                                    screenId: parseInt(e.target.value) || undefined
                                  }
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              disabled={element.is_readonly}
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

                        <div className="mt-2">
                          <button
                            type="button"
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            disabled
                          >
                            {contentValues[elementKey] || element.label || 'Button'}
                          </button>
                          <p className="text-xs text-gray-500 mt-1">Preview (button is disabled in editor)</p>
                        </div>
                      </div>
                    )}
                    {element.element_type === 'link' && (
                      <div className="space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
                          <input
                            type="text"
                            placeholder="Link text"
                            value={contentValues[elementKey] || element.label || ''}
                            onChange={(e) => handleContentChange(elementKey, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            disabled={element.is_readonly}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
                          <select
                            value={contentOptions[elementKey]?.actionType || element.config?.actionType || 'url'}
                            onChange={(e) => {
                              setContentOptions(prev => ({
                                ...prev,
                                [elementKey]: {
                                  ...prev[elementKey],
                                  actionType: e.target.value,
                                  url: e.target.value === 'url' ? prev[elementKey]?.url : undefined,
                                  screenId: e.target.value === 'screen' ? prev[elementKey]?.screenId : undefined
                                }
                              }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            disabled={element.is_readonly}
                          >
                            <option value="url">Open URL</option>
                            <option value="screen">Navigate to Screen</option>
                          </select>
                        </div>

                        {(!contentOptions[elementKey]?.actionType || contentOptions[elementKey]?.actionType === 'url' || (!contentOptions[elementKey] && (!element.config?.actionType || element.config?.actionType === 'url'))) && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                            <input
                              type="url"
                              placeholder="https://example.com"
                              value={contentOptions[elementKey]?.url || element.config?.url || ''}
                              onChange={(e) => {
                                setContentOptions(prev => ({
                                  ...prev,
                                  [elementKey]: {
                                    ...prev[elementKey],
                                    url: e.target.value
                                  }
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              disabled={element.is_readonly}
                            />
                          </div>
                        )}

                        {(contentOptions[elementKey]?.actionType || element.config?.actionType) === 'screen' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Screen</label>
                            <select
                              value={contentOptions[elementKey]?.screenId || element.config?.screenId || ''}
                              onChange={(e) => {
                                setContentOptions(prev => ({
                                  ...prev,
                                  [elementKey]: {
                                    ...prev[elementKey],
                                    screenId: parseInt(e.target.value) || undefined
                                  }
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              disabled={element.is_readonly}
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

                        <div className="mt-2">
                          <a 
                            href="#" 
                            className="text-primary hover:underline" 
                            onClick={(e) => e.preventDefault()}
                          >
                            {contentValues[elementKey] || element.label || 'Link'}
                          </a>
                          <p className="text-xs text-gray-500 mt-1">Preview (link is disabled in editor)</p>
                        </div>
                      </div>
                    )}
                    {element.element_type === 'property_form' && (
                      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                        {element.form_id ? (
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-sm font-medium text-cyan-900">
                                Linked Form: {element.form_name}
                              </div>
                              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                Auto-linked ✓
                              </span>
                            </div>
                            <div className="text-xs text-cyan-700 mb-3">
                              {element.form_field_count || 0} fields • {element.form_type || 'form'}
                            </div>
                            <div className="bg-white border border-cyan-200 rounded p-3 mb-3">
                              <p className="text-xs text-gray-600 mb-2">
                                <strong>📋 About Form Elements:</strong> This element displays an entire form with {element.form_field_count || 0} fields.
                              </p>
                              <p className="text-xs text-gray-600">
                                <strong>To edit the form fields:</strong> Click "Edit Form Fields" below to add, remove, or modify the fields in this form (title, description, price, etc.)
                              </p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => router.push(`/app/${appId}/forms/${element.form_id}`)}
                                className="text-xs px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700"
                              >
                                📝 View Form Fields →
                              </button>
                              <button
                                onClick={() => router.push(`/master/forms/${element.form_id}`)}
                                className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                ✏️ Edit Master Form →
                              </button>
                              <button
                                onClick={() => router.push(`/master/screens/${screenId}`)}
                                className="text-xs px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                              >
                                🔄 Change Form →
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-cyan-800 mb-2">
                              This element is a form container but no form is linked yet. Forms are automatically linked when you add a property_form element to a screen, but you can manually link one if needed.
                            </p>
                            <button
                              onClick={() => router.push(`/master/screens/${screenId}`)}
                              className="text-xs px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700"
                            >
                              Link a Form Manually →
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {!['text_field', 'text_area', 'heading', 'paragraph', 'rich_text_display', 'rich_text_editor', 'dropdown', 'checkbox', 'radio_button', 'email_input', 'phone_input', 'url_input', 'number_input', 'date_picker', 'image_display', 'image_upload', 'button', 'link', 'property_form'].includes(element.element_type) && (
                      <div className="text-sm text-gray-500 italic">
                        {element.element_type} - Content editing coming soon
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Type: {element.element_type} • Key: {element.field_key}
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </div>

        {/* Save Info */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>Tip:</strong> Make your changes and click "Save Changes" to update the content for this app.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
