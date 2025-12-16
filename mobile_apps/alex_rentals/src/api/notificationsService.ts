import apiClient from './client';
import { API_CONFIG } from './config';

export interface Notification {
  id: number;
  app_id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data: {
    booking_id?: number;
    conversation_id?: number;
    listing_id?: number;
    user_id?: number;
    screen_id?: number;
    [key: string]: any;
  } | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    unread_count: number;
    pagination: {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unread_count: number;
  };
}

export const notificationsService = {
  /**
   * Get user's notifications
   */
  getNotifications: async (params?: {
    page?: number;
    per_page?: number;
    unread_only?: boolean;
  }): Promise<NotificationsResponse> => {
    const response = await apiClient.get(
      `/apps/${API_CONFIG.APP_ID}/notifications`,
      { params }
    );
    return response.data;
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await apiClient.get(
      `/apps/${API_CONFIG.APP_ID}/notifications/unread-count`
    );
    return response.data;
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (notificationId: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(
      `/apps/${API_CONFIG.APP_ID}/notifications/${notificationId}/read`
    );
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ success: boolean; message: string; data: { marked_count: number } }> => {
    const response = await apiClient.put(
      `/apps/${API_CONFIG.APP_ID}/notifications/read-all`
    );
    return response.data;
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (notificationId: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(
      `/apps/${API_CONFIG.APP_ID}/notifications/${notificationId}`
    );
    return response.data;
  },
};

export default notificationsService;
