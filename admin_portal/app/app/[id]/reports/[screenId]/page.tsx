'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { reportsAPI, appsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { 
  ArrowLeft, Settings, Eye, Edit, Trash2, Download, 
  ChevronLeft, ChevronRight, Search, X, RefreshCw 
} from 'lucide-react';

interface Submission {
  id: number;
  created_at: string;
  updated_at: string;
  user_email: string | null;
  user_name: string;
  fields: Record<string, string>;
}

interface ReportConfig {
  display_columns: string[];
  filter_fields: string[];
  action_buttons: string[];
  view_fields: string[];
  edit_fields: string[];
  show_date_column: boolean;
  show_user_column: boolean;
  column_order: string[] | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ScreenElement {
  id: number;
  field_key: string;
  label: string;
  element_name: string;
  element_type: string;
}

export default function ReportViewPage() {
  const router = useRouter();
  const params = useParams();
  const appId = parseInt(params.id as string);
  const screenId = parseInt(params.screenId as string);
  const { user, isAuthenticated } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [appName, setAppName] = useState('');
  const [reportName, setReportName] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [config, setConfig] = useState<ReportConfig>({
    display_columns: [],
    filter_fields: [],
    action_buttons: ['view'],
    view_fields: [],
    edit_fields: [],
    show_date_column: true,
    show_user_column: true,
    column_order: null,
  });
  const [elements, setElements] = useState<ScreenElement[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [editFields, setEditFields] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Access is checked via allowed_roles in the API response
    // Master Admin always has access, other roles are checked against report config
    fetchInitialData();
  }, [user, isAuthenticated, appId, screenId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Fetch app details
      const appResponse = await appsAPI.getById(appId);
      setAppName(appResponse.data?.name || 'App');

      // Fetch report config to get screen name and elements
      const configResponse = await reportsAPI.getReportConfig(appId, screenId);
      const { screen, elements: screenElements, config: reportConfig } = configResponse.data;
      
      setReportName(reportConfig?.report_name || screen.name);
      setElements(screenElements || []);

      // Fetch report data
      await fetchReportData(1, {});
    } catch (err: any) {
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportData = async (page: number, filterParams: Record<string, string>) => {
    try {
      const response = await reportsAPI.getReportData(appId, screenId, {
        page,
        sort_order: sortOrder,
        ...filterParams,
      });

      setSubmissions(response.data.submissions || []);
      setPagination(response.data.pagination);
      setConfig(response.data.config);
    } catch (err: any) {
      console.error('Error fetching report data:', err);
    }
  };

  const handleSearch = () => {
    setActiveFilters(filters);
    fetchReportData(1, filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setActiveFilters({});
    fetchReportData(1, {});
  };

  const handlePageChange = (newPage: number) => {
    fetchReportData(newPage, activeFilters);
  };

  const handleRefresh = () => {
    fetchReportData(pagination.page, activeFilters);
  };

  const handleView = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };

  const handleEdit = (submission: Submission) => {
    setEditingSubmission(submission);
    setEditFields({ ...submission.fields });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSubmission) return;
    
    try {
      setSaving(true);
      await reportsAPI.updateSubmission(appId, screenId, editingSubmission.id, editFields);
      setShowEditModal(false);
      setEditingSubmission(null);
      fetchReportData(pagination.page, activeFilters);
    } catch (err: any) {
      console.error('Error updating submission:', err);
      alert('Failed to update submission');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (submission: Submission) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      await reportsAPI.deleteSubmission(appId, screenId, submission.id);
      fetchReportData(pagination.page, activeFilters);
    } catch (err: any) {
      console.error('Error deleting submission:', err);
      alert('Failed to delete submission');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await reportsAPI.exportReportData(appId, screenId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${screenId}_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Error exporting report:', err);
      alert('Failed to export report');
    }
  };

  const getFieldLabel = (fieldKey: string): string => {
    const element = elements.find(el => el.field_key === fieldKey);
    return element?.label || fieldKey;
  };

  if (loading) {
    return (
      <AppLayout appId={params.id as string} appName={appName || 'Loading...'}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading report...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout appId={params.id as string} appName={appName}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/app/${appId}/reports`)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{reportName}</h1>
              <p className="text-gray-600">{pagination.total} total submissions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            {config.action_buttons.includes('export') && (
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            )}
            <button
              onClick={() => router.push(`/app/${appId}/reports/${screenId}/config`)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Settings className="w-4 h-4" />
              Configure
            </button>
          </div>
        </div>

        {/* Filters */}
        {config.filter_fields.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-wrap items-end gap-4">
              {config.filter_fields.map((fieldKey) => (
                <div key={fieldKey} className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getFieldLabel(fieldKey)}
                  </label>
                  <input
                    type="text"
                    value={filters[fieldKey] || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                    placeholder={`Search ${getFieldLabel(fieldKey)}...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
                {Object.keys(activeFilters).length > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {(() => {
                    // Use column_order if available, otherwise fall back to default order
                    const orderedColumns = config.column_order || ['_date', '_user', ...config.display_columns];
                    return orderedColumns.map((columnKey) => {
                      const isDate = columnKey === '_date';
                      const isUser = columnKey === '_user';
                      const isSystem = columnKey.startsWith('_');
                      
                      // Check visibility
                      if (isDate && !config.show_date_column) return null;
                      if (isUser && !config.show_user_column) return null;
                      if (!isSystem && !config.display_columns.includes(columnKey)) return null;
                      
                      const label = isDate ? 'Date' : isUser ? 'User' : getFieldLabel(columnKey);
                      
                      return (
                        <th
                          key={columnKey}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {label}
                        </th>
                      );
                    });
                  })()}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={config.display_columns.length + 1 + (config.show_date_column ? 1 : 0) + (config.show_user_column ? 1 : 0)}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      {(() => {
                        const orderedColumns = config.column_order || ['_date', '_user', ...config.display_columns];
                        return orderedColumns.map((columnKey) => {
                          const isDate = columnKey === '_date';
                          const isUser = columnKey === '_user';
                          const isSystem = columnKey.startsWith('_');
                          
                          // Check visibility
                          if (isDate && !config.show_date_column) return null;
                          if (isUser && !config.show_user_column) return null;
                          if (!isSystem && !config.display_columns.includes(columnKey)) return null;
                          
                          if (isDate) {
                            return (
                              <td key={columnKey} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(submission.created_at).toLocaleDateString()}
                              </td>
                            );
                          }
                          if (isUser) {
                            return (
                              <td key={columnKey} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {submission.user_name}
                              </td>
                            );
                          }
                          return (
                            <td
                              key={columnKey}
                              className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate"
                              title={submission.fields[columnKey] || ''}
                            >
                              {submission.fields[columnKey] || '-'}
                            </td>
                          );
                        });
                      })()}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          {config.action_buttons.includes('view') && (
                            <button
                              onClick={() => handleView(submission)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {config.action_buttons.includes('edit') && (
                            <button
                              onClick={() => handleEdit(submission)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {config.action_buttons.includes('delete') && (
                            <button
                              onClick={() => handleDelete(submission)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t">
              <div className="text-sm text-gray-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Submission Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500">Submitted</span>
                    <p className="font-medium">
                      {new Date(selectedSubmission.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">User</span>
                    <p className="font-medium">{selectedSubmission.user_name}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Form Data</h3>
                  <div className="space-y-3">
                    {Object.entries(selectedSubmission.fields)
                      .filter(([key]) => config.view_fields.length === 0 || config.view_fields.includes(key))
                      .map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-sm text-gray-500">{getFieldLabel(key)}</span>
                        <p className="text-gray-900 whitespace-pre-wrap">{value || '-'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Edit Submission</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingSubmission(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500">Submitted</span>
                    <p className="font-medium">
                      {new Date(editingSubmission.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">User</span>
                    <p className="font-medium">{editingSubmission.user_name}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Edit Form Data</h3>
                  <div className="space-y-4">
                    {Object.entries(editFields)
                      .filter(([key]) => config.edit_fields.length === 0 || config.edit_fields.includes(key))
                      .map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {getFieldLabel(key)}
                        </label>
                        {value && value.length > 100 ? (
                          <textarea
                            value={value}
                            onChange={(e) => setEditFields(prev => ({ ...prev, [key]: e.target.value }))}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => setEditFields(prev => ({ ...prev, [key]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingSubmission(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
