import apiClient from './client';
import { API_CONFIG } from './config';

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
    path: string;
    appFolder: string;
    mediaType?: 'image' | 'video';
  };
}

export interface MultiUploadResponse {
  success: boolean;
  message: string;
  data: {
    files: Array<{
      filename: string;
      originalName: string;
      mimetype: string;
      size: number;
      url: string;
      path: string;
      appFolder: string;
      mediaType: 'image' | 'video';
    }>;
    count: number;
  };
}

export interface MediaItem {
  uri: string;
  url?: string;
  type: 'image' | 'video';
  caption?: string;
  isPrimary?: boolean;
  thumbnail?: string;
  duration?: number;
  width?: number;
  height?: number;
}

export const uploadService = {
  /**
   * Upload an image file
   * @param uri - Local file URI from image picker
   * @param fieldName - Form field name (default: 'file')
   * @returns Server URL for the uploaded image
   */
  uploadImage: async (uri: string, fieldName: string = 'file'): Promise<string> => {
    try {
      const formData = new FormData();
      
      // Extract filename from URI
      const filename = uri.split('/').pop() || 'photo.jpg';
      
      // Create file object for upload
      const file = {
        uri,
        type: 'image/jpeg', // Default to JPEG, could be detected from extension
        name: filename,
      } as any;
      
      formData.append(fieldName, file);
      
      const response = await apiClient.post<UploadResponse>(
        `/mobile/apps/${API_CONFIG.APP_ID}/upload/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data.success && response.data.data.url) {
        // Return the server URL
        return `${API_CONFIG.BASE_URL.replace('/api/v1', '')}${response.data.data.url}`;
      }
      
      throw new Error(response.data.message || 'Upload failed');
    } catch (error: any) {
      console.error('Upload error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to upload image');
    }
  },

  /**
   * Upload a video file
   * @param uri - Local file URI from video picker
   * @param fieldName - Form field name (default: 'file')
   * @returns Server URL for the uploaded video
   */
  uploadVideo: async (uri: string, fieldName: string = 'file'): Promise<string> => {
    try {
      const formData = new FormData();
      
      const filename = uri.split('/').pop() || 'video.mp4';
      const extension = filename.split('.').pop()?.toLowerCase() || 'mp4';
      const mimeType = extension === 'mov' ? 'video/quicktime' : `video/${extension}`;
      
      const file = {
        uri,
        type: mimeType,
        name: filename,
      } as any;
      
      formData.append(fieldName, file);
      
      const response = await apiClient.post<UploadResponse>(
        `/mobile/apps/${API_CONFIG.APP_ID}/upload/video`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data.success && response.data.data.url) {
        return `${API_CONFIG.BASE_URL.replace('/api/v1', '')}${response.data.data.url}`;
      }
      
      throw new Error(response.data.message || 'Upload failed');
    } catch (error: any) {
      console.error('Video upload error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to upload video');
    }
  },

  /**
   * Upload multiple media files (images and/or videos)
   * @param items - Array of MediaItem objects with uri and type
   * @returns Array of uploaded file URLs with metadata
   */
  uploadMultipleMedia: async (items: MediaItem[]): Promise<MediaItem[]> => {
    try {
      const formData = new FormData();
      
      items.forEach((item, index) => {
        const filename = item.uri.split('/').pop() || `media_${index}`;
        const extension = filename.split('.').pop()?.toLowerCase() || '';
        
        let mimeType = 'image/jpeg';
        if (item.type === 'video') {
          mimeType = extension === 'mov' ? 'video/quicktime' : `video/${extension || 'mp4'}`;
        } else {
          mimeType = `image/${extension || 'jpeg'}`;
        }
        
        const file = {
          uri: item.uri,
          type: mimeType,
          name: filename,
        } as any;
        
        formData.append('files', file);
      });
      
      const response = await apiClient.post<MultiUploadResponse>(
        `/mobile/apps/${API_CONFIG.APP_ID}/upload/media`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data.success && response.data.data.files) {
        const baseUrl = API_CONFIG.BASE_URL.replace('/api/v1', '');
        return response.data.data.files.map((file, index) => ({
          ...items[index],
          url: `${baseUrl}${file.url}`,
          type: file.mediaType,
        }));
      }
      
      throw new Error(response.data.message || 'Upload failed');
    } catch (error: any) {
      console.error('Multi-upload error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to upload media');
    }
  },

  /**
   * Upload a single media item (image or video)
   * @param item - MediaItem with uri and type
   * @returns Updated MediaItem with server URL
   */
  uploadSingleMedia: async (item: MediaItem): Promise<MediaItem> => {
    try {
      let url: string;
      if (item.type === 'video') {
        url = await uploadService.uploadVideo(item.uri);
      } else {
        url = await uploadService.uploadImage(item.uri);
      }
      return { ...item, url };
    } catch (error) {
      throw error;
    }
  },
};
