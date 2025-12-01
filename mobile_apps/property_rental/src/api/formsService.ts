import apiClient from './client';
import { API_CONFIG } from './config';

export interface FormElement {
  id: number;
  element_id: number;
  element_type: string;
  element_name: string;
  field_key: string;
  label: string;
  placeholder?: string;
  default_value?: string;
  help_text?: string;
  is_required: boolean;
  display_order: number;
  validation_rules?: any;
  config?: any;
  // Override fields (if app has customized this field)
  has_override?: number;
  custom_label?: string;
  custom_placeholder?: string;
  custom_default_value?: string;
  custom_help_text?: string;
  is_required_override?: boolean;
  is_hidden?: boolean;
}

export interface Form {
  id: number;
  name: string;
  form_key: string;
  form_type: string;
  elements: FormElement[];
}

class FormsService {
  /**
   * Get form elements with app-specific overrides
   */
  async getFormElements(formId: number): Promise<FormElement[]> {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.BASE_URL}/mobile/apps/${API_CONFIG.APP_ID}/forms/${formId}/elements`
      );
      
      if (response.data.success) {
        return response.data.elements || [];
      }
      
      throw new Error('Failed to fetch form elements');
    } catch (error) {
      console.error('Error fetching form elements:', error);
      throw error;
    }
  }

  /**
   * Get form by ID
   */
  async getFormById(formId: number): Promise<Form> {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.BASE_URL}/forms/${formId}`
      );
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Failed to fetch form');
    } catch (error) {
      console.error('Error fetching form:', error);
      throw error;
    }
  }
}

export const formsService = new FormsService();
