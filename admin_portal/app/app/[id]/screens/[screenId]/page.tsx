'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, appScreensAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { ArrowLeft, Save, Monitor } from 'lucide-react';

export default function EditScreenContent() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;
  const screenId = params.screenId as string;
  const { user, isAuthenticated } = useAuthStore();
  const [app, setApp] = useState<any>(null);
  const [screen, setScreen] = useState<any>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      setScreen(screenResponse.data.screen);
      setElements(screenResponse.data.elements || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
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
            onClick={() => alert('Save functionality coming soon!')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Save className="w-4 h-4" />
            Save Changes
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
                      {element.label}
                      {element.is_required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {element.element_type === 'text_field' && (
                      <input
                        type="text"
                        placeholder={element.placeholder || ''}
                        defaultValue={element.content_value || element.default_value || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'text_area' && (
                      <textarea
                        placeholder={element.placeholder || ''}
                        defaultValue={element.content_value || element.default_value || ''}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly={element.is_readonly}
                      />
                    )}
                    {element.element_type === 'heading' && (
                      <input
                        type="text"
                        placeholder="Enter heading text"
                        defaultValue={element.content_value || element.default_value || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-xl font-bold"
                      />
                    )}
                    {element.element_type === 'paragraph' && (
                      <textarea
                        placeholder="Enter paragraph text"
                        defaultValue={element.content_value || element.default_value || ''}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    )}
                    {!['text_field', 'text_area', 'heading', 'paragraph'].includes(element.element_type) && (
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

        {/* Coming Soon Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Full content editing functionality is under development. 
            Currently showing read-only preview of screen elements.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
