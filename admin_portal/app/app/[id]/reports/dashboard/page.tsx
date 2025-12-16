'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { dashboardReportsAPI, realEstateAPI, appsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { 
  Building, Users, MessageSquare, Heart, TrendingUp, TrendingDown,
  Home, DollarSign, Clock, AlertCircle, ArrowRight, RefreshCw, Calendar, Eye
} from 'lucide-react';

interface DashboardSummary {
  totals: {
    listings: number;
    users: number;
    inquiries: number;
    messages: number;
  };
  active: {
    listings: number;
    users: number;
    pendingInquiries: number;
  };
  last7Days: {
    newListings: number;
    newUsers: number;
    newInquiries: number;
  };
}

interface ListingsOverview {
  summary: {
    total: number;
    active: number;
    pending: number;
    sold: number;
    draft: number;
  };
  priceStats: {
    average: number;
    min: number;
    max: number;
  };
  byType: Array<{ property_type: string; count: number }>;
  byCity: Array<{ city: string; count: number }>;
  trend: Array<{ date: string; count: number }>;
}

interface UsersOverview {
  summary: {
    total: number;
    active: number;
    pending: number;
    inactive: number;
  };
  byRole: Array<{ role_name: string; display_name: string; count: number }>;
  recentUsers: Array<{
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    status: string;
    created_at: string;
  }>;
}

interface InquiriesOverview {
  summary: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  recentInquiries: Array<{
    id: number;
    status: string;
    property_title: string;
    user_email: string;
    first_name: string;
    last_name: string;
    created_at: string;
  }>;
}

interface PopularListing {
  id: number;
  title: string;
  city: string;
  property_type: string;
  price: number;
  inquiry_count: number;
  favorite_count: number;
  engagement_score: number;
  image_url: string | null;
}

interface RealEstateOverview {
  inquiries: {
    total: number;
    new_count: string;
    responded_count: string;
    last_7_days: string;
  };
  showings: {
    total: number;
    requested_count: string;
    confirmed_count: string;
    completed_count: string;
    upcoming_count: string;
  };
  listings: {
    total: number;
    active_count: string;
    pending_count: string;
    avg_price: string;
  };
  recentInquiries: Array<{
    id: number;
    subject: string;
    status: string;
    created_at: string;
    listing_title: string;
    buyer_first_name: string;
    buyer_last_name: string;
  }>;
  upcomingShowings: Array<{
    id: number;
    status: string;
    showing_type: string;
    showing_date: string;
    showing_time: string;
    listing_title: string;
    buyer_first_name: string;
    buyer_last_name: string;
  }>;
}

export default function DashboardReportsPage() {
  const router = useRouter();
  const params = useParams();
  const appId = parseInt(params.id as string);
  const { user, isAuthenticated } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appName, setAppName] = useState('');
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [listings, setListings] = useState<ListingsOverview | null>(null);
  const [users, setUsers] = useState<UsersOverview | null>(null);
  const [inquiries, setInquiries] = useState<InquiriesOverview | null>(null);
  const [popularListings, setPopularListings] = useState<PopularListing[]>([]);
  const [realEstateData, setRealEstateData] = useState<RealEstateOverview | null>(null);
  
  // Template 5 = Real Estate, Template 9 = Property Rental (vacation rentals)
  const isRealEstateTemplate = templateId === 5;

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [appId, isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch app details
      const appResponse = await appsAPI.getById(appId);
      setAppName(appResponse.data?.name || 'App');
      setTemplateId(appResponse.data?.template_id || null);

      // Fetch all reports in parallel
      const [summaryRes, listingsRes, usersRes, inquiriesRes, popularRes, realEstateRes] = await Promise.all([
        dashboardReportsAPI.getSummary(appId),
        dashboardReportsAPI.getListingsOverview(appId),
        dashboardReportsAPI.getUsersOverview(appId),
        dashboardReportsAPI.getInquiriesOverview(appId),
        dashboardReportsAPI.getPopularListings(appId, 5),
        realEstateAPI.getDashboardOverview(appId).catch(() => ({ data: null }))
      ]);

      setSummary(summaryRes.data);
      setListings(listingsRes.data);
      setUsers(usersRes.data);
      setInquiries(inquiriesRes.data);
      setPopularListings(popularRes.data?.listings || []);
      setRealEstateData(realEstateRes.data);
    } catch (err: any) {
      console.error('Error fetching dashboard reports:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard reports');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value * 1000); // Multiply by 1000 since we stored price/1000
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <AppLayout appId={params.id as string} appName={appName || 'Loading...'}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dashboard reports...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout appId={params.id as string} appName={appName}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics and Reports</h1>
            <p className="text-gray-600 mt-1">Analytics and insights for {appName}</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Listings Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Listings</p>
                  <p className="text-3xl font-bold text-gray-900">{summary.totals.listings}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{summary.last7Days.newListings}
                </span>
                <span className="text-gray-500 ml-2">last 7 days</span>
              </div>
            </div>

            {/* Users Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{summary.totals.users}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{summary.last7Days.newUsers}
                </span>
                <span className="text-gray-500 ml-2">last 7 days</span>
              </div>
            </div>

            {/* Inquiries Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Inquiries</p>
                  <p className="text-3xl font-bold text-gray-900">{summary.totals.inquiries}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{summary.last7Days.newInquiries}
                </span>
                <span className="text-gray-500 ml-2">last 7 days</span>
              </div>
            </div>

            {/* Pending Inquiries Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Inquiries</p>
                  <p className="text-3xl font-bold text-gray-900">{summary.active.pendingInquiries}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Awaiting response
              </div>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Listings Overview */}
          {listings && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Listings Overview</h2>
              </div>
              <div className="p-6">
                {/* Status Breakdown */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{listings.summary.active}</p>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{listings.summary.pending}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{listings.summary.sold}</p>
                    <p className="text-xs text-gray-500">Sold</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-400">{listings.summary.draft}</p>
                    <p className="text-xs text-gray-500">Draft</p>
                  </div>
                </div>

                {/* Price Stats */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Price Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(listings.priceStats.average)}</p>
                      <p className="text-xs text-gray-500">Average</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(listings.priceStats.min)}</p>
                      <p className="text-xs text-gray-500">Minimum</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(listings.priceStats.max)}</p>
                      <p className="text-xs text-gray-500">Maximum</p>
                    </div>
                  </div>
                </div>

                {/* By Property Type */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">By Property Type</h3>
                  <div className="space-y-2">
                    {listings.byType.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{item.property_type}</span>
                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Overview */}
          {users && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Users Overview</h2>
              </div>
              <div className="p-6">
                {/* Status Breakdown */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{users.summary.active}</p>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{users.summary.pending}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-400">{users.summary.inactive}</p>
                    <p className="text-xs text-gray-500">Inactive</p>
                  </div>
                </div>

                {/* By Role */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">By Role</h3>
                  <div className="space-y-2">
                    {users.byRole.map((role, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{role.display_name || role.role_name}</span>
                        <span className="text-sm font-medium text-gray-900">{role.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Users */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Registrations</h3>
                  <div className="space-y-2">
                    {users.recentUsers.slice(0, 5).map((user, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-gray-400">{formatDate(user.created_at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Inquiries and Popular Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bookings Overview */}
          {inquiries && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Bookings Overview</h2>
              </div>
              <div className="p-6">
                {/* Status Breakdown */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{inquiries.summary.pending}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{inquiries.summary.confirmed}</p>
                    <p className="text-xs text-gray-500">Confirmed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{inquiries.summary.completed}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{inquiries.summary.cancelled}</p>
                    <p className="text-xs text-gray-500">Cancelled</p>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Bookings</h3>
                  <div className="space-y-3">
                    {inquiries.recentInquiries.slice(0, 5).map((inquiry, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {inquiry.property_title || 'Unknown Property'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {inquiry.first_name} {inquiry.last_name}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          inquiry.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          inquiry.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {inquiry.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Popular Listings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Popular Listings</h2>
              <button
                onClick={() => router.push(`/app/${appId}/listings`)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              {popularListings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No listings yet</p>
              ) : (
                <div className="space-y-4">
                  {popularListings.map((listing, index) => (
                    <div key={listing.id} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{listing.title}</p>
                        <p className="text-xs text-gray-500">{listing.city} • {listing.property_type}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {listing.inquiry_count}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {listing.favorite_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Real Estate Specific: Inquiries & Showings - Only show for Template 5 (Real Estate) */}
        {realEstateData && isRealEstateTemplate && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Property Inquiries */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Property Inquiries
                </h2>
                <button
                  onClick={() => router.push(`/app/${appId}/inquiries`)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{realEstateData.inquiries.total}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{realEstateData.inquiries.new_count}</p>
                    <p className="text-xs text-gray-500">New</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{realEstateData.inquiries.responded_count}</p>
                    <p className="text-xs text-gray-500">Responded</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{realEstateData.inquiries.last_7_days}</p>
                    <p className="text-xs text-gray-500">Last 7 Days</p>
                  </div>
                </div>

                {/* Recent Inquiries */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Inquiries</h3>
                  {realEstateData.recentInquiries.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No inquiries yet</p>
                  ) : (
                    <div className="space-y-3">
                      {realEstateData.recentInquiries.map((inquiry) => (
                        <div key={inquiry.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {inquiry.subject || inquiry.listing_title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {inquiry.buyer_first_name} {inquiry.buyer_last_name}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            inquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                            inquiry.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
                            inquiry.status === 'responded' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {inquiry.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Property Showings */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Property Showings
                </h2>
                <button
                  onClick={() => router.push(`/app/${appId}/showings`)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{realEstateData.showings.total}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{realEstateData.showings.requested_count}</p>
                    <p className="text-xs text-gray-500">Requested</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{realEstateData.showings.confirmed_count}</p>
                    <p className="text-xs text-gray-500">Confirmed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{realEstateData.showings.upcoming_count}</p>
                    <p className="text-xs text-gray-500">Upcoming</p>
                  </div>
                </div>

                {/* Upcoming Showings */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Upcoming Showings</h3>
                  {realEstateData.upcomingShowings.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No upcoming showings</p>
                  ) : (
                    <div className="space-y-3">
                      {realEstateData.upcomingShowings.map((showing) => (
                        <div key={showing.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {showing.listing_title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {showing.buyer_first_name} {showing.buyer_last_name} • {new Date(showing.showing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            showing.status === 'requested' ? 'bg-blue-100 text-blue-700' :
                            showing.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {showing.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => router.push(`/app/${appId}/listings`)}
              className="p-4 border rounded-lg hover:bg-gray-50 text-left"
            >
              <Home className="h-6 w-6 text-indigo-600 mb-2" />
              <p className="font-medium">Listings</p>
              <p className="text-xs text-gray-500">Manage properties</p>
            </button>
            <button
              onClick={() => router.push(`/app/${appId}/inquiries`)}
              className="p-4 border rounded-lg hover:bg-gray-50 text-left"
            >
              <MessageSquare className="h-6 w-6 text-blue-600 mb-2" />
              <p className="font-medium">Inquiries</p>
              <p className="text-xs text-gray-500">Manage buyer inquiries</p>
            </button>
            <button
              onClick={() => router.push(`/app/${appId}/showings`)}
              className="p-4 border rounded-lg hover:bg-gray-50 text-left"
            >
              <Calendar className="h-6 w-6 text-purple-600 mb-2" />
              <p className="font-medium">Showings</p>
              <p className="text-xs text-gray-500">Schedule & manage showings</p>
            </button>
            <button
              onClick={() => router.push(`/app/${appId}/offers`)}
              className="p-4 border rounded-lg hover:bg-gray-50 text-left"
            >
              <DollarSign className="h-6 w-6 text-green-600 mb-2" />
              <p className="font-medium">Offers</p>
              <p className="text-xs text-gray-500">Review purchase offers</p>
            </button>
            <button
              onClick={() => router.push(`/app/${appId}/analytics`)}
              className="p-4 border rounded-lg hover:bg-gray-50 text-left"
            >
              <TrendingUp className="h-6 w-6 text-orange-600 mb-2" />
              <p className="font-medium">Analytics</p>
              <p className="text-xs text-gray-500">Market & agent reports</p>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
