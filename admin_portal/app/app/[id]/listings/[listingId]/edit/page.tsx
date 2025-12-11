'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appsAPI, propertyListingsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { Home, Save, ArrowLeft, MapPin, DollarSign, Users, Bed, Bath, Image as ImageIcon, Video, Trash2, Plus, Star, X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PropertyImage {
  id: number;
  image_url: string;
  caption?: string;
  is_primary: number;
  display_order: number;
}

interface PropertyVideo {
  id: number;
  video_url: string;
  thumbnail_url?: string;
  caption?: string;
  display_order: number;
}

interface PropertyListing {
  id: number;
  title: string;
  description: string;
  property_type: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number;
  bathrooms: number;
  guests_max: number;
  price_per_night: string;
  cleaning_fee: string;
  service_fee: string;
  status: string;
  is_instant_book: boolean;
  check_in_time: string;
  check_out_time: string;
  house_rules: string;
  cancellation_policy: string;
  images?: PropertyImage[];
  videos?: PropertyVideo[];
}

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'villa', label: 'Villa' },
  { value: 'cabin', label: 'Cabin' },
  { value: 'cottage', label: 'Cottage' },
  { value: 'loft', label: 'Loft' },
  { value: 'studio', label: 'Studio' },
  { value: 'other', label: 'Other' },
];

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
];

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;
  const listingId = params.listingId as string;
  const { user, isAuthenticated } = useAuthStore();
  
  const [app, setApp] = useState<any>(null);
  const [listing, setListing] = useState<PropertyListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<PropertyListing>>({});
  
  // Image/Video management state
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [videos, setVideos] = useState<PropertyVideo[]>([]);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoCaption, setNewVideoCaption] = useState('');
  const [newVideoThumbnail, setNewVideoThumbnail] = useState('');
  const [mediaLoading, setMediaLoading] = useState(false);

  // API base URL for images
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
  }, [isAuthenticated, user, appId, listingId, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appResponse = await appsAPI.getById(parseInt(appId));
      setApp(appResponse.data);

      const listingResponse = await propertyListingsAPI.getListingById(parseInt(appId), parseInt(listingId));
      const listingData = listingResponse.data;
      setListing(listingData);
      setFormData(listingData);
      setImages(listingData.images || []);
      setVideos(listingData.videos || []);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  // Helper to get full image URL
  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  // Image management handlers
  const handleAddImage = async () => {
    if (!newImageUrl.trim()) return;
    setMediaLoading(true);
    try {
      const response = await propertyListingsAPI.addImage(parseInt(appId), parseInt(listingId), {
        image_url: newImageUrl,
        caption: newImageCaption || undefined,
        is_primary: images.length === 0, // First image is primary
      });
      setImages([...images, response.data]);
      setNewImageUrl('');
      setNewImageCaption('');
      setShowAddImageModal(false);
    } catch (error) {
      console.error('Failed to add image:', error);
      alert('Failed to add image');
    } finally {
      setMediaLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    setMediaLoading(true);
    try {
      await propertyListingsAPI.deleteImage(parseInt(appId), parseInt(listingId), imageId);
      setImages(images.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image');
    } finally {
      setMediaLoading(false);
    }
  };

  const handleSetPrimaryImage = async (imageId: number) => {
    setMediaLoading(true);
    try {
      await propertyListingsAPI.updateImage(parseInt(appId), parseInt(listingId), imageId, { is_primary: true });
      setImages(images.map(img => ({ ...img, is_primary: img.id === imageId ? 1 : 0 })));
    } catch (error) {
      console.error('Failed to set primary image:', error);
      alert('Failed to set primary image');
    } finally {
      setMediaLoading(false);
    }
  };

  // Video management handlers
  const handleAddVideo = async () => {
    if (!newVideoUrl.trim()) return;
    setMediaLoading(true);
    try {
      const response = await propertyListingsAPI.addVideo(parseInt(appId), parseInt(listingId), {
        video_url: newVideoUrl,
        caption: newVideoCaption || undefined,
        thumbnail_url: newVideoThumbnail || undefined,
      });
      setVideos([...videos, response.data]);
      setNewVideoUrl('');
      setNewVideoCaption('');
      setNewVideoThumbnail('');
      setShowAddVideoModal(false);
    } catch (error) {
      console.error('Failed to add video:', error);
      alert('Failed to add video');
    } finally {
      setMediaLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    setMediaLoading(true);
    try {
      await propertyListingsAPI.deleteVideo(parseInt(appId), parseInt(listingId), videoId);
      setVideos(videos.filter(vid => vid.id !== videoId));
    } catch (error) {
      console.error('Failed to delete video:', error);
      alert('Failed to delete video');
    } finally {
      setMediaLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await propertyListingsAPI.updateListing(parseInt(appId), parseInt(listingId), formData);
      alert('Listing updated successfully!');
      router.push(`/app/${appId}/listings`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout appId={appId} appName={app?.name || 'App'}>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!listing) {
    return (
      <AppLayout appId={appId} appName={app?.name || 'App'}>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Listing not found</h2>
            <Button onClick={() => router.push(`/app/${appId}/listings`)} className="mt-4">
              Back to Listings
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout appId={appId} appName={app?.name || 'App'}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/app/${appId}/listings`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Listings
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Home className="h-7 w-7 text-blue-600" />
            Edit Listing
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Update property details for "{listing.title}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  name="property_type"
                  value={formData.property_type || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bed className="h-5 w-5 text-gray-500" />
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms || 0}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms || 0}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                <input
                  type="number"
                  name="guests_max"
                  value={formData.guests_max || 1}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-500" />
              Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
                <input
                  type="number"
                  name="price_per_night"
                  value={formData.price_per_night || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning Fee ($)</label>
                <input
                  type="number"
                  name="cleaning_fee"
                  value={formData.cleaning_fee || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Fee ($)</label>
                <input
                  type="number"
                  name="service_fee"
                  value={formData.service_fee || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Policies & Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
                <input
                  type="time"
                  name="check_in_time"
                  value={formData.check_in_time || '15:00'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                <input
                  type="time"
                  name="check_out_time"
                  value={formData.check_out_time || '11:00'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">House Rules</label>
                <textarea
                  name="house_rules"
                  value={formData.house_rules || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Policy</label>
                <select
                  name="cancellation_policy"
                  value={formData.cancellation_policy || 'moderate'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="flexible">Flexible - Full refund up to 24 hours before</option>
                  <option value="moderate">Moderate - Full refund up to 5 days before</option>
                  <option value="strict">Strict - 50% refund up to 7 days before</option>
                  <option value="super_strict">Super Strict - No refunds</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_instant_book"
                    checked={formData.is_instant_book || false}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Instant Book</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Allow guests to book without host approval</p>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-gray-500" />
                Images ({images.length})
              </h2>
              <Button type="button" onClick={() => setShowAddImageModal(true)} disabled={mediaLoading}>
                <Plus className="h-4 w-4 mr-1" />
                Add Image
              </Button>
            </div>
            
            {images.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No images yet. Add your first image.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={getImageUrl(image.image_url)}
                      alt={image.caption || 'Property image'}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {image.is_primary === 1 && (
                      <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Star className="h-3 w-3" /> Primary
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      {image.is_primary !== 1 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(image.id)}
                          className="p-2 bg-white rounded-full hover:bg-yellow-100"
                          title="Set as primary"
                        >
                          <Star className="h-4 w-4 text-yellow-600" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(image.id)}
                        className="p-2 bg-white rounded-full hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                    {image.caption && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Videos */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Video className="h-5 w-5 text-gray-500" />
                Videos ({videos.length})
              </h2>
              <Button type="button" onClick={() => setShowAddVideoModal(true)} disabled={mediaLoading}>
                <Plus className="h-4 w-4 mr-1" />
                Add Video
              </Button>
            </div>
            
            {videos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No videos yet. Add your first video.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <div key={video.id} className="relative group">
                    {video.thumbnail_url ? (
                      <img
                        src={getImageUrl(video.thumbnail_url)}
                        alt={video.caption || 'Video thumbnail'}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Video className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(video.id)}
                        className="p-2 bg-white rounded-full hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                    {video.caption && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{video.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/app/${appId}/listings`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>

        {/* Add Image Modal */}
        {showAddImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Image</h3>
                <button onClick={() => setShowAddImageModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="/uploads/app_56/image.jpg or https://..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caption (optional)</label>
                  <input
                    type="text"
                    value={newImageCaption}
                    onChange={(e) => setNewImageCaption(e.target.value)}
                    placeholder="Living room view"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={() => setShowAddImageModal(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleAddImage} disabled={mediaLoading || !newImageUrl.trim()}>
                    {mediaLoading ? 'Adding...' : 'Add Image'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Video Modal */}
        {showAddVideoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Video</h3>
                <button onClick={() => setShowAddVideoModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video URL *</label>
                  <input
                    type="text"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="/uploads/app_56/video.mp4 or https://..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL (optional)</label>
                  <input
                    type="text"
                    value={newVideoThumbnail}
                    onChange={(e) => setNewVideoThumbnail(e.target.value)}
                    placeholder="/uploads/app_56/thumbnail.jpg"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caption (optional)</label>
                  <input
                    type="text"
                    value={newVideoCaption}
                    onChange={(e) => setNewVideoCaption(e.target.value)}
                    placeholder="Property Tour"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={() => setShowAddVideoModal(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleAddVideo} disabled={mediaLoading || !newVideoUrl.trim()}>
                    {mediaLoading ? 'Adding...' : 'Add Video'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
