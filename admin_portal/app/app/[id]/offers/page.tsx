'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { realEstateAPI, appsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { 
  DollarSign, Filter, Eye, CheckCircle, XCircle, Clock, 
  Home, User, X, FileText, TrendingUp, AlertTriangle, ArrowLeft
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface Offer {
  id: number;
  listing_id: number;
  buyer_id: number;
  agent_id: number | null;
  offer_amount: number;
  earnest_money: number | null;
  down_payment_percent: number | null;
  financing_type: string;
  inspection_contingency: boolean;
  financing_contingency: boolean;
  appraisal_contingency: boolean;
  sale_contingency: boolean;
  other_contingencies: string | null;
  closing_date: string | null;
  status: string;
  counter_amount: number | null;
  counter_terms: string | null;
  response_notes: string | null;
  submitted_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
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
}

interface Stats {
  total: number;
  submitted_count: string;
  under_review_count: string;
  countered_count: string;
  accepted_count: string;
  rejected_count: string;
  withdrawn_count: string;
  avg_offer_amount: string | null;
}

export default function OffersPage() {
  const router = useRouter();
  const params = useParams();
  const appId = parseInt(params.id as string);
  const { user, isAuthenticated } = useAuthStore();
  
  const [app, setApp] = useState<any>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Modal state
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showActionModal, setShowActionModal] = useState<'counter' | 'accept' | 'reject' | null>(null);
  const [actionData, setActionData] = useState({
    counter_amount: '',
    counter_terms: '',
    response_notes: ''
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

      const response = await realEstateAPI.getOffers(appId, {
        status: statusFilter || undefined,
        page: currentPage,
        per_page: 20
      });

      setOffers(response.data?.offers || []);
      setStats(response.data?.stats || null);
      setTotal(response.data?.pagination?.total || 0);
      setTotalPages(response.data?.pagination?.total_pages || 1);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCounter = async () => {
    if (!selectedOffer || !actionData.counter_amount) return;
    try {
      setProcessing(true);
      await realEstateAPI.counterOffer(appId, selectedOffer.id, parseFloat(actionData.counter_amount), actionData.counter_terms);
      closeModal();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to counter offer');
    } finally {
      setProcessing(false);
    }
  };

  const handleAccept = async () => {
    if (!selectedOffer) return;
    try {
      setProcessing(true);
      await realEstateAPI.acceptOffer(appId, selectedOffer.id, actionData.response_notes);
      closeModal();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to accept offer');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedOffer) return;
    try {
      setProcessing(true);
      await realEstateAPI.rejectOffer(appId, selectedOffer.id, actionData.response_notes);
      closeModal();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject offer');
    } finally {
      setProcessing(false);
    }
  };

  const closeModal = () => {
    setShowActionModal(null);
    setSelectedOffer(null);
    setActionData({ counter_amount: '', counter_terms: '', response_notes: '' });
  };

  const openActionModal = (offer: Offer, action: 'counter' | 'accept' | 'reject') => {
    setSelectedOffer(offer);
    setShowActionModal(action);
    if (action === 'counter') {
      setActionData({ ...actionData, counter_amount: offer.offer_amount.toString() });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'under_review': return 'bg-yellow-100 text-yellow-700';
      case 'countered': return 'bg-orange-100 text-orange-700';
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'withdrawn': return 'bg-gray-100 text-gray-500';
      case 'expired': return 'bg-gray-100 text-gray-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFinancingLabel = (type: string) => {
    const labels: Record<string, string> = {
      cash: 'Cash',
      conventional: 'Conventional',
      fha: 'FHA',
      va: 'VA',
      other: 'Other'
    };
    return labels[type] || type;
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
                <DollarSign className="h-6 w-6 text-green-600" />
                Property Offers
              </h1>
              <p className="text-sm text-gray-600">
                Manage purchase offers for {app?.name || 'your app'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-gray-500 uppercase">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-blue-600 uppercase">Submitted</p>
              <p className="text-xl font-bold text-blue-600">{stats.submitted_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-yellow-600 uppercase">Review</p>
              <p className="text-xl font-bold text-yellow-600">{stats.under_review_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-orange-600 uppercase">Countered</p>
              <p className="text-xl font-bold text-orange-600">{stats.countered_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-green-600 uppercase">Accepted</p>
              <p className="text-xl font-bold text-green-600">{stats.accepted_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-red-600 uppercase">Rejected</p>
              <p className="text-xl font-bold text-red-600">{stats.rejected_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-gray-500 uppercase">Withdrawn</p>
              <p className="text-xl font-bold text-gray-500">{stats.withdrawn_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-purple-600 uppercase">Avg Offer</p>
              <p className="text-lg font-bold text-purple-600">
                {stats.avg_offer_amount ? formatCurrency(parseFloat(stats.avg_offer_amount)) : '-'}
              </p>
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
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="countered">Countered</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
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
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : offers.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium">No offers found</h3>
              <p className="text-sm text-gray-500">No offers match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Financing</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {offers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {offer.listing_title}
                        </div>
                        <div className="text-xs text-gray-500">{offer.listing_city}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {offer.buyer_first_name} {offer.buyer_last_name}
                        </div>
                        <div className="text-xs text-gray-500">{offer.buyer_email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-bold text-green-600">
                          {formatCurrency(offer.offer_amount)}
                        </div>
                        {offer.counter_amount && (
                          <div className="text-xs text-orange-600">
                            Counter: {formatCurrency(offer.counter_amount)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {getFinancingLabel(offer.financing_type)}
                        {offer.down_payment_percent && (
                          <div className="text-xs text-gray-400">{offer.down_payment_percent}% down</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offer.status)}`}>
                          {offer.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(offer.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOffer(offer)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {(offer.status === 'submitted' || offer.status === 'under_review') && (
                            <>
                              <button
                                onClick={() => openActionModal(offer, 'accept')}
                                className="text-green-600 hover:text-green-900"
                                title="Accept"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openActionModal(offer, 'counter')}
                                className="text-orange-600 hover:text-orange-900"
                                title="Counter"
                              >
                                <TrendingUp className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openActionModal(offer, 'reject')}
                                className="text-red-600 hover:text-red-900"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
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

        {/* View Offer Modal */}
        {selectedOffer && !showActionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Offer Details</h2>
                <button onClick={() => setSelectedOffer(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {/* Property Info */}
                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{selectedOffer.listing_title}</p>
                    <p className="text-sm text-gray-500">{selectedOffer.listing_address}</p>
                    <p className="text-sm text-gray-500">{selectedOffer.listing_city}</p>
                    {selectedOffer.asking_price && (
                      <p className="text-sm text-gray-600 mt-1">
                        Asking: {formatCurrency(selectedOffer.asking_price)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Buyer Info */}
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{selectedOffer.buyer_first_name} {selectedOffer.buyer_last_name}</p>
                    <p className="text-sm text-gray-500">{selectedOffer.buyer_email}</p>
                    {selectedOffer.buyer_phone && (
                      <p className="text-sm text-gray-500">{selectedOffer.buyer_phone}</p>
                    )}
                  </div>
                </div>

                {/* Offer Details */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-green-700">
                      {formatCurrency(selectedOffer.offer_amount)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOffer.status)}`}>
                      {selectedOffer.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Financing</p>
                      <p className="font-medium">{getFinancingLabel(selectedOffer.financing_type)}</p>
                    </div>
                    {selectedOffer.down_payment_percent && (
                      <div>
                        <p className="text-gray-500">Down Payment</p>
                        <p className="font-medium">{selectedOffer.down_payment_percent}%</p>
                      </div>
                    )}
                    {selectedOffer.earnest_money && (
                      <div>
                        <p className="text-gray-500">Earnest Money</p>
                        <p className="font-medium">{formatCurrency(selectedOffer.earnest_money)}</p>
                      </div>
                    )}
                    {selectedOffer.closing_date && (
                      <div>
                        <p className="text-gray-500">Closing Date</p>
                        <p className="font-medium">{formatDate(selectedOffer.closing_date)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contingencies */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Contingencies</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffer.inspection_contingency && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Inspection</span>
                    )}
                    {selectedOffer.financing_contingency && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Financing</span>
                    )}
                    {selectedOffer.appraisal_contingency && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Appraisal</span>
                    )}
                    {selectedOffer.sale_contingency && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Sale of Home</span>
                    )}
                    {!selectedOffer.inspection_contingency && !selectedOffer.financing_contingency && 
                     !selectedOffer.appraisal_contingency && !selectedOffer.sale_contingency && (
                      <span className="text-sm text-gray-500">No contingencies</span>
                    )}
                  </div>
                </div>

                {/* Counter Offer */}
                {selectedOffer.counter_amount && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-orange-700 mb-2">Counter Offer</p>
                    <p className="text-lg font-bold text-orange-700">{formatCurrency(selectedOffer.counter_amount)}</p>
                    {selectedOffer.counter_terms && (
                      <p className="text-sm text-gray-700 mt-2">{selectedOffer.counter_terms}</p>
                    )}
                  </div>
                )}

                {/* Response Notes */}
                {selectedOffer.response_notes && (
                  <div className={`rounded-lg p-4 ${selectedOffer.status === 'accepted' ? 'bg-green-50' : selectedOffer.status === 'rejected' ? 'bg-red-50' : 'bg-gray-50'}`}>
                    <p className="text-sm font-medium text-gray-700 mb-1">Response</p>
                    <p className="text-sm text-gray-700">{selectedOffer.response_notes}</p>
                  </div>
                )}
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                {(selectedOffer.status === 'submitted' || selectedOffer.status === 'under_review') && (
                  <>
                    <Button onClick={() => openActionModal(selectedOffer, 'accept')} className="bg-green-600 hover:bg-green-700">
                      Accept
                    </Button>
                    <Button onClick={() => openActionModal(selectedOffer, 'counter')} className="bg-orange-600 hover:bg-orange-700">
                      Counter
                    </Button>
                    <Button onClick={() => openActionModal(selectedOffer, 'reject')} className="bg-red-600 hover:bg-red-700">
                      Reject
                    </Button>
                  </>
                )}
                <Button onClick={() => setSelectedOffer(null)} variant="secondary">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Counter Modal */}
        {showActionModal === 'counter' && selectedOffer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-orange-600">Counter Offer</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Original offer: {formatCurrency(selectedOffer.offer_amount)}
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Counter Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={actionData.counter_amount}
                      onChange={(e) => setActionData({ ...actionData, counter_amount: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 border rounded-lg"
                      placeholder="Enter counter amount"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terms (optional)</label>
                  <textarea
                    value={actionData.counter_terms}
                    onChange={(e) => setActionData({ ...actionData, counter_terms: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Additional terms or conditions..."
                  />
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <Button onClick={closeModal} variant="secondary">Cancel</Button>
                <Button onClick={handleCounter} disabled={!actionData.counter_amount || processing} className="bg-orange-600 hover:bg-orange-700">
                  {processing ? 'Sending...' : 'Send Counter'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Accept Modal */}
        {showActionModal === 'accept' && selectedOffer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-green-600">Accept Offer</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Accepting offer of {formatCurrency(selectedOffer.offer_amount)}
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-green-50 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <p className="text-sm text-green-700">
                    This will mark the offer as accepted. The buyer will be notified.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <textarea
                    value={actionData.response_notes}
                    onChange={(e) => setActionData({ ...actionData, response_notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Congratulations message or next steps..."
                  />
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <Button onClick={closeModal} variant="secondary">Cancel</Button>
                <Button onClick={handleAccept} disabled={processing} className="bg-green-600 hover:bg-green-700">
                  {processing ? 'Accepting...' : 'Accept Offer'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showActionModal === 'reject' && selectedOffer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-red-600">Reject Offer</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-red-50 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <p className="text-sm text-red-700">
                    This will reject the offer of {formatCurrency(selectedOffer.offer_amount)}. This action cannot be undone.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
                  <textarea
                    value={actionData.response_notes}
                    onChange={(e) => setActionData({ ...actionData, response_notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Reason for rejection..."
                  />
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <Button onClick={closeModal} variant="secondary">Cancel</Button>
                <Button onClick={handleReject} disabled={processing} className="bg-red-600 hover:bg-red-700">
                  {processing ? 'Rejecting...' : 'Reject Offer'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
