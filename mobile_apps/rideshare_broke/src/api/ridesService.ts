import apiClient from './client';
import { AppConfig } from '../config/app.config';

const APP_ID = AppConfig.APP_ID;

export interface RideLocation {
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface RideRequest {
  pickup_address: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  destination_address: string;
  destination_latitude?: number;
  destination_longitude?: number;
  ride_type?: 'standard' | 'premium' | 'xl' | 'luxury';
  promo_code?: string;
  ride_notes?: string;
}

export interface Ride {
  id: number;
  app_id: number;
  rider_id: number;
  driver_id?: number;
  pickup_address: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  destination_address: string;
  destination_latitude?: number;
  destination_longitude?: number;
  ride_type: string;
  estimated_fare?: number;
  actual_fare?: number;
  distance_km?: number;
  duration_minutes?: number;
  status: string;
  requested_at: string;
  driver_assigned_at?: string;
  pickup_at?: string;
  dropoff_at?: string;
  cancelled_at?: string;
  promo_code?: string;
  ride_notes?: string;
  // Driver info (joined)
  driver_first_name?: string;
  driver_last_name?: string;
  driver_rating?: number;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  license_plate?: string;
  driver_latitude?: number;
  driver_longitude?: number;
  driver_phone?: string;
}

export interface RideRating {
  rating: number;
  comment?: string;
}

export const ridesService = {
  /**
   * Request a new ride
   */
  requestRide: async (data: RideRequest): Promise<{ ride: Ride; estimated_fare: number; promo_discount: number }> => {
    const response = await apiClient.post(`/apps/${APP_ID}/rides`, data);
    return response.data.data;
  },

  /**
   * Get ride history
   */
  getRideHistory: async (params?: { status?: string; page?: number; per_page?: number }): Promise<{
    rides: Ride[];
    pagination: { page: number; per_page: number; total: number; total_pages: number };
  }> => {
    const response = await apiClient.get(`/apps/${APP_ID}/rides`, { params });
    return response.data.data;
  },

  /**
   * Get ride by ID
   */
  getRideById: async (rideId: number): Promise<{ ride: Ride; payment?: any; my_review?: any }> => {
    const response = await apiClient.get(`/apps/${APP_ID}/rides/${rideId}`);
    return response.data.data;
  },

  /**
   * Get active ride
   */
  getActiveRide: async (): Promise<{ ride: Ride | null }> => {
    const response = await apiClient.get(`/apps/${APP_ID}/rides/active`);
    return response.data.data;
  },

  /**
   * Cancel ride
   */
  cancelRide: async (rideId: number, reason?: string): Promise<void> => {
    await apiClient.put(`/apps/${APP_ID}/rides/${rideId}/cancel`, { cancellation_reason: reason });
  },

  /**
   * Rate ride
   */
  rateRide: async (rideId: number, rating: RideRating): Promise<void> => {
    await apiClient.put(`/apps/${APP_ID}/rides/${rideId}/rate`, rating);
  },

  /**
   * Update ride status (driver only)
   */
  updateRideStatus: async (rideId: number, status: string): Promise<void> => {
    await apiClient.put(`/apps/${APP_ID}/rides/${rideId}/status`, { status });
  },

  /**
   * Accept ride (driver only)
   */
  acceptRide: async (rideId: number): Promise<void> => {
    await apiClient.put(`/apps/${APP_ID}/rides/${rideId}/accept`);
  },
};

export default ridesService;
