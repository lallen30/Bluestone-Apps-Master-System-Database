import apiClient from './client';
import { API_CONFIG } from './config';

export interface UserProfile {
  id: number;
  app_id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip_code: string | null;
  email_verified: boolean;
  status: 'active' | 'inactive' | 'suspended' | 'deleted';
  created_at: string;
  updated_at: string;
}

export interface ProfileStats {
  listings_count: number;
  bookings_as_guest: number;
  bookings_as_host: number;
  favorites_count: number;
  reviews_count: number;
}

export interface ProfileResponse {
  success: boolean;
  data: {
    profile: UserProfile;
    stats: ProfileStats;
  };
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  date_of_birth?: string | null;
  gender?: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | null;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
}

// Helper function to convert relative image URLs to absolute URLs
const transformAvatarUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_CONFIG.SERVER_URL}${url}`;
};

export const profileService = {
  /**
   * Get current user's profile
   */
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<ProfileResponse>(
      `/apps/${API_CONFIG.APP_ID}/profile`
    );
    // Transform avatar URL
    const data = response.data;
    return {
      ...data,
      data: {
        ...data.data,
        profile: {
          ...data.data.profile,
          avatar_url: transformAvatarUrl(data.data.profile.avatar_url),
        },
      },
    };
  },

  /**
   * Update current user's profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<{ success: boolean; message: string; data: { profile: UserProfile } }> => {
    const response = await apiClient.put(
      `/apps/${API_CONFIG.APP_ID}/profile`,
      data
    );
    // Transform avatar URL
    const result = response.data;
    return {
      ...result,
      data: {
        ...result.data,
        profile: {
          ...result.data.profile,
          avatar_url: transformAvatarUrl(result.data.profile.avatar_url),
        },
      },
    };
  },

  /**
   * Upload avatar
   */
  uploadAvatar: async (imageUri: string): Promise<{ success: boolean; message: string; data: { avatar_url: string } }> => {
    const formData = new FormData();
    
    // Get file extension
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    
    formData.append('avatar', {
      uri: imageUri,
      name: `avatar.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    const response = await apiClient.post(
      `/apps/${API_CONFIG.APP_ID}/profile/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    // Transform avatar URL
    const result = response.data;
    return {
      ...result,
      data: {
        avatar_url: transformAvatarUrl(result.data.avatar_url) || '',
      },
    };
  },

  /**
   * Delete avatar
   */
  deleteAvatar: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(
      `/apps/${API_CONFIG.APP_ID}/profile/avatar`
    );
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(
      `/apps/${API_CONFIG.APP_ID}/profile/password`,
      {
        current_password: currentPassword,
        new_password: newPassword,
      }
    );
    return response.data;
  },
};
