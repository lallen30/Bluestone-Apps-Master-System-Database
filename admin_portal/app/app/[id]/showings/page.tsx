'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { realEstateAPI, appsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { 
  Calendar, Filter, Eye, CheckCircle, XCircle, Clock, 
  MapPin, User, Home, Video, X, AlertCircle, ArrowLeft
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface Showing {
  id: number;
  listing_id: number;
  buyer_id: number;
  agent_id: number | null;
  requested_date: string;
  requested_time: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  duration_minutes: number;
  showing_type: string;
  virtual_link: string | null;
  status: string;
  buyer_notes: string | null;
  agent_notes: string | null;
  feedback: string | null;
  buyer_interest_level: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  listing_title: string;
  listing_city: string;
  listing_address: string | null;
  asking_price: number | null;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  agent_first_name: string | null;
  agent_last_name: string | null;
  agent_email: string | null;
  agent_phone: string | null;
}

interface Stats {
  total: number;
  requested_count: string;
  confirmed_count: string;
  completed_count: string;
  cancelled_count: string;
  no_show_count: string;
}

export default function ShowingsPage() {
  const router = useRouter();
  const params = useParams();
  const appId = parseInt(params.id as string);
  const { user, isAuthenticated } = useAuthStore();
  
  const [app, setApp] = useState<any>(null);
  const [showings, setShowings] = useState<Showing[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Modal state
  const [selectedShowing, setSelectedShowing] = useState<Showing | null>(null);
  const [showActionModal, setShowActionModal] = useState<'confirm' | 'cancel' | 'complete' | null>(null);
  const [actionData, setActionData] = useState({
    scheduled_date: '',
    scheduled_time: '',
    cancellation_reason: '',
    feedback: '',
    buyer_interest_level: ''
  });
  const [processing, setProcessing] = useState(false);

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

      const response = await realEstateAPI.getShowings(appId, {
        status: statusFilter || undefined,
        page: currentPage,
        per_page: 20
      });

      setShowings(response.data?.showings || []);
      setStats(response.data?.stats || null);
      setTotal(response.data?.pagination?.total || 0);
      setTotalPages(response.data?.pagination?.total_pages || 1);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedShowing) return;
    try {
      setProcessing(true);
      await realEstateAPI.confirmShowing(appId, selectedShowing.id, {
        scheduled_date: actionData.scheduled_date || undefined,
        scheduled_time: actionData.scheduled_time || undefined
      });
      closeModal();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to confirm showing');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedShowing) return;
    try {
      setProcessing(true);
      await realEstateAPI.cancelShowing(appId, selectedShowing.id, actionData.cancellation_reason);
      closeModal();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel showing');
    } finally {
      setProcessing(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedShowing) return;
    try {
      setProcessing(true);
      await realEstateAPI.completeShowing(appId, selectedShowing.id, {
        feedback: actionData.feedback || undefined,
        buyer_interest_level: actionData.buyer_interest_level || undefined
      });
      closeModal();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to complete showing');
    } finally {
      setProcessing(false);
    }
  };

  const closeModal = () => {
    setShowActionModal(null);
    setSelectedShowing(null);
    setActionData({
      scheduled_date: '',
      scheduled_time: '',
      cancellation_reason: '',
      feedback: '',
      buyer_interest_level: ''
    });
  };

  const openActionModal = (showing: Showing, action: 'confirm' | 'cancel' | 'complete') => {
    setSelectedShowing(showing);
    setShowActionModal(action);
    if (action === 'confirm') {
      setActionData({
        ...actionData,
        scheduled_date: showing.requested_date?.split('T')[0] || '',
        scheduled_time: showing.requested_time || ''
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-blue-100 text-blue-700';
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-purple-100 text-purple-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'no_show': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getInterestColor = (level: string | null) => {
    switch (level) {
      case 'very_interested': return 'bg-green-100 text-green-700';
      case 'interested': return 'bg-blue-100 text-blue-700';
      case 'maybe': return 'bg-yellow-100 text-yellow-700';
      case 'not_interested': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
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
                <Calendar className="h-6 w-6 text-purple-600" />
                Property Showings
              </h1>
              <p className="text-sm text-gray-600">
                Manage scheduled property viewings for {app?.name || 'your app'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-gray-500 uppercase">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-blue-600 uppercase">Requested</p>
              <p className="text-xl font-bold text-blue-600">{stats.requested_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-green-600 uppercase">Confirmed</p>
              <p className="text-xl font-bold text-green-600">{stats.confirmed_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-purple-600 uppercase">Completed</p>
              <p className="text-xl font-bold text-purple-600">{stats.completed_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-red-600 uppercase">Cancelled</p>
              <p className="text-xl font-bold text-red-600">{stats.cancelled_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-orange-600 uppercase">No Show</p>
              <p className="text-xl font-bold text-orange-600">{stats.no_show_count}</p>
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
              <option value="requested">Requested</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
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
          ) : showings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium">No showings found</h3>
              <p className="text-sm text-gray-500">No showings match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {showings.map((showing) => (
                    <tr key={showing.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {showing.listing_title}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {showing.listing_city}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {showing.buyer_first_name} {showing.buyer_last_name}
                        </div>
                        <div className="text-xs text-gray-500">{showing.buyer_email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">
                          {formatDate(showing.scheduled_date || showing.requested_date)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(showing.scheduled_time || showing.requested_time)}
                          {showing.duration_minutes && ` (${showing.duration_minutes} min)`}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          {showing.showing_type === 'virtual' ? (
                            <><Video className="h-4 w-4" /> Virtual</>
                          ) : showing.showing_type === 'open_house' ? (
                            <><Home className="h-4 w-4" /> Open House</>
                          ) : (
                            <><MapPin className="h-4 w-4" /> In Person</>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(showing.status)}`}>
                          {showing.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {showing.buyer_interest_level ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getInterestColor(showing.buyer_interest_level)}`}>
                            {showing.buyer_interest_level.replace('_', ' ')}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedShowing(showing)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {showing.status === 'requested' && (
                            <button
                              onClick={() => openActionModal(showing, 'confirm')}
                              className="text-green-600 hover:text-green-900"
                              title="Confirm"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {showing.status === 'confirmed' && (
                            <button
                              onClick={() => openActionModal(showing, 'complete')}
                              className="text-purple-600 hover:text-purple-900"
                              title="Mark complete"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {(showing.status === 'requested' || showing.status === 'confirmed') && (
                            <button
                              onClick={() => openActionModal(showing, 'cancel')}
                              className="text-red-600 hover:text-red-900"
                              title="Cancel"
                            >
                              <XCircle className="h-4 w-4" />
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

        {/* View Showing Modal */}
        {selectedShowing && !showActionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Showing Details</h2>
                <button onClick={() => setSelectedShowing(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {/* Property Info */}
                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{selectedShowing.listing_title}</p>
                    <p className="text-sm text-gray-500">{selectedShowing.listing_address}</p>
                    <p className="text-sm text-gray-500">{selectedShowing.listing_city}</p>
                  </div>
                </div>

                {/* Buyer Info */}
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{selectedShowing.buyer_first_name} {selectedShowing.buyer_last_name}</p>
                    <p className="text-sm text-gray-500">{selectedShowing.buyer_email}</p>
                    {selectedShowing.buyer_phone && (
                      <p className="text-sm text-gray-500">{selectedShowing.buyer_phone}</p>
                    )}
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {selectedShowing.showing_type === 'virtual' ? 'Virtual Tour' : 
                       selectedShowing.showing_type === 'open_house' ? 'Open House' : 'In-Person Showing'}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedShowing.status)}`}>
                      {selectedShowing.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Requested</p>
                      <p className="font-medium">
                        {formatDate(selectedShowing.requested_date)}
                        {selectedShowing.requested_time && ` at ${formatTime(selectedShowing.requested_time)}`}
                      </p>
                    </div>
                    {selectedShowing.scheduled_date && (
                      <div>
                        <p className="text-gray-500">Scheduled</p>
                        <p className="font-medium">
                          {formatDate(selectedShowing.scheduled_date)}
                          {selectedShowing.scheduled_time && ` at ${formatTime(selectedShowing.scheduled_time)}`}
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedShowing.buyer_notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-1">Buyer Notes</p>
                      <p className="text-sm text-gray-700">{selectedShowing.buyer_notes}</p>
                    </div>
                  )}
                </div>

                {/* Feedback (if completed) */}
                {selectedShowing.feedback && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-purple-700">Showing Feedback</p>
                      {selectedShowing.buyer_interest_level && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getInterestColor(selectedShowing.buyer_interest_level)}`}>
                          {selectedShowing.buyer_interest_level.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700">{selectedShowing.feedback}</p>
                  </div>
                )}

                {/* Cancellation (if cancelled) */}
                {selectedShowing.cancellation_reason && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-700 mb-1">Cancellation Reason</p>
                    <p className="text-gray-700">{selectedShowing.cancellation_reason}</p>
                  </div>
                )}
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                {selectedShowing.status === 'requested' && (
                  <Button onClick={() => openActionModal(selectedShowing, 'confirm')} className="bg-green-600 hover:bg-green-700">
                    Confirm Showing
                  </Button>
                )}
                {selectedShowing.status === 'confirmed' && (
                  <Button onClick={() => openActionModal(selectedShowing, 'complete')} className="bg-purple-600 hover:bg-purple-700">
                    Mark Complete
                  </Button>
                )}
                <Button onClick={() => setSelectedShowing(null)} variant="secondary">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        {showActionModal === 'confirm' && selectedShowing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Confirm Showing</h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Confirm the showing for <strong>{selectedShowing.listing_title}</strong>
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={actionData.scheduled_date}
                    onChange={(e) => setActionData({ ...actionData, scheduled_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={actionData.scheduled_time}
                    onChange={(e) => setActionData({ ...actionData, scheduled_time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <Button onClick={closeModal} variant="secondary">Cancel</Button>
                <Button onClick={handleConfirm} disabled={processing} className="bg-green-600 hover:bg-green-700">
                  {processing ? 'Confirming...' : 'Confirm'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Modal */}
        {showActionModal === 'cancel' && selectedShowing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-red-600">Cancel Showing</h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to cancel this showing?
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
                  <textarea
                    value={actionData.cancellation_reason}
                    onChange={(e) => setActionData({ ...actionData, cancellation_reason: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter cancellation reason..."
                  />
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <Button onClick={closeModal} variant="secondary">Back</Button>
                <Button onClick={handleCancel} disabled={processing} className="bg-red-600 hover:bg-red-700">
                  {processing ? 'Cancelling...' : 'Cancel Showing'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Complete Modal */}
        {showActionModal === 'complete' && selectedShowing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Complete Showing</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Interest Level</label>
                  <select
                    value={actionData.buyer_interest_level}
                    onChange={(e) => setActionData({ ...actionData, buyer_interest_level: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select...</option>
                    <option value="very_interested">Very Interested</option>
                    <option value="interested">Interested</option>
                    <option value="maybe">Maybe</option>
                    <option value="not_interested">Not Interested</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback (optional)</label>
                  <textarea
                    value={actionData.feedback}
                    onChange={(e) => setActionData({ ...actionData, feedback: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Notes about the showing..."
                  />
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <Button onClick={closeModal} variant="secondary">Cancel</Button>
                <Button onClick={handleComplete} disabled={processing} className="bg-purple-600 hover:bg-purple-700">
                  {processing ? 'Completing...' : 'Mark Complete'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
