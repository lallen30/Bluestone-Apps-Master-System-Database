import apiClient from './client';
import {AppConfig} from '../config/app.config';

const APP_ID = AppConfig.APP_ID;

export interface DriverRegistration {
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year?: number;
  vehicle_color?: string;
  license_plate: string;
  vehicle_type?: 'sedan' | 'suv' | 'van' | 'luxury';
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
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
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
  register: async (
    data: DriverRegistration,
  ): Promise<{driver_profile_id: number}> => {
    const response = await apiClient.post(
      `/apps/${APP_ID}/drivers/register`,
      data,
    );
    return response.data.data;
  },

  getProfile: async (): Promise<{profile: DriverProfile}> => {
    const response = await apiClient.get(`/apps/${APP_ID}/drivers/profile`);
    return response.data.data;
  },

  updateProfile: async (data: Partial<DriverRegistration>): Promise<void> => {
    await apiClient.put(`/apps/${APP_ID}/drivers/profile`, data);
  },

  toggleStatus: async (
    isOnline: boolean,
    latitude?: number,
    longitude?: number,
  ): Promise<{is_online: boolean}> => {
    const response = await apiClient.put(`/apps/${APP_ID}/drivers/status`, {
      is_online: isOnline,
      latitude,
      longitude,
    });
    return response.data.data;
  },

  updateLocation: async (
    latitude: number,
    longitude: number,
  ): Promise<void> => {
    await apiClient.put(`/apps/${APP_ID}/drivers/location`, {
      latitude,
      longitude,
    });
  },

  getEarnings: async (params?: {
    start_date?: string;
    end_date?: string;
    status?: string;
  }): Promise<any> => {
    const response = await apiClient.get(`/apps/${APP_ID}/drivers/earnings`, {
      params,
    });
    return response.data.data;
  },

  getRides: async (params?: {
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<{
    rides: any[];
    pagination: {page: number; per_page: number; total: number; total_pages: number};
  }> => {
    const response = await apiClient.get(`/apps/${APP_ID}/drivers/rides`, {
      params,
    });
    return response.data.data;
  },

  getAvailableRides: async (
    latitude?: number,
    longitude?: number,
  ): Promise<{rides: AvailableRide[]}> => {
    const response = await apiClient.get(
      `/apps/${APP_ID}/drivers/available-rides`,
      {
        params: {latitude, longitude},
      },
    );
    return response.data.data;
  },

  getDriverById: async (
    driverId: number,
  ): Promise<{driver: DriverProfile; reviews: any[]}> => {
    const response = await apiClient.get(`/apps/${APP_ID}/drivers/${driverId}`);
    return response.data.data;
  },
};

export default driversService;
