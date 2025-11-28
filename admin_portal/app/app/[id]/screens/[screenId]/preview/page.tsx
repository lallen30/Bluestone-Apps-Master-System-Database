'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, appScreensAPI } from '@/lib/api';
import { ArrowLeft, Monitor, Smartphone, Tablet, Monitor as Desktop, RotateCcw, ExternalLink } from 'lucide-react';
import Icon from '@mdi/react';
import * as mdiIcons from '@mdi/js';

// Convert icon name to mdi path key
const toMdiKey = (iconName: string): string => {
  if (!iconName) return '';
  return 'mdi' + iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

const getMdiPath = (iconName: string): string | null => {
  if (!iconName) return null;
  const key = toMdiKey(iconName);
  return (mdiIcons as any)[key] || null;
};

type DeviceType = 'phone' | 'tablet' | 'desktop';

interface ScreenElement {
  id: number;
  element_name: string;
  element_type: string;
  display_order: number;
  config: any;
}

export default function ScreenPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;
  const screenId = params.screenId as string;
  const { user, isAuthenticated } = useAuthStore();
  
  const [app, setApp] = useState<any>(null);
  const [screen, setScreen] = useState<any>(null);
  const [elements, setElements] = useState<ScreenElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [deviceType, setDeviceType] = useState<DeviceType>('phone');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

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
  }, [isAuthenticated, user, router, appId, screenId]);

  const fetchData = async () => {
    try {
      const [appResponse, screenResponse] = await Promise.all([
        appsAPI.getById(parseInt(appId)),
        appScreensAPI.getById(parseInt(screenId))
      ]);
      
      setApp(appResponse.data);
      setScreen(screenResponse.data);
      setElements(screenResponse.data?.elements || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceSize = () => {
    const isLandscape = orientation === 'landscape';
    switch (deviceType) {
      case 'phone':
        return isLandscape 
          ? { width: 'w-[667px]', height: 'h-[375px]' }
          : { width: 'w-[375px]', height: 'h-[667px]' };
      case 'tablet':
        return isLandscape 
          ? { width: 'w-[1024px]', height: 'h-[768px]' }
          : { width: 'w-[768px]', height: 'h-[1024px]' };
      case 'desktop':
        return { width: 'w-[1280px]', height: 'h-[800px]' };
    }
  };

  const renderElement = (element: ScreenElement) => {
    const config = element.config || {};
    
    switch (element.element_type) {
      case 'heading':
        return (
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {config.text || 'Heading'}
          </h2>
        );
      case 'paragraph':
        return (
          <p className="text-gray-600 mb-3">
            {config.text || 'Paragraph text goes here...'}
          </p>
        );
      case 'text_field':
      case 'form-textbox':
        return (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {config.label || element.element_name}
            </label>
            <input
              type="text"
              placeholder={config.placeholder || 'Enter text...'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              disabled
            />
          </div>
        );
      case 'text_area':
        return (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {config.label || element.element_name}
            </label>
            <textarea
              placeholder={config.placeholder || 'Enter text...'}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              disabled
            />
          </div>
        );
      case 'button':
        return (
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mb-3">
            {config.text || config.label || 'Button'}
          </button>
        );
      case 'image':
      case 'image_display':
        return (
          <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
            <span className="text-gray-400">Image Placeholder</span>
          </div>
        );
      case 'divider':
        return <hr className="my-4 border-gray-200" />;
      case 'spacer':
        return <div className="h-4" />;
      default:
        return (
          <div className="p-3 bg-gray-100 rounded-lg mb-3 text-sm text-gray-600">
            {element.element_name} ({element.element_type})
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading preview...</div>
      </div>
    );
  }

  if (!screen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Screen not found</h2>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const deviceSize = getDeviceSize();
  const iconPath = getMdiPath(screen.icon);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-white">{screen.name}</h1>
              <p className="text-sm text-gray-400">Preview Mode</p>
            </div>
          </div>
          
          {/* Device Controls */}
          <div className="flex items-center gap-4">
            {/* Device Type */}
            <div className="flex items-center bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setDeviceType('phone')}
                className={`p-2 rounded ${deviceType === 'phone' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Phone"
              >
                <Smartphone className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDeviceType('tablet')}
                className={`p-2 rounded ${deviceType === 'tablet' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Tablet"
              >
                <Tablet className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDeviceType('desktop')}
                className={`p-2 rounded ${deviceType === 'desktop' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Desktop"
              >
                <Desktop className="w-5 h-5" />
              </button>
            </div>
            
            {/* Orientation (not for desktop) */}
            {deviceType !== 'desktop' && (
              <button
                onClick={() => setOrientation(o => o === 'portrait' ? 'landscape' : 'portrait')}
                className="p-2 bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                title="Rotate"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
            
            {/* Edit Link */}
            <button
              onClick={() => router.push(`/app/${appId}/screens/${screenId}`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              Edit Screen
            </button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex items-center justify-center p-8 min-h-[calc(100vh-80px)] overflow-auto">
        <div 
          className={`${deviceSize.width} ${deviceSize.height} bg-gray-800 rounded-[2.5rem] p-3 shadow-2xl transition-all duration-300`}
          style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Device Frame */}
          <div className="bg-white rounded-[2rem] h-full overflow-hidden flex flex-col">
            {/* Status Bar */}
            <div className="h-8 bg-gray-100 flex items-center justify-between px-6 flex-shrink-0">
              <span className="text-xs text-gray-600">9:41</span>
              <div className="w-20 h-5 bg-black rounded-full"></div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 bg-gray-400 rounded-sm"></div>
                <div className="w-4 h-2 bg-gray-400 rounded-sm"></div>
                <div className="w-6 h-3 bg-gray-400 rounded-sm"></div>
              </div>
            </div>
            
            {/* Header Bar */}
            <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <h2 className="font-semibold text-gray-900">{screen.name}</h2>
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            </div>
            
            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {elements.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
                    {iconPath ? (
                      <Icon path={iconPath} size={2} className="text-blue-600" />
                    ) : (
                      <Monitor className="w-10 h-10 text-blue-600" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{screen.name}</h3>
                  <p className="text-sm text-gray-500">No elements added yet</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Add elements to see them in the preview
                  </p>
                </div>
              ) : (
                <div>
                  {elements
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((element) => (
                      <div key={element.id}>
                        {renderElement(element)}
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            {/* Bottom Navigation Bar */}
            <div className="h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4 flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
                <span className="text-xs text-blue-600 mt-1">Home</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <span className="text-xs text-gray-400 mt-1">Search</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <span className="text-xs text-gray-400 mt-1">Profile</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <span className="text-xs text-gray-400 mt-1">Settings</span>
              </div>
            </div>
            
            {/* Home Indicator */}
            <div className="h-6 bg-white flex items-center justify-center flex-shrink-0">
              <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
