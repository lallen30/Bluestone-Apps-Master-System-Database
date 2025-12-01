'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, permissionsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { Settings as SettingsIcon, Save, CreditCard } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AppSettings() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingApp, setSavingApp] = useState(false);
  const [savingStripe, setSavingStripe] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string; section: string } | null>(null);

  // App info form
  const [appForm, setAppForm] = useState({
    name: '',
    description: '',
  });

  // Stripe form
  const [stripeForm, setStripeForm] = useState({
    stripe_publishable_key: '',
    stripe_secret_key: '',
  });

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
  }, [isAuthenticated, user, params.id, router]);

  const fetchData = async () => {
    try {
      const appId = parseInt(params.id as string);
      
      // Fetch app details
      const appResponse = await appsAPI.getById(appId);
      const appData = appResponse.data;
      setApp(appData);

      // Initialize forms with app data
      setAppForm({
        name: appData.name || '',
        description: appData.description || '',
      });

      // Parse settings if they exist
      const settings = appData.settings ? (typeof appData.settings === 'string' ? JSON.parse(appData.settings) : appData.settings) : {};
      setStripeForm({
        stripe_publishable_key: settings.stripe_publishable_key || '',
        stripe_secret_key: settings.stripe_secret_key || '',
      });

      // Check user permissions
      if (user?.id) {
        // Master Admins have full access to all apps
        if (user.role_level !== 1) {
          const permsResponse = await permissionsAPI.getUserPermissions(user.id);
          const userPerms = permsResponse.data?.find((p: any) => p.app_id === appId);
          
          if (!userPerms || !userPerms.can_manage_settings) {
            router.push(`/app/${appId}`);
            return;
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSaveAppInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingApp(true);
    setMessage(null);

    try {
      await appsAPI.update(parseInt(params.id as string), {
        name: appForm.name,
        description: appForm.description,
      });

      setApp({ ...app, name: appForm.name, description: appForm.description });
      setMessage({ type: 'success', text: 'App information saved successfully!', section: 'app' });
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save app information',
        section: 'app'
      });
    } finally {
      setSavingApp(false);
    }
  };

  const handleSaveStripe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStripe(true);
    setMessage(null);

    try {
      // Get existing settings and merge with stripe keys
      const existingSettings = app.settings ? (typeof app.settings === 'string' ? JSON.parse(app.settings) : app.settings) : {};
      const newSettings = {
        ...existingSettings,
        stripe_publishable_key: stripeForm.stripe_publishable_key,
        stripe_secret_key: stripeForm.stripe_secret_key,
      };

      await appsAPI.updateSettings(parseInt(params.id as string), newSettings);

      setApp({ ...app, settings: newSettings });
      setMessage({ type: 'success', text: 'Stripe settings saved successfully!', section: 'stripe' });
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save Stripe settings',
        section: 'stripe'
      });
    } finally {
      setSavingStripe(false);
    }
  };

  if (loading) {
    return (
      <AppLayout appId={params.id as string} appName={app?.name || 'Loading...'}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!app) {
    return null;
  }

  return (
    <AppLayout appId={params.id as string} appName={app.name}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure settings for {app.name}
          </p>
        </div>

        <div className="max-w-2xl space-y-8">
          {/* App Information Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">App Information</h2>
                <p className="text-sm text-gray-500">Basic app details</p>
              </div>
            </div>

            {message?.section === 'app' && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSaveAppInfo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  App Name
                </label>
                <input
                  type="text"
                  value={appForm.name}
                  onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={appForm.description}
                  onChange={(e) => setAppForm({ ...appForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter app description..."
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={savingApp}>
                  <Save className="w-4 h-4 mr-2" />
                  {savingApp ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>

          {/* Stripe Settings Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Stripe Settings</h2>
                <p className="text-sm text-gray-500">Payment processing configuration</p>
              </div>
            </div>

            {message?.section === 'stripe' && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSaveStripe} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publishable Key
                </label>
                <input
                  type="text"
                  value={stripeForm.stripe_publishable_key}
                  onChange={(e) => setStripeForm({ ...stripeForm, stripe_publishable_key: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                  placeholder="pk_live_..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secret Key
                </label>
                <input
                  type="password"
                  value={stripeForm.stripe_secret_key}
                  onChange={(e) => setStripeForm({ ...stripeForm, stripe_secret_key: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                  placeholder="sk_live_..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Your secret key is stored securely and never exposed to the client.
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={savingStripe}>
                  <Save className="w-4 h-4 mr-2" />
                  {savingStripe ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
