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
  Image,
  ActionSheetIOS,
  Platform,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { listingsService } from '../../api/listingsService';
import { formsService, FormElement } from '../../api/formsService';
import { uploadService } from '../../api/uploadService';
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
  
  // Extract config - handle both string and object
  let rawConfig = element.config || element.default_config || {};
  if (typeof rawConfig === 'string') {
    try {
      rawConfig = JSON.parse(rawConfig);
    } catch (e) {
      console.error('Failed to parse config:', e);
      rawConfig = {};
    }
  }
  const config = rawConfig;
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
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState<string | null>(null);
  const [tempTime, setTempTime] = useState<Date>(new Date());

  useEffect(() => {
    fetchFormFields();
  }, [element.form_id]);

  useEffect(() => {
    // Only fetch listing after form elements are loaded
    if (isEditMode && formElements.length > 0) {
      fetchListing();
    }
  }, [listingId, formElements.length]);

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
      
      console.log('[PropertyFormElement] Fetched listing for edit:', listing);
      
      // Populate form data from listing
      const updatedData: { [key: string]: any } = {};
      
      // Map all form field keys from the listing data
      formElements.forEach(el => {
        const key = el.field_key;
        if (listing.hasOwnProperty(key)) {
          // Handle different data types
          const value = listing[key];
          if (value === null || value === undefined) {
            updatedData[key] = '';
          } else if (typeof value === 'boolean') {
            updatedData[key] = value;
          } else if (typeof value === 'number') {
            updatedData[key] = value.toString();
          } else {
            updatedData[key] = value;
          }
        } else {
          // Keep default value if field not in listing
          updatedData[key] = formData[key] || '';
        }
      });
      
      // Handle primary_image from listing's primary_image field
      if (listing.primary_image) {
        updatedData['primary_image'] = listing.primary_image;
      }
      
      console.log('[PropertyFormElement] Populated form data:', updatedData);
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
      
      // Handle primary_image - convert to images array for backend
      if (listingData.primary_image) {
        listingData.images = [{
          image_url: listingData.primary_image,
          is_primary: true,
        }];
        delete listingData.primary_image;
      }

      const navigateToListings = () => {
        // Navigate to My Listings screen (ID: 129)
        navigation.navigate('DynamicScreen', {
          screenId: 129,
          screenName: 'My Listings',
        });
      };

      console.log('[PropertyFormElement] Submitting listing data:', JSON.stringify(listingData, null, 2));
      
      if (isEditMode) {
        await listingsService.updateListing(listingId, listingData);
        Alert.alert('Success', 'Property updated successfully!', [
          { text: 'OK', onPress: navigateToListings }
        ]);
      } else {
        const result = await listingsService.createListing(listingData);
        console.log('[PropertyFormElement] Create result:', result);
        Alert.alert('Success', 'Property created successfully!', [
          { text: 'OK', onPress: navigateToListings }
        ]);
      }
    } catch (error: any) {
      console.error('Error saving listing:', error);
      console.error('Error response:', error.response?.data);
      Alert.alert('Error', error.response?.data?.message || error.message || 'Unable to save property');
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

    // Parse element config if string
    let elementConfig = element.config || {};
    if (typeof elementConfig === 'string') {
      try {
        elementConfig = JSON.parse(elementConfig);
      } catch (e) {
        elementConfig = {};
      }
    }

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

      case 'number_input':
        return (
          <View key={element.id} style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{label} {isRequired && '*'}</Text>
            <TextInput
              style={styles.input}
              value={value?.toString() || ''}
              onChangeText={(text) => handleChange(text.replace(/[^0-9]/g, ''))}
              placeholder={placeholder || '0'}
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>
        );

      case 'currency_input':
        return (
          <View key={element.id} style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{label} {isRequired && '*'}</Text>
            <View style={styles.currencyInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.input, styles.currencyInput]}
                value={value?.toString() || ''}
                onChangeText={(text) => handleChange(text.replace(/[^0-9.]/g, ''))}
                placeholder={placeholder || '0.00'}
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        );

      case 'switch_toggle':
        return (
          <View key={element.id} style={styles.switchContainer}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
              style={[styles.switch, value && styles.switchActive]}
              onPress={() => handleChange(!value)}
            >
              <View style={[styles.switchThumb, value && styles.switchThumbActive]} />
            </TouchableOpacity>
          </View>
        );

      case 'time_picker':
        const timeFieldKey = element.field_key;
        const displayTime = value || placeholder || 'Select time';
        
        // Parse existing time value to Date object for picker
        const parseTimeToDate = (timeStr: string): Date => {
          const date = new Date();
          if (timeStr) {
            const parts = timeStr.split(':');
            if (parts.length >= 2) {
              date.setHours(parseInt(parts[0], 10) || 0);
              date.setMinutes(parseInt(parts[1], 10) || 0);
            }
          }
          return date;
        };

        const formatTimeFromDate = (date: Date): string => {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        };

        const openTimePicker = () => {
          setTempTime(parseTimeToDate(value || ''));
          setShowTimePicker(timeFieldKey);
        };

        const handleTimeChange = (event: any, selectedDate?: Date) => {
          if (Platform.OS === 'android') {
            setShowTimePicker(null);
            if (event.type === 'set' && selectedDate) {
              handleChange(formatTimeFromDate(selectedDate));
            }
          } else if (selectedDate) {
            setTempTime(selectedDate);
          }
        };

        const confirmTime = () => {
          handleChange(formatTimeFromDate(tempTime));
          setShowTimePicker(null);
        };

        return (
          <View key={element.id} style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{label} {isRequired && '*'}</Text>
            <TouchableOpacity 
              style={styles.timePickerButton}
              onPress={openTimePicker}
            >
              <Icon name="clock-outline" size={20} color="#666" />
              <Text style={[styles.timePickerText, !value && { color: '#999' }]}>
                {displayTime}
              </Text>
            </TouchableOpacity>
            
            {showTimePicker === timeFieldKey && Platform.OS === 'android' && (
              <DateTimePicker
                value={tempTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}
            
            {showTimePicker === timeFieldKey && Platform.OS === 'ios' && (
              <Modal
                transparent
                animationType="slide"
                visible={true}
                onRequestClose={() => setShowTimePicker(null)}
              >
                <View style={styles.timePickerModal}>
                  <View style={styles.timePickerContainer}>
                    <View style={styles.timePickerHeader}>
                      <TouchableOpacity onPress={() => setShowTimePicker(null)}>
                        <Text style={styles.timePickerCancel}>Cancel</Text>
                      </TouchableOpacity>
                      <Text style={styles.timePickerTitle}>{label}</Text>
                      <TouchableOpacity onPress={confirmTime}>
                        <Text style={styles.timePickerDone}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={tempTime}
                      mode="time"
                      is24Hour={true}
                      display="spinner"
                      onChange={handleTimeChange}
                      style={{ height: 200 }}
                    />
                  </View>
                </View>
              </Modal>
            )}
          </View>
        );

      case 'image_upload':
        const fieldKey = element.field_key;
        const isUploading = uploadingImage === fieldKey;
        
        const handleImagePick = () => {
          const options = ['Take Photo', 'Choose from Library', 'Cancel'];
          
          if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options,
                cancelButtonIndex: 2,
              },
              (buttonIndex) => {
                if (buttonIndex === 0) {
                  openCamera(fieldKey, handleChange);
                } else if (buttonIndex === 1) {
                  openGallery(fieldKey, handleChange);
                }
              }
            );
          } else {
            Alert.alert('Select Image', 'Choose an option', [
              { text: 'Take Photo', onPress: () => openCamera(fieldKey, handleChange) },
              { text: 'Choose from Library', onPress: () => openGallery(fieldKey, handleChange) },
              { text: 'Cancel', style: 'cancel' },
            ]);
          }
        };

        const openCamera = async (key: string, onChange: (val: string) => void) => {
          try {
            const result = await launchCamera({
              mediaType: 'photo',
              quality: 0.8,
              maxWidth: 1200,
              maxHeight: 1200,
            });
            
            if (result.assets && result.assets[0]) {
              await uploadImage(result.assets[0], key, onChange);
            }
          } catch (error) {
            console.error('Camera error:', error);
            Alert.alert('Error', 'Failed to open camera');
          }
        };

        const openGallery = async (key: string, onChange: (val: string) => void) => {
          try {
            const result = await launchImageLibrary({
              mediaType: 'photo',
              quality: 0.8,
              maxWidth: 1200,
              maxHeight: 1200,
            });
            
            if (result.assets && result.assets[0]) {
              await uploadImage(result.assets[0], key, onChange);
            }
          } catch (error) {
            console.error('Gallery error:', error);
            Alert.alert('Error', 'Failed to open gallery');
          }
        };

        const uploadImage = async (asset: any, key: string, onChange: (val: string) => void) => {
          try {
            setUploadingImage(key);
            
            // uploadService.uploadImage expects a URI string
            const imageUrl = await uploadService.uploadImage(asset.uri);
            onChange(imageUrl);
            Alert.alert('Success', 'Image uploaded successfully');
          } catch (error: any) {
            console.error('Upload error:', error);
            Alert.alert('Error', error.message || 'Failed to upload image');
          } finally {
            setUploadingImage(null);
          }
        };

        return (
          <View key={element.id} style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{label} {isRequired && '*'}</Text>
            
            {value ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: value }} style={styles.imagePreview} />
                <View style={styles.imageActions}>
                  <TouchableOpacity 
                    style={styles.imageActionButton}
                    onPress={handleImagePick}
                    disabled={isUploading}
                  >
                    <Icon name="pencil" size={20} color="#007AFF" />
                    <Text style={styles.imageActionText}>Change</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.imageActionButton}
                    onPress={() => handleChange('')}
                    disabled={isUploading}
                  >
                    <Icon name="delete" size={20} color="#FF3B30" />
                    <Text style={[styles.imageActionText, { color: '#FF3B30' }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.imageUploadButton}
                onPress={handleImagePick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator color="#007AFF" />
                ) : (
                  <>
                    <Icon name="camera-plus" size={32} color="#007AFF" />
                    <Text style={styles.imageUploadText}>Upload Image</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        );

      case 'media_gallery':
        // Media gallery for multiple images and videos
        const MediaGalleryElement = require('./MediaGalleryElement').default;
        return (
          <MediaGalleryElement
            key={element.id}
            element={element}
            value={Array.isArray(value) ? value : []}
            onChange={handleChange}
            disabled={false}
          />
        );

      case 'dropdown':
      case 'country_selector':
      case 'currency_selector':
        let options = elementConfig?.options || [];
        
        // Default options for country selector
        if (element.element_type === 'country_selector' && options.length === 0) {
          options = [
            { value: 'US', label: 'United States' },
            { value: 'CA', label: 'Canada' },
            { value: 'UK', label: 'United Kingdom' },
            { value: 'AU', label: 'Australia' },
            { value: 'DE', label: 'Germany' },
            { value: 'FR', label: 'France' },
            { value: 'ES', label: 'Spain' },
            { value: 'IT', label: 'Italy' },
            { value: 'MX', label: 'Mexico' },
            { value: 'JP', label: 'Japan' },
          ];
        }
        
        // Default options for currency selector
        if (element.element_type === 'currency_selector' && options.length === 0) {
          options = [
            { value: 'USD', label: 'USD - US Dollar' },
            { value: 'EUR', label: 'EUR - Euro' },
            { value: 'GBP', label: 'GBP - British Pound' },
            { value: 'CAD', label: 'CAD - Canadian Dollar' },
            { value: 'AUD', label: 'AUD - Australian Dollar' },
          ];
        }
        
        if (options.length === 0) {
          return (
            <View key={element.id} style={{ marginBottom: 16 }}>
              <Text style={styles.label}>{label} {isRequired && '*'}</Text>
              <View style={[styles.input, { justifyContent: 'center' }]}>
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
                onValueChange={(itemValue) => handleChange(itemValue)}
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

      default: // text_field, etc.
        return (
          <View key={element.id} style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{label} {isRequired && '*'}</Text>
            <TextInput
              style={styles.input}
              value={value?.toString() || ''}
              onChangeText={handleChange}
              placeholder={placeholder}
              placeholderTextColor="#999"
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
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
    fontWeight: '500',
  },
  currencyInput: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: '#34C759',
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  imageUploadButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  imageUploadText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  imagePreviewContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  imageActionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  timePickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  timePickerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  timePickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timePickerCancel: {
    fontSize: 16,
    color: '#666',
  },
  timePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timePickerDone: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
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
