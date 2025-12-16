import apiClient from './client';
import { ENDPOINTS, API_CONFIG } from './config';
import { PropertyListing, PaginatedResponse, ListingsFilter, ApiResponse, Amenity } from '../types';

// Helper function to convert relative image URLs to absolute URLs
const transformImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url; // Already absolute
  return `${API_CONFIG.SERVER_URL}${url}`; // Prepend server URL
};

// Helper function to transform listing image URLs
const transformListing = (listing: PropertyListing): PropertyListing => {
  const transformed: PropertyListing = {
    ...listing,
    primary_image: transformImageUrl(listing.primary_image),
  };
  
  // Transform images array if present
  if (listing.images && Array.isArray(listing.images)) {
    transformed.images = listing.images.map((img: any) => ({
      ...img,
      image_url: transformImageUrl(img.image_url),
    }));
  }
  
  // Transform videos array if present
  if (listing.videos && Array.isArray(listing.videos)) {
    transformed.videos = listing.videos.map((vid: any) => ({
      ...vid,
      video_url: transformImageUrl(vid.video_url),
      thumbnail_url: transformImageUrl(vid.thumbnail_url),
    }));
  }
  
  return transformed;
};

export const listingsService = {
  // Get all listings with optional filters
  getListings: async (filters?: ListingsFilter): Promise<PaginatedResponse<PropertyListing>> => {
    const response = await apiClient.get<PaginatedResponse<PropertyListing>>(
      ENDPOINTS.LISTINGS.GET_ALL,
      { params: filters }
    );
    // Transform image URLs to absolute URLs
    const data = response.data;
    return {
      ...data,
      data: {
        ...data.data,
        listings: data.data.listings.map(transformListing),
      },
    };
  },

  // Get single listing by ID
  getListingById: async (id: number): Promise<ApiResponse<PropertyListing>> => {
    const response = await apiClient.get<ApiResponse<PropertyListing>>(
      ENDPOINTS.LISTINGS.GET_BY_ID(id)
    );
    // Transform image URLs to absolute URLs
    const data = response.data;
    return {
      ...data,
      data: transformListing(data.data),
    };
  },

  // Create new listing
  createListing: async (data: Partial<PropertyListing>): Promise<ApiResponse<PropertyListing>> => {
    const response = await apiClient.post<ApiResponse<PropertyListing>>(
      ENDPOINTS.LISTINGS.CREATE,
      data
    );
    return response.data;
  },

  // Update existing listing
  updateListing: async (id: number, data: Partial<PropertyListing>): Promise<ApiResponse<PropertyListing>> => {
    const response = await apiClient.put<ApiResponse<PropertyListing>>(
      ENDPOINTS.LISTINGS.UPDATE(id),
      data
    );
    return response.data;
  },

  // Delete listing
  deleteListing: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(
      ENDPOINTS.LISTINGS.DELETE(id)
    );
    return response.data;
  },

  // Update listing status
  updateListingStatus: async (id: number, status: string): Promise<ApiResponse<PropertyListing>> => {
    const response = await apiClient.put<ApiResponse<PropertyListing>>(
      ENDPOINTS.LISTINGS.STATUS(id),
      { status }
    );
    return response.data;
  },

  // Publish/Unpublish listing (backward compatibility)
  publishListing: async (id: number, isPublished: boolean): Promise<ApiResponse<PropertyListing>> => {
    const response = await apiClient.put<ApiResponse<PropertyListing>>(
      ENDPOINTS.LISTINGS.PUBLISH(id),
      { is_published: isPublished }
    );
    return response.data;
  },

  // Get current user's listings (for hosts)
  getMyListings: async (): Promise<PaginatedResponse<PropertyListing>> => {
    const response = await apiClient.get<PaginatedResponse<PropertyListing>>(
      ENDPOINTS.LISTINGS.MY_LISTINGS
    );
    // Transform image URLs to absolute URLs
    const data = response.data;
    return {
      ...data,
      data: {
        ...data.data,
        listings: data.data.listings.map(transformListing),
      },
    };
  },

  // Get all amenities
  getAmenities: async (): Promise<ApiResponse<Amenity[]>> => {
    const response = await apiClient.get<ApiResponse<Amenity[]>>(
      ENDPOINTS.AMENITIES.GET_ALL
    );
    return response.data;
  },
};
