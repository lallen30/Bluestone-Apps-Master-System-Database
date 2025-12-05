import apiClient from './client';
import { AppConfig } from '../config/app.config';

const APP_ID = AppConfig.APP_ID;

export interface DriverRegistration {
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year?: number;
  vehicle_color?: string;
  license_plate: string;
  vehicle_type?: 'sedan' | 'suv' | 'van' | 'luxury';
  drivers_license_url?: string;
  vehicle_registration_url?: string;
  insurance_url?: string;
}

export interface DriverProfile {
  id: number;
  app_id: number;
  user_id: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year?: number;
  vehicle_color?: string;
  license_plate: string;
  vehicle_type: string;
  total_rides: number;
  rating: number;
  total_ratings: number;
  acceptance_rate: number;
  cancellation_rate: number;
  is_verified: boolean;
  is_online: boolean;
  current_latitude?: number;
  current_longitude?: number;
  profile_photo_url?: string;
  vehicle_photo_url?: string;
  // User info (joined)
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
}

export interface DriverEarnings {
  summary: {
    total_gross: number;
    total_net: number;
    total_tips: number;
    total_fees: number;
    total_rides: number;
  };
  by_status: Array<{ status: string; amount: number; count: number }>;
  recent_earnings: Array<{
    id: number;
    ride_id: number;
    gross_amount: number;
    net_amount: number;
    tip_amount: number;
    status: string;
    pickup_address: string;
    destination_address: string;
    created_at: string;
  }>;
}

export interface AvailableRide {
  id: number;
  pickup_address: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  destination_address: string;
  destination_latitude?: number;
  destination_longitude?: number;
  ride_type: string;
  estimated_fare: number;
  requested_at: string;
  rider_first_name: string;
  rider_last_name: string;
}

export const driversService = {
  /**
   * Register as a driver
   */
  register: async (data: DriverRegistration): Promise<{ driver_profile_id: number }> => {
    const response = await apiClient.post(`/apps/${APP_ID}/drivers/register`, data);
    return response.data.data;
  },

  /**
   * Get driver profile
   */
  getProfile: async (): Promise<{ profile: DriverProfile }> => {
    const response = await apiClient.get(`/apps/${APP_ID}/drivers/profile`);
    return response.data.data;
  },

  /**
   * Update driver profile
   */
  updateProfile: async (data: Partial<DriverRegistration & { profile_photo_url?: string; vehicle_photo_url?: string }>): Promise<void> => {
    await apiClient.put(`/apps/${APP_ID}/drivers/profile`, data);
  },

  /**
   * Toggle online/offline status
   */
  toggleStatus: async (isOnline: boolean, latitude?: number, longitude?: number): Promise<{ is_online: boolean }> => {
    const response = await apiClient.put(`/apps/${APP_ID}/drivers/status`, {
      is_online: isOnline,
      latitude,
      longitude,
    });
    return response.data.data;
  },

  /**
   * Update driver location
   */
  updateLocation: async (latitude: number, longitude: number): Promise<void> => {
    await apiClient.put(`/apps/${APP_ID}/drivers/location`, { latitude, longitude });
  },

  /**
   * Get driver earnings
   */
  getEarnings: async (params?: { start_date?: string; end_date?: string; status?: string }): Promise<DriverEarnings> => {
    const response = await apiClient.get(`/apps/${APP_ID}/drivers/earnings`, { params });
    return response.data.data;
  },

  /**
   * Get driver's rides
   */
  getRides: async (params?: { status?: string; page?: number; per_page?: number }): Promise<{
    rides: any[];
    pagination: { page: number; per_page: number; total: number; total_pages: number };
  }> => {
    const response = await apiClient.get(`/apps/${APP_ID}/drivers/rides`, { params });
    return response.data.data;
  },

  /**
   * Get available ride requests
   */
  getAvailableRides: async (latitude?: number, longitude?: number): Promise<{ rides: AvailableRide[] }> => {
    const response = await apiClient.get(`/apps/${APP_ID}/drivers/available-rides`, {
      params: { latitude, longitude },
    });
    return response.data.data;
  },

  /**
   * Get driver by ID (public profile)
   */
  getDriverById: async (driverId: number): Promise<{ driver: DriverProfile; reviews: any[] }> => {
    const response = await apiClient.get(`/apps/${APP_ID}/drivers/${driverId}`);
    return response.data.data;
  },
};

export default driversService;
