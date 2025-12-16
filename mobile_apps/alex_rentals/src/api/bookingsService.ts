import apiClient from './client';
import { API_CONFIG } from './config';

export interface Booking {
  id: number;
  listing_id: number;
  guest_user_id: number;
  host_user_id: number;
  check_in_date: string;
  check_out_date: string;
  guests_count: number;
  nights: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  guest_first_name?: string;
  guest_last_name?: string;
  guest_email?: string;
  guest_phone?: string;
  special_requests?: string;
  created_at: string;
  confirmed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  // Joined data
  listing_title?: string;
  city?: string;
  country?: string;
  host_first_name?: string;
  host_last_name?: string;
  host_email?: string;
}

export interface CreateBookingRequest {
  listing_id: number;
  check_in_date: string;
  check_out_date: string;
  guests_count: number;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone?: string;
  special_requests?: string;
}

export interface BookingsResponse {
  success: boolean;
  data: {
    bookings?: Booking[];
    reservations?: Booking[];
    pagination: {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface BookingResponse {
  success: boolean;
  data: {
    booking: Booking;
  };
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  data: {
    booking_id: number;
    status: string;
    check_in_date: string;
    check_out_date: string;
    nights: number;
    total_price: number;
  };
}

export const bookingsService = {
  /**
   * Create a new booking
   */
  createBooking: async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
    const response = await apiClient.post<CreateBookingResponse>(
      `/apps/${API_CONFIG.APP_ID}/bookings`,
      data
    );
    return response.data;
  },

  /**
   * Get user's bookings (as guest)
   */
  getMyBookings: async (params?: {
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<BookingsResponse> => {
    const response = await apiClient.get<BookingsResponse>(
      `/apps/${API_CONFIG.APP_ID}/bookings`,
      { params }
    );
    return response.data;
  },

  /**
   * Get host's reservations (bookings for their listings)
   */
  getMyReservations: async (params?: {
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<BookingsResponse> => {
    const response = await apiClient.get<BookingsResponse>(
      `/apps/${API_CONFIG.APP_ID}/reservations`,
      { params }
    );
    return response.data;
  },

  /**
   * Get single booking details
   */
  getBookingById: async (bookingId: number): Promise<BookingResponse> => {
    const response = await apiClient.get<BookingResponse>(
      `/apps/${API_CONFIG.APP_ID}/bookings/${bookingId}`
    );
    return response.data;
  },

  /**
   * Cancel a booking
   */
  cancelBooking: async (
    bookingId: number,
    cancellation_reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(
      `/apps/${API_CONFIG.APP_ID}/bookings/${bookingId}/cancel`,
      { cancellation_reason }
    );
    return response.data;
  },

  /**
   * Confirm a booking (host only)
   */
  confirmBooking: async (
    bookingId: number
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(
      `/apps/${API_CONFIG.APP_ID}/bookings/${bookingId}/confirm`
    );
    return response.data;
  },

  /**
   * Reject a booking (host only)
   */
  rejectBooking: async (
    bookingId: number,
    rejection_reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(
      `/apps/${API_CONFIG.APP_ID}/bookings/${bookingId}/reject`,
      { rejection_reason }
    );
    return response.data;
  },
};
