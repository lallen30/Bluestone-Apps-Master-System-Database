'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { reportsAPI, appsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { FileBarChart, Settings, Eye, AlertCircle, LayoutDashboard, ArrowRight } from 'lucide-react';

interface ReportScreen {
  id: number;
  name: string;
  screen_key: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  config_id: number | null;
  report_name: string | null;
  config_active: boolean | null;
  submission_count: number;
  allowed_roles: number[];
  edit_roles: number[];
}

export default function ReportsPage() {
  const router = useRouter();
  const params = useParams();
  const appId = parseInt(params.id as string);
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [appName, setAppName] = useState('');
  const [reportScreens, setReportScreens] = useState<ReportScreen[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Access is checked via allowed_roles in the API response
    // Master Admin always has access, other roles are checked against report config
    fetchData();
  }, [user, isAuthenticated, appId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch app details
      const appResponse = await appsAPI.getById(appId);
      setAppName(appResponse.data?.name || 'App');

      // Fetch report screens
      const reportsResponse = await reportsAPI.getReportScreens(appId);
      setReportScreens(reportsResponse.data || []);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError(err.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout appId={params.id as string} appName={appName || 'Loading...'}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading reports...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout appId={params.id as string} appName={appName}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">
            View and configure reports for screens marked as "Report"
          </p>
        </div>

        {/* Dashboard Reports Card */}
        <div 
          onClick={() => router.push(`/app/${appId}/reports/dashboard`)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-6 cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Dashboard Reports</h2>
                <p className="text-blue-100">View analytics, listings, users, and inquiry reports</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!error && reportScreens.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FileBarChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Report Screens</h2>
            <p className="text-gray-500 mb-4">
              No screens have been marked as reports yet.
            </p>
            <p className="text-sm text-gray-400">
              To create a report, go to Master Screens, edit a screen, and check the "Report" checkbox.
            </p>
          </div>
        )}

        {/* Reports Grid */}
        {reportScreens.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportScreens.map((screen) => (
              <div
                key={screen.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileBarChart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {screen.report_name || screen.name}
                        </h3>
                        <p className="text-sm text-gray-500">{screen.screen_key}</p>
                      </div>
                    </div>
                    {screen.config_id ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Configured
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                        Not Configured
                      </span>
                    )}
                  </div>

                  {screen.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {screen.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Category: {screen.category || 'None'}</span>
                    <span>{screen.submission_count} submissions</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/app/${appId}/reports/${screen.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                      View Report
                    </button>
                    {/* Show config button only for Master Admin or users with edit access */}
                    {(user?.role_level === 1 || screen.edit_roles?.includes(user?.role_id || 0)) && (
                      <button
                        onClick={() => router.push(`/app/${appId}/reports/${screen.id}/config`)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        title="Configure Report"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
