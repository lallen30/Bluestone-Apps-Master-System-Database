'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, bookingsAPI, propertyListingsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { Calendar, DollarSign, Users, Clock, CheckCircle, XCircle, AlertCircle, Filter, Download } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Booking {
  id: number;
  listing_id: number;
  listing_title: string;
  city: string;
  state: string;
  country: string;
  check_in_date: string;
  check_out_date: string;
  guests_count: number;
  nights: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  guest_user_first_name: string;
  guest_user_last_name: string;
  guest_user_email: string;
  host_first_name: string;
  host_last_name: string;
  host_email: string;
  special_requests: string;
  created_at: string;
  confirmed_at: string;
  cancelled_at: string;
  cancellation_reason: string;
}

interface Stats {
  total_bookings: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  rejected: number;
  total_revenue: number;
  total_nights: number;
}

interface Host {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export default function BookingsReportPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();
  
  const [app, setApp] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [hostFilter, setHostFilter] = useState('');
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
    fetchHosts();
  }, [isAuthenticated, user, appId, router, statusFilter, hostFilter, dateFrom, dateTo, currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appResponse = await appsAPI.getById(parseInt(appId));
      setApp(appResponse.data);

      const bookingsResponse = await bookingsAPI.getAllBookings(parseInt(appId), {
        status: statusFilter || undefined,
        host_id: hostFilter ? parseInt(hostFilter) : undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        page: currentPage,
        per_page: 20
      });

      setBookings(bookingsResponse.data?.bookings || []);
      setStats(bookingsResponse.data?.stats || null);
      setTotal(bookingsResponse.data?.pagination?.total || 0);
      setTotalPages(bookingsResponse.data?.pagination?.total_pages || 1);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchHosts = async () => {
    try {
      const response = await propertyListingsAPI.getHosts(parseInt(appId));
      setHosts(response.data || []);
    } catch (error) {
      console.error('Error fetching hosts:', error);
    }
  };

  const clearFilters = () => {
    setStatusFilter('');
    setHostFilter('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'rejected': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <AppLayout appId={appId} appName={app?.name || 'App'}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="h-7 w-7 text-blue-600" />
                Bookings Report
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                View and manage all bookings for {app?.name || 'your app'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-gray-500 uppercase">Total</p>
              <p className="text-xl font-bold">{stats.total_bookings}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-yellow-600 uppercase">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-green-600 uppercase">Confirmed</p>
              <p className="text-xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-blue-600 uppercase">Completed</p>
              <p className="text-xl font-bold text-blue-600">{stats.completed}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-red-600 uppercase">Cancelled</p>
              <p className="text-xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-gray-500 uppercase">Rejected</p>
              <p className="text-xl font-bold text-gray-500">{stats.rejected}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-green-600 uppercase">Revenue</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(stats.total_revenue)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-purple-600 uppercase">Nights</p>
              <p className="text-xl font-bold text-purple-600">{stats.total_nights}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
              <select
                value={hostFilter}
                onChange={(e) => { setHostFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">All Hosts</option>
                {hosts.map(host => (
                  <option key={host.id} value={host.id}>
                    {host.first_name} {host.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={clearFilters} variant="secondary" className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium">No bookings found</h3>
              <p className="text-sm text-gray-500">No bookings match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Host</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nights</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">
                        #{booking.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {booking.listing_title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.city}, {booking.state || booking.country}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.guest_user_first_name || booking.guest_first_name} {booking.guest_user_last_name || booking.guest_last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.guest_user_email || booking.guest_email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.host_first_name} {booking.host_last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.host_email}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>{formatDate(booking.check_in_date)}</div>
                        <div className="text-gray-500">to {formatDate(booking.check_out_date)}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {booking.nights}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {formatCurrency(booking.total_price)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(booking.created_at)}
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
      </div>
    </AppLayout>
  );
}
