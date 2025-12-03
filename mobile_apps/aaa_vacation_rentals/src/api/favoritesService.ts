import apiClient from './client';
import { API_CONFIG } from './config';

export interface FavoriteListing {
  favorite_id: number;
  favorited_at: string;
  id: number;
  title: string;
  description: string;
  property_type: string;
  city: string;
  state: string;
  country: string;
  price_per_night: string;
  bedrooms: number;
  bathrooms: number;
  guests_max: number;
  status: string;
  primary_image: string | null;
  host_first_name: string;
  host_last_name: string;
}

export interface FavoritesResponse {
  success: boolean;
  data: {
    favorites: FavoriteListing[];
    pagination: {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface FavoriteCheckResponse {
  success: boolean;
  data: {
    is_favorited: boolean;
    listing_id: number;
  };
}

export interface BatchCheckResponse {
  success: boolean;
  data: {
    favorited_ids: number[];
  };
}

// Helper function to convert relative image URLs to absolute URLs
const transformImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_CONFIG.SERVER_URL}${url}`;
};

export const favoritesService = {
  /**
   * Get user's favorite listings
   */
  getFavorites: async (params?: { page?: number; per_page?: number }): Promise<FavoritesResponse> => {
    const response = await apiClient.get<FavoritesResponse>(
      `/apps/${API_CONFIG.APP_ID}/favorites`,
      { params }
    );
    // Transform image URLs
    const data = response.data;
    return {
      ...data,
      data: {
        ...data.data,
        favorites: data.data.favorites.map(fav => ({
          ...fav,
          primary_image: transformImageUrl(fav.primary_image),
        })),
      },
    };
  },

  /**
   * Add listing to favorites
   */
  addFavorite: async (listingId: number): Promise<{ success: boolean; message: string; data: { favorite_id: number; listing_id: number } }> => {
    const response = await apiClient.post(
      `/apps/${API_CONFIG.APP_ID}/favorites`,
      { listing_id: listingId }
    );
    return response.data;
  },

  /**
   * Remove listing from favorites
   */
  removeFavorite: async (listingId: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(
      `/apps/${API_CONFIG.APP_ID}/favorites/${listingId}`
    );
    return response.data;
  },

  /**
   * Check if listing is favorited
   */
  checkFavorite: async (listingId: number): Promise<FavoriteCheckResponse> => {
    const response = await apiClient.get<FavoriteCheckResponse>(
      `/apps/${API_CONFIG.APP_ID}/favorites/check/${listingId}`
    );
    return response.data;
  },

  /**
   * Batch check if listings are favorited
   */
  batchCheckFavorites: async (listingIds: number[]): Promise<BatchCheckResponse> => {
    const response = await apiClient.post<BatchCheckResponse>(
      `/apps/${API_CONFIG.APP_ID}/favorites/batch-check`,
      { listing_ids: listingIds }
    );
    return response.data;
  },

  /**
   * Toggle favorite status
   */
  toggleFavorite: async (listingId: number, isFavorited: boolean): Promise<boolean> => {
    if (isFavorited) {
      await favoritesService.removeFavorite(listingId);
      return false;
    } else {
      await favoritesService.addFavorite(listingId);
      return true;
    }
  },
};
