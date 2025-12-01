import apiClient from './client';
import { API_CONFIG } from './config';

export interface Conversation {
  id: number;
  listing_id?: number;
  last_message_at?: string;
  last_message_preview?: string;
  created_at: string;
  listing_title?: string;
  listing_city?: string;
  other_user_id: number;
  other_user_first_name: string;
  other_user_last_name: string;
  unread_count: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  message_text: string;
  attachment_url?: string;
  attachment_type?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  sender_first_name: string;
  sender_last_name: string;
}

export interface ConversationsResponse {
  success: boolean;
  data: {
    conversations: Conversation[];
    pagination: {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface MessagesResponse {
  success: boolean;
  data: {
    messages: Message[];
    pagination: {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface StartConversationRequest {
  other_user_id: number;
  listing_id?: number;
  initial_message?: string;
}

export interface StartConversationResponse {
  success: boolean;
  data: {
    conversation_id: number;
    message: string;
  };
}

export const messagesService = {
  /**
   * Start or get existing conversation
   */
  startConversation: async (data: StartConversationRequest): Promise<StartConversationResponse> => {
    const response = await apiClient.post<StartConversationResponse>(
      `/apps/${API_CONFIG.APP_ID}/conversations`,
      data
    );
    return response.data;
  },

  /**
   * Get user's conversations
   */
  getConversations: async (params?: {
    page?: number;
    per_page?: number;
  }): Promise<ConversationsResponse> => {
    const response = await apiClient.get<ConversationsResponse>(
      `/apps/${API_CONFIG.APP_ID}/conversations`,
      { params }
    );
    return response.data;
  },

  /**
   * Get messages in a conversation
   */
  getMessages: async (
    conversationId: number,
    params?: {
      page?: number;
      per_page?: number;
    }
  ): Promise<MessagesResponse> => {
    const response = await apiClient.get<MessagesResponse>(
      `/apps/${API_CONFIG.APP_ID}/conversations/${conversationId}/messages`,
      { params }
    );
    return response.data;
  },

  /**
   * Send a message
   */
  sendMessage: async (
    conversationId: number,
    message_text: string,
    attachment_url?: string,
    attachment_type?: string
  ): Promise<{ success: boolean; message: string; data: { message: Message } }> => {
    const response = await apiClient.post(
      `/apps/${API_CONFIG.APP_ID}/conversations/${conversationId}/messages`,
      {
        message_text,
        attachment_url,
        attachment_type,
      }
    );
    return response.data;
  },

  /**
   * Mark messages as read
   */
  markAsRead: async (conversationId: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(
      `/apps/${API_CONFIG.APP_ID}/conversations/${conversationId}/read`
    );
    return response.data;
  },

  /**
   * Archive conversation
   */
  archiveConversation: async (
    conversationId: number
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(
      `/apps/${API_CONFIG.APP_ID}/conversations/${conversationId}`
    );
    return response.data;
  },
};
