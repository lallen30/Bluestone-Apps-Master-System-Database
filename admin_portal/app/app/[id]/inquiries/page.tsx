'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { realEstateAPI, appsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { 
  MessageSquare, Search, Filter, Eye, Reply, CheckCircle, 
  Clock, Mail, Phone, Home, User, Calendar, X, ArrowLeft
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface Inquiry {
  id: number;
  listing_id: number;
  buyer_id: number;
  agent_id: number | null;
  inquiry_type: string;
  subject: string;
  message: string;
  preferred_contact: string;
  phone_number: string | null;
  status: string;
  response_message: string | null;
  responded_at: string | null;
  created_at: string;
  listing_title: string;
  listing_city: string;
  asking_price: number | null;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  agent_first_name: string | null;
  agent_last_name: string | null;
  agent_email: string | null;
}

interface Stats {
  total: number;
  new_count: string;
  read_count: string;
  responded_count: string;
  closed_count: string;
}

export default function InquiriesPage() {
  const router = useRouter();
  const params = useParams();
  const appId = parseInt(params.id as string);
  const { user, isAuthenticated } = useAuthStore();
  
  const [app, setApp] = useState<any>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Modal state
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (token && !user) return;
    fetchData();
  }, [isAuthenticated, user, appId, router, statusFilter, currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appResponse = await appsAPI.getById(appId);
      setApp(appResponse.data);

      const response = await realEstateAPI.getInquiries(appId, {
        status: statusFilter || undefined,
        page: currentPage,
        per_page: 20
      });

      setInquiries(response.data?.inquiries || []);
      setStats(response.data?.stats || null);
      setTotal(response.data?.pagination?.total || 0);
      setTotalPages(response.data?.pagination?.total_pages || 1);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (inquiry: Inquiry, newStatus: string) => {
    try {
      await realEstateAPI.updateInquiryStatus(appId, inquiry.id, newStatus);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleRespond = async () => {
    if (!selectedInquiry || !responseMessage.trim()) return;
    
    try {
      setResponding(true);
      await realEstateAPI.respondToInquiry(appId, selectedInquiry.id, responseMessage);
      setShowResponseModal(false);
      setResponseMessage('');
      setSelectedInquiry(null);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send response');
    } finally {
      setResponding(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'read': return 'bg-yellow-100 text-yellow-700';
      case 'responded': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getInquiryTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      general: 'General',
      pricing: 'Pricing',
      features: 'Features',
      neighborhood: 'Neighborhood',
      financing: 'Financing',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AppLayout appId={params.id as string} appName={app?.name || 'App'}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/app/${appId}/reports/dashboard`)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                Property Inquiries
              </h1>
              <p className="text-sm text-gray-600">
                Manage buyer inquiries for {app?.name || 'your app'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-gray-500 uppercase">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-blue-600 uppercase">New</p>
              <p className="text-xl font-bold text-blue-600">{stats.new_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-yellow-600 uppercase">Read</p>
              <p className="text-xl font-bold text-yellow-600">{stats.read_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-green-600 uppercase">Responded</p>
              <p className="text-xl font-bold text-green-600">{stats.responded_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-gray-500 uppercase">Closed</p>
              <p className="text-xl font-bold text-gray-500">{stats.closed_count}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">All</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
            </select>
            {statusFilter && (
              <Button onClick={() => setStatusFilter('')} variant="secondary" className="text-sm">
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium">No inquiries found</h3>
              <p className="text-sm text-gray-500">No inquiries match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {inquiry.listing_title}
                        </div>
                        <div className="text-xs text-gray-500">{inquiry.listing_city}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {inquiry.buyer_first_name} {inquiry.buyer_last_name}
                        </div>
                        <div className="text-xs text-gray-500">{inquiry.buyer_email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {getInquiryTypeLabel(inquiry.inquiry_type)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900 truncate max-w-[200px]">
                          {inquiry.subject || '(No subject)'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(inquiry.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {inquiry.status !== 'responded' && inquiry.status !== 'closed' && (
                            <button
                              onClick={() => {
                                setSelectedInquiry(inquiry);
                                setShowResponseModal(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Respond"
                            >
                              <Reply className="h-4 w-4" />
                            </button>
                          )}
                          {inquiry.status === 'new' && (
                            <button
                              onClick={() => handleStatusChange(inquiry, 'read')}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Mark as read"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center">
            <Button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="secondary"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages} ({total} total)
            </span>
            <Button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="secondary"
            >
              Next
            </Button>
          </div>
        )}

        {/* View Inquiry Modal */}
        {selectedInquiry && !showResponseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Inquiry Details</h2>
                <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {/* Property Info */}
                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{selectedInquiry.listing_title}</p>
                    <p className="text-sm text-gray-500">{selectedInquiry.listing_city}</p>
                  </div>
                </div>

                {/* Buyer Info */}
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{selectedInquiry.buyer_first_name} {selectedInquiry.buyer_last_name}</p>
                    <p className="text-sm text-gray-500">{selectedInquiry.buyer_email}</p>
                    {selectedInquiry.phone_number && (
                      <p className="text-sm text-gray-500">{selectedInquiry.phone_number}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Preferred contact: {selectedInquiry.preferred_contact}
                    </p>
                  </div>
                </div>

                {/* Inquiry Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {getInquiryTypeLabel(selectedInquiry.inquiry_type)} Inquiry
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedInquiry.status)}`}>
                      {selectedInquiry.status}
                    </span>
                  </div>
                  {selectedInquiry.subject && (
                    <p className="font-medium mb-2">{selectedInquiry.subject}</p>
                  )}
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                  <p className="text-xs text-gray-400 mt-3">{formatDate(selectedInquiry.created_at)}</p>
                </div>

                {/* Response */}
                {selectedInquiry.response_message && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-700 mb-2">Response</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.response_message}</p>
                    {selectedInquiry.responded_at && (
                      <p className="text-xs text-gray-400 mt-3">
                        Responded on {formatDate(selectedInquiry.responded_at)}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                {selectedInquiry.status !== 'responded' && selectedInquiry.status !== 'closed' && (
                  <Button
                    onClick={() => setShowResponseModal(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Respond
                  </Button>
                )}
                <Button onClick={() => setSelectedInquiry(null)} variant="secondary">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Response Modal */}
        {showResponseModal && selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Respond to Inquiry</h2>
                <p className="text-sm text-gray-500 mt-1">
                  From: {selectedInquiry.buyer_first_name} {selectedInquiry.buyer_last_name}
                </p>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                  <p className="font-medium">{selectedInquiry.subject || 'Inquiry'}</p>
                  <p className="text-gray-600 mt-1 line-clamp-3">{selectedInquiry.message}</p>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your response here..."
                />
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponseMessage('');
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRespond}
                  disabled={!responseMessage.trim() || responding}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {responding ? 'Sending...' : 'Send Response'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
