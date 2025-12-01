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
  };
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
};
