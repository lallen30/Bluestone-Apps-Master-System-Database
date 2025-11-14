'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, propertyListingsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { Home, Search, Plus, Edit, Trash2, Eye, MapPin, DollarSign, Users, Bed, X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PropertyListing {
  id: number;
  title: string;
  description: string;
  property_type: string;
  city: string;
  state: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  guests_max: number;
  price_per_night: string;
  status: string;
  is_published: boolean;
  host_first_name: string;
  host_last_name: string;
}

export default function PropertyListingsPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();
  
  const [app, setApp] = useState<any>(null);
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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
  }, [isAuthenticated, user, appId, router, searchTerm, statusFilter, currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appResponse = await appsAPI.getById(parseInt(appId));
      setApp(appResponse.data);

      const listingsResponse = await propertyListingsAPI.getListings(parseInt(appId), {
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        page: currentPage,
        per_page: 20
      });

      setListings(listingsResponse.data?.listings || []);
      setTotal(listingsResponse.data?.pagination?.total || 0);
      setTotalPages(listingsResponse.data?.pagination?.total_pages || 1);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await propertyListingsAPI.deleteListing(parseInt(appId), id);
      fetchData();
      alert('Deleted successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleTogglePublish = async (listing: PropertyListing) => {
    try {
      await propertyListingsAPI.publishListing(parseInt(appId), listing.id, !listing.is_published);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Update failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'draft': return 'text-gray-600 bg-gray-50';
      default: return 'text-red-600 bg-red-50';
    }
  };

  return (
    <AppLayout appId={appId} appName={app?.name || 'App'}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Home className="h-7 w-7 text-blue-600" />
                Property Listings
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage properties for {app?.name || 'your app'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {listings.filter(l => l.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Draft</p>
            <p className="text-2xl font-bold text-gray-600">
              {listings.filter(l => l.status === 'draft').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Avg Price</p>
            <p className="text-2xl font-bold text-blue-600">
              ${listings.length > 0 
                ? Math.round(listings.reduce((acc, l) => acc + parseFloat(l.price_per_night), 0) / listings.length)
                : 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">All</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => { setSearchTerm(''); setStatusFilter(''); }}
                variant="secondary"
                className="w-full"
              >
                Clear
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
          ) : listings.length === 0 ? (
            <div className="p-12 text-center">
              <Home className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium">No listings</h3>
              <p className="text-sm text-gray-500">Use the mobile API to create listings</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Host</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{listing.title}</div>
                      <div className="text-sm text-gray-500 capitalize">
                        {listing.property_type.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      {listing.city}, {listing.state || listing.country}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="mr-2"><Bed className="inline h-4 w-4 mr-1" />{listing.bedrooms}</span>
                      <span><Users className="inline h-4 w-4 mr-1" />{listing.guests_max}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">${listing.price_per_night}</div>
                      <div className="text-xs text-gray-500">per night</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {listing.host_first_name} {listing.host_last_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </span>
                      {listing.is_published && (
                        <span className="ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full text-blue-600 bg-blue-50">
                          Published
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleTogglePublish(listing)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-between">
            <Button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="secondary"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
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
