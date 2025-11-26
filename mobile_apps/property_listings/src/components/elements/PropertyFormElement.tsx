import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { listingsService } from '../../api/listingsService';
import { formsService, FormElement } from '../../api/formsService';
import { useAuth } from '../../context/AuthContext';

interface ScreenElement {
  id: number;
  element_type: string;
  form_id?: number;
  form_name?: string;
  form_key?: string;
  form_type?: string;
  config?: any;
  default_config?: any;
}

interface PropertyFormElementProps {
  element: ScreenElement;
  navigation: any;
  route: any;
}

export const PropertyFormElement: React.FC<PropertyFormElementProps> = ({ element, navigation, route }) => {
  const { user } = useAuth();
  
  // Extract config
  const config = element.config || element.default_config || {};
  const {
    mode = 'create', // 'create' or 'edit'
    success_navigation = 'MyListings',
    enable_draft = true,
  } = config;

  // Get listing ID if editing
  const listingId = route.params?.listingId;
  const isEditMode = mode === 'edit' && listingId;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    fetchFormFields();
  }, [element.form_id]);

  useEffect(() => {
    if (isEditMode) {
      fetchListing();
    }
  }, [listingId]);

  const fetchFormFields = async () => {
    if (!element.form_id) {
      Alert.alert('Error', 'No form linked to this element');
      setLoading(false);
      return;
    }

    try {
      const elements = await formsService.getFormElements(element.form_id);
      
      // Filter out hidden elements
      const visibleElements = elements.filter(el => !el.is_hidden);
      setFormElements(visibleElements);
      
      // Initialize form data with default values
      const initialData: { [key: string]: any } = {};
      visibleElements.forEach(el => {
        const effectiveDefault = el.custom_default_value || el.default_value || '';
        initialData[el.field_key] = effectiveDefault;
      });
      setFormData(initialData);
    } catch (error) {
      console.error('Error fetching form fields:', error);
      Alert.alert('Error', 'Unable to load form fields');
    } finally {
      setLoading(false);
    }
  };

  const fetchListing = async () => {
    try {
      const response = await listingsService.getListingById(listingId);
      const listing = response.data as any;
      
      // Populate form data from listing
      const updatedData = { ...formData };
      Object.keys(listing).forEach(key => {
        if (updatedData.hasOwnProperty(key)) {
          updatedData[key] = listing[key]?.toString() || '';
        }
      });
      setFormData(updatedData);
    } catch (error) {
      console.error('Error fetching listing:', error);
      Alert.alert('Error', 'Unable to load property details');
      navigation.goBack();
    }
  };

  const validateForm = () => {
    // Check required fields
    for (const element of formElements) {
      const isRequired = element.is_required_override !== undefined 
        ? element.is_required_override 
        : element.is_required;
      
      if (isRequired) {
        const value = formData[element.field_key];
        if (!value || (typeof value === 'string' && !value.trim())) {
          const label = element.custom_label || element.label;
          Alert.alert('Error', `Please enter ${label}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Convert form data to listing data
      const listingData: any = { ...formData };
      listingData.status = 'draft'; // Start as draft

      if (isEditMode) {
        await listingsService.updateListing(listingId, listingData);
        Alert.alert('Success', 'Property updated successfully!', [
          { text: 'OK', onPress: () => navigation.navigate(success_navigation) }
        ]);
      } else {
        await listingsService.createListing(listingData);
        Alert.alert('Success', 'Property created successfully!', [
          { text: 'OK', onPress: () => navigation.navigate(success_navigation) }
        ]);
      }
    } catch (error: any) {
      console.error('Error saving listing:', error);
      Alert.alert('Error', error.response?.data?.message || 'Unable to save property');
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormField = (element: FormElement) => {
    const label = element.custom_label || element.label;
    const placeholder = element.custom_placeholder || element.placeholder || '';
    const isRequired = element.is_required_override !== undefined 
      ? element.is_required_override 
      : element.is_required;
    const value = formData[element.field_key] || '';

    const handleChange = (newValue: any) => {
      setFormData({ ...formData, [element.field_key]: newValue });
    };

    // Render based on element type
    switch (element.element_type) {
      case 'text_area':
        return (
          <View key={element.id} style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{label} {isRequired && '*'}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={value}
              onChangeText={handleChange}
              placeholder={placeholder}
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>
        );

      case 'dropdown':
        const options = element.config?.options || [];
        console.log('[PropertyFormElement] Dropdown field:', element.field_key);
        console.log('[PropertyFormElement] Options:', options);
        console.log('[PropertyFormElement] Config:', element.config);
        
        if (!options || options.length === 0) {
          return (
            <View key={element.id} style={{ marginBottom: 16 }}>
              <Text style={styles.label}>{label} {isRequired && '*'}</Text>
              <View style={[styles.input, { justifyContent: 'center', backgroundColor: '#ffcccc' }]}>
                <Text style={{ color: '#999' }}>No options configured</Text>
              </View>
            </View>
          );
        }
        
        return (
          <View key={element.id} style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{label} {isRequired && '*'}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={value || ''}
                onValueChange={(itemValue) => {
                  console.log('Picker changed:', itemValue);
                  handleChange(itemValue);
                }}
              >
                <Picker.Item 
                  label={placeholder || `Select ${label}`} 
                  value="" 
                  color="#999"
                />
                {options.map((opt: any) => (
                  <Picker.Item 
                    key={opt.value} 
                    label={opt.label} 
                    value={opt.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>
        );

      default: // text_field, number, email, etc.
        return (
          <View key={element.id} style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{label} {isRequired && '*'}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={handleChange}
              placeholder={placeholder}
              placeholderTextColor="#999"
              keyboardType={element.element_type === 'number' ? 'decimal-pad' : 'default'}
            />
          </View>
        );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading form...</Text>
      </View>
    );
  }

  if (formElements.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No form fields found</Text>
        <Text style={{ marginTop: 10, color: '#999' }}>form_id: {element.form_id}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {formElements.map(renderFormField)}

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isEditMode ? 'Update Property' : 'Create Property'}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

export default PropertyFormElement;
