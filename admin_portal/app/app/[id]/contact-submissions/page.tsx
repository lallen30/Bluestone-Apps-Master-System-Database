'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, formSubmissionsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { 
  Mail, Clock, CheckCircle, XCircle, AlertCircle, 
  Filter, Trash2, Eye, ChevronLeft, ChevronRight,
  MessageSquare, User, Calendar
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface FormSubmission {
  id: number;
  form_id: number;
  user_id: number | null;
  form_data: any;
  submission_ip: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'rejected';
  error_message: string | null;
  submitted_at: string;
  processed_at: string | null;
  form_name: string;
  form_type: string;
  user_first_name: string | null;
  user_last_name: string | null;
  user_email: string | null;
}

interface Stats {
  total_submissions: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  rejected: number;
}

interface Form {
  id: number;
  name: string;
  form_type: string;
}

export default function ContactSubmissionsPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();
  
  const [app, setApp] = useState<any>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [formFilter, setFormFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

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
    fetchForms();
  }, [isAuthenticated, user, appId, router, statusFilter, formFilter, dateFrom, dateTo, currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appResponse = await appsAPI.getById(parseInt(appId));
      setApp(appResponse.data);

      const submissionsResponse = await formSubmissionsAPI.getAllSubmissions(parseInt(appId), {
        status: statusFilter || undefined,
        form_id: formFilter ? parseInt(formFilter) : undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        page: currentPage,
        per_page: 20
      });

      setSubmissions(submissionsResponse.data?.submissions || []);
      setStats(submissionsResponse.data?.stats || null);
      setTotal(submissionsResponse.data?.pagination?.total || 0);
      setTotalPages(submissionsResponse.data?.pagination?.total_pages || 1);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchForms = async () => {
    try {
      const response = await formSubmissionsAPI.getFormsList(parseInt(appId));
      setForms(response.data || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const clearFilters = () => {
    setStatusFilter('');
    setFormFilter('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const handleStatusChange = async (submissionId: number, newStatus: string) => {
    try {
      await formSubmissionsAPI.updateStatus(parseInt(appId), submissionId, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (submissionId: number) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      await formSubmissionsAPI.deleteSubmission(parseInt(appId), submissionId);
      fetchData();
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderFormData = (formData: any) => {
    if (!formData) return null;
    
    try {
      const data = typeof formData === 'string' ? JSON.parse(formData) : formData;
      return (
        <div className="space-y-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 capitalize">
                {key.replace(/_/g, ' ')}
              </span>
              <span className="text-sm text-gray-900">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
      );
    } catch {
      return <span className="text-gray-500">Unable to parse form data</span>;
    }
  };

  if (loading && !app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AppLayout appId={appId} appName={app?.name || 'Loading...'}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-gray-600 mt-1">View and manage form submissions from your app</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-500">Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_submissions}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-500">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-500">Processing</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.processing}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-500">Completed</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-500">Failed</span>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.failed}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-500">Rejected</span>
              </div>
              <p className="text-2xl font-bold text-gray-600 mt-1">{stats.rejected}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form</label>
              <select
                value={formFilter}
                onChange={(e) => { setFormFilter(e.target.value); setCurrentPage(1); }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Forms</option>
                {forms.map(form => (
                  <option key={form.id} value={form.id}>{form.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-end">
              <Button variant="secondary" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No submissions found</p>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Form
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
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
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {formatDate(submission.submitted_at)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {submission.form_name || 'Unknown Form'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.user_email ? (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {submission.user_first_name} {submission.user_last_name}
                              </div>
                              <div className="text-sm text-gray-500">{submission.user_email}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Guest</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(submission.status)}`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(submission.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, total)} of {total} submissions
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Detail Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Submission Details</h2>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Submitted</span>
                    <p className="text-gray-900">{formatDate(selectedSubmission.submitted_at)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Form</span>
                    <p className="text-gray-900">{selectedSubmission.form_name || 'Unknown'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <div className="mt-1">
                      <select
                        value={selectedSubmission.status}
                        onChange={(e) => handleStatusChange(selectedSubmission.id, e.target.value)}
                        className={`px-2 py-1 text-sm font-semibold rounded-full border-0 ${getStatusBadge(selectedSubmission.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">IP Address</span>
                    <p className="text-gray-900">{selectedSubmission.submission_ip || 'N/A'}</p>
                  </div>
                </div>

                {/* User Info */}
                {selectedSubmission.user_email && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">User Information</h3>
                    <p className="text-gray-900">
                      {selectedSubmission.user_first_name} {selectedSubmission.user_last_name}
                    </p>
                    <p className="text-gray-600">{selectedSubmission.user_email}</p>
                  </div>
                )}

                {/* Form Data */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Form Data</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {renderFormData(selectedSubmission.form_data)}
                  </div>
                </div>

                {/* Error Message */}
                {selectedSubmission.error_message && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-red-500 mb-2">Error Message</h3>
                    <p className="text-red-600 bg-red-50 rounded-lg p-4">
                      {selectedSubmission.error_message}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <Button
                  variant="danger"
                  onClick={() => handleDelete(selectedSubmission.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button onClick={() => setSelectedSubmission(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
