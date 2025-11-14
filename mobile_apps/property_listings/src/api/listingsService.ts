import apiClient from './client';
import { ENDPOINTS } from './config';
import { PropertyListing, PaginatedResponse, ListingsFilter, ApiResponse, Amenity } from '../types';

export const listingsService = {
  // Get all listings with optional filters
  getListings: async (filters?: ListingsFilter): Promise<PaginatedResponse<PropertyListing>> => {
    const response = await apiClient.get<PaginatedResponse<PropertyListing>>(
      ENDPOINTS.LISTINGS.GET_ALL,
      { params: filters }
    );
    return response.data;
  },

  // Get single listing by ID
  getListingById: async (id: number): Promise<ApiResponse<PropertyListing>> => {
    const response = await apiClient.get<ApiResponse<PropertyListing>>(
      ENDPOINTS.LISTINGS.GET_BY_ID(id)
    );
    return response.data;
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

  // Publish/Unpublish listing
  publishListing: async (id: number, isPublished: boolean): Promise<ApiResponse<PropertyListing>> => {
    const response = await apiClient.put<ApiResponse<PropertyListing>>(
      ENDPOINTS.LISTINGS.PUBLISH(id),
      { is_published: isPublished }
    );
    return response.data;
  },

  // Get all amenities
  getAmenities: async (): Promise<ApiResponse<Amenity[]>> => {
    const response = await apiClient.get<ApiResponse<Amenity[]>>(
      ENDPOINTS.AMENITIES.GET_ALL
    );
    return response.data;
  },
};
