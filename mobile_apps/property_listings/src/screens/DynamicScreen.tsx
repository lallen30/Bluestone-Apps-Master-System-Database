import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
  RefreshControl,
  useWindowDimensions,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RenderHTML from 'react-native-render-html';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { screensService, ScreenContent, ScreenElement, Menu } from '../api/screensService';
import { uploadService } from '../api/uploadService';
import { DynamicTabBar } from '../components/DynamicTabBar';
import { DynamicSidebar } from '../components/DynamicSidebar';
import HeaderBar from '../components/HeaderBar';

const DynamicScreen = ({ route, navigation }: any) => {
  const { screenId, screenName } = route.params;
  const { width } = useWindowDimensions();
  const [content, setContent] = useState<ScreenContent | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [saving, setSaving] = useState(false);
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(false);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  useEffect(() => {
    navigation.setOptions({ title: screenName });
    fetchScreenContent();
  }, [screenId]);

  const fetchScreenContent = async () => {
    try {
      const [screenContent, screenMenus] = await Promise.all([
        screensService.getScreenContent(screenId),
        screensService.getScreenMenus(screenId),
      ]);
      setContent(screenContent);
      setMenus(screenMenus);
      setModules((screenContent as any).modules || []);
      
      // Initialize form data with existing data, content_value, or defaults
      if (screenContent.data) {
        setFormData(screenContent.data);
      } else {
        // Initialize with content_value or empty values
        const initialData: { [key: string]: any } = {};
        screenContent.elements.forEach((element) => {
          const fieldKey = element.field_key || element.field_name || '';
          // Use ?? to preserve empty strings, only fall back if null/undefined
          initialData[fieldKey] = element.content_value ?? element.default_value ?? '';
        });
        setFormData(initialData);
      }
    } catch (error) {
      console.error('Error fetching screen content:', error);
      Alert.alert('Error', 'Failed to load screen content');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchScreenContent();
  };

  const handleNavigate = (targetScreenId: number, targetScreenName: string) => {
    navigation.push('DynamicScreen', {
      screenId: targetScreenId,
      screenName: targetScreenName,
    });
  };

  const handleSave = async () => {
    if (!content) return;

    // Validate required fields
    const missingFields = content.elements
      .filter((el) => {
        const fieldKey = el.field_key || el.field_name || '';
        return el.is_required && fieldKey && !formData[fieldKey];
      })
      .map((el) => {
        const label = el.label || '';
        if (label === '0') return '';
        
        let cleaned = label.trim();
        
        // Remove all trailing " 0" or "0" patterns
        while (cleaned.endsWith(' 0') || (cleaned.endsWith('0') && cleaned.length > 1 && /[a-zA-Z\s]/.test(cleaned[cleaned.length - 2]))) {
          if (cleaned.endsWith(' 0')) {
            cleaned = cleaned.slice(0, -2).trim();
          } else if (cleaned.endsWith('0')) {
            cleaned = cleaned.slice(0, -1).trim();
          }
        }
        
        return cleaned;
      });

    if (missingFields.length > 0) {
      Alert.alert(
        'Required Fields',
        `Please fill in: ${missingFields.join(', ')}`
      );
      return;
    }

    setSaving(true);
    try {
      await screensService.saveScreenContent(screenId, formData);
      
      // For profile screens, sync data to related profile screens
      // This ensures "Edit Profile" and "User Profile" show the same data
      const screenName = content?.screen?.name?.toLowerCase() || '';
      if (screenName.includes('edit profile') || screenName.includes('profile edit')) {
        // This is an edit profile screen - find and sync to view profile screen
        try {
          const allScreens = await screensService.getAppScreens();
          const viewProfileScreen = allScreens.find((s: any) => 
            s.name?.toLowerCase().includes('user profile') || 
            s.name?.toLowerCase().includes('view profile') ||
            s.name?.toLowerCase().includes('my profile')
          );
          
          if (viewProfileScreen && viewProfileScreen.id !== screenId) {
            await screensService.saveScreenContent(viewProfileScreen.id, formData);
            console.log(`Synced profile data to screen ${viewProfileScreen.id}`);
          }
        } catch (e) {
          console.log('Could not sync to view profile screen:', e);
        }
      }
      
      Alert.alert('Success', 'Profile updated successfully');
      
      // Refresh the screen to show updated data
      fetchScreenContent();
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  const renderElement = (element: ScreenElement) => {
    const fieldKey = element.field_key || element.field_name || '';
    // Use ?? instead of || to allow empty strings (when user deletes content)
    const value = formData[fieldKey] ?? element.content_value ?? element.default_value ?? '';
    
    const updateValue = (newValue: any) => {
      setFormData({ ...formData, [fieldKey]: newValue });
    };

    // Clean label - remove trailing "0" or " 0" if present
    const cleanLabel = (label: string) => {
      if (!label) return '';
      if (label === '0') return '';
      
      let cleaned = String(label).trim();
      
      // Simple approach: if it ends with "0" and the previous char is a letter or space, remove it
      // Keep looping until no more trailing 0s that follow letters/spaces
      let maxIterations = 10; // Safety limit
      while (maxIterations > 0 && cleaned.length > 1) {
        const lastChar = cleaned[cleaned.length - 1];
        const secondLastChar = cleaned[cleaned.length - 2];
        
        if (lastChar === '0' && (secondLastChar === ' ' || /[a-zA-Z]/.test(secondLastChar))) {
          cleaned = cleaned.slice(0, -1).trim();
          maxIterations--;
        } else if (cleaned.endsWith(' 0')) {
          cleaned = cleaned.slice(0, -2).trim();
          maxIterations--;
        } else {
          break;
        }
      }
      
      return cleaned;
    };

    const displayLabel = cleanLabel(element.label);

    switch (element.element_type) {
      case 'text_input':
      case 'text_field':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={updateValue}
              placeholder={element.placeholder || `Enter ${displayLabel.toLowerCase()}`}
            />
          </View>
        );

      case 'password':
      case 'password_input':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={updateValue}
              placeholder={element.placeholder || `Enter ${displayLabel.toLowerCase()}`}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        );

      case 'email':
      case 'email_input':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={updateValue}
              placeholder={element.placeholder || `Enter ${displayLabel.toLowerCase()}`}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        );

      case 'phone':
      case 'phone_input':
        const formatPhoneNumber = (text: string) => {
          // Remove all non-numeric characters
          const cleaned = text.replace(/\D/g, '');
          
          // Format as (XXX) XXX-XXXX
          if (cleaned.length <= 3) {
            return cleaned;
          } else if (cleaned.length <= 6) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
          } else {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
          }
        };

        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={styles.input}
              value={formatPhoneNumber(value)}
              onChangeText={(text) => {
                const cleaned = text.replace(/\D/g, '');
                updateValue(cleaned);
              }}
              placeholder={element.config?.placeholder || element.placeholder || '+1 (555) 123-4567'}
              keyboardType="phone-pad"
              maxLength={14} // (XXX) XXX-XXXX
            />
          </View>
        );

      case 'textarea':
      case 'text_area':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={value}
              onChangeText={updateValue}
              placeholder={element.placeholder || `Enter ${displayLabel.toLowerCase()}`}
              multiline
              numberOfLines={4}
            />
          </View>
        );

      case 'number':
      case 'number_input':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={styles.input}
              value={value.toString()}
              onChangeText={(text) => updateValue(parseFloat(text) || 0)}
              placeholder={element.placeholder || '0'}
              keyboardType="numeric"
            />
          </View>
        );

      case 'url':
      case 'url_input':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={updateValue}
              placeholder={element.placeholder || 'https://example.com'}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        );

      case 'date':
      case 'date_picker':
        const dateValue = value ? new Date(value) : null;
        const displayDate = dateValue ? dateValue.toLocaleDateString() : '';

        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => {
                setTempDate(dateValue || new Date());
                setShowDatePicker(fieldKey);
              }}
            >
              <Text style={[styles.datePickerText, !displayDate && styles.placeholderText]}>
                {displayDate || element.config?.placeholder || element.placeholder || 'Select date'}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker === fieldKey && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') {
                    setShowDatePicker(null);
                  }
                  if (selectedDate) {
                    setTempDate(selectedDate);
                    if (event.type === 'set') {
                      updateValue(selectedDate.toISOString().split('T')[0]);
                      if (Platform.OS === 'ios') {
                        setShowDatePicker(null);
                      }
                    }
                  }
                }}
                maximumDate={element.config?.maxDate === 'today' ? new Date() : undefined}
              />
            )}
          </View>
        );

      case 'switch':
      case 'checkbox':
        return (
          <View style={styles.switchContainer}>
            <Text style={styles.label}>{displayLabel}</Text>
            <Switch
              value={!!value}
              onValueChange={updateValue}
              trackColor={{ false: '#D1D1D6', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          </View>
        );

      case 'heading':
        return (
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>{value || displayLabel}</Text>
          </View>
        );

      case 'text':
      case 'paragraph':
        // If there's a field_key, this is a data field (show label + value)
        // Otherwise it's just static text (show value or label)
        if (fieldKey && value) {
          return (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{displayLabel}</Text>
              <Text style={styles.text}>{value}</Text>
            </View>
          );
        }
        return (
          <View style={styles.textContainer}>
            <Text style={styles.text}>{value || displayLabel}</Text>
          </View>
        );

      case 'rich_text_display':
      case 'rich_text_editor':
        // Render HTML content with proper formatting
        const htmlContent = value || element.default_value || element.label || '';
        return (
          <View style={styles.richTextContainer}>
            {displayLabel && (
              <Text style={styles.label}>{displayLabel}</Text>
            )}
            <View style={styles.richTextContent}>
              <RenderHTML
                contentWidth={width - 64} // Account for padding
                source={{ html: htmlContent }}
                tagsStyles={{
                  p: { marginTop: 0, marginBottom: 8, color: '#000000', fontSize: 15, lineHeight: 22 },
                  h1: { color: '#000000', fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
                  h2: { color: '#000000', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
                  h3: { color: '#000000', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
                  strong: { fontWeight: 'bold' },
                  em: { fontStyle: 'italic' },
                  a: { color: '#007AFF', textDecorationLine: 'underline' },
                  ul: { marginBottom: 8 },
                  ol: { marginBottom: 8 },
                  li: { marginBottom: 4 },
                }}
              />
            </View>
          </View>
        );

      case 'divider':
        return <View style={styles.divider} />;

      case 'link':
        return (
          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => Alert.alert('Link', `${displayLabel} clicked`)}
          >
            <Text style={styles.linkText}>{displayLabel}</Text>
          </TouchableOpacity>
        );

      case 'dropdown':
        // Parse config if it's a string
        const parsedConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const options = parsedConfig?.options || [];
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            {options.length === 0 ? (
              <Text style={styles.errorText}>No options available</Text>
            ) : (
              <View style={styles.dropdownContainer}>
                {options.map((option: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dropdownOption,
                      value === option.value && styles.dropdownOptionSelected
                    ]}
                    onPress={() => updateValue(option.value)}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      value === option.value && styles.dropdownOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );

      case 'image_upload':
        const handleImagePick = () => {
          Alert.alert(
            'Select Photo',
            'Choose photo source',
            [
              {
                text: 'Camera',
                onPress: () => {
                  launchCamera(
                    {
                      mediaType: 'photo',
                      quality: 0.8,
                      maxWidth: 1024,
                      maxHeight: 1024,
                    },
                    async (response) => {
                      if (response.didCancel) {
                        return;
                      }
                      if (response.errorCode) {
                        Alert.alert('Error', response.errorMessage || 'Failed to capture image');
                        return;
                      }
                      if (response.assets && response.assets[0] && response.assets[0].uri) {
                        const localUri = response.assets[0].uri;
                        // Show local preview immediately
                        updateValue(localUri);
                        
                        // Upload to server in background
                        try {
                          const serverUrl = await uploadService.uploadImage(localUri);
                          // Update with server URL
                          updateValue(serverUrl);
                        } catch (error: any) {
                          console.error('Upload failed:', error);
                          Alert.alert('Upload Failed', 'Image saved locally but could not upload to server');
                        }
                      }
                    }
                  );
                },
              },
              {
                text: 'Photo Library',
                onPress: () => {
                  launchImageLibrary(
                    {
                      mediaType: 'photo',
                      quality: 0.8,
                      maxWidth: 1024,
                      maxHeight: 1024,
                    },
                    async (response) => {
                      if (response.didCancel) {
                        return;
                      }
                      if (response.errorCode) {
                        Alert.alert('Error', response.errorMessage || 'Failed to select image');
                        return;
                      }
                      if (response.assets && response.assets[0] && response.assets[0].uri) {
                        const localUri = response.assets[0].uri;
                        // Show local preview immediately
                        updateValue(localUri);
                        
                        // Upload to server in background
                        try {
                          const serverUrl = await uploadService.uploadImage(localUri);
                          // Update with server URL
                          updateValue(serverUrl);
                        } catch (error: any) {
                          console.error('Upload failed:', error);
                          Alert.alert('Upload Failed', 'Image saved locally but could not upload to server');
                        }
                      }
                    }
                  );
                },
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ]
          );
        };

        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImagePick}
            >
              <Text style={styles.uploadButtonText}>
                {element.config?.uploadText || 'Upload Image'}
              </Text>
            </TouchableOpacity>
            {value && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: value }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => updateValue('')}
                >
                  <Text style={styles.removeImageText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'image_display':
        // Display image without upload controls (read-only)
        if (!value) {
          return null; // Don't show anything if no image
        }
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: value }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
            </View>
          </View>
        );

      default:
        // For unknown element types, show as text if content_value exists
        if (value && element.element_type !== 'text_input') {
          return (
            <View style={styles.textContainer}>
              {displayLabel && (
                <Text style={styles.label}>{displayLabel}</Text>
              )}
              <Text style={styles.text}>{value}</Text>
            </View>
          );
        }
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{displayLabel}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={updateValue}
              placeholder={element.placeholder}
            />
          </View>
        );
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!content) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load screen content</Text>
      </View>
    );
  }

  const hasFormElements = content.elements.some((el) =>
    ['text_input', 'text_field', 'email', 'email_input', 'phone', 'phone_input', 'textarea', 'text_area', 'number', 'number_input', 'url', 'url_input', 'date', 'date_picker', 'switch', 'checkbox'].includes(el.element_type)
  );

  // Find menus by type
  const tabbarMenu = menus.find((m) => m.menu_type === 'tabbar');
  const leftSidebarMenu = menus.find((m) => m.menu_type === 'sidebar_left');
  const rightSidebarMenu = menus.find((m) => m.menu_type === 'sidebar_right');

  // Find header bar module
  const headerBarModule = modules.find((m) => m.module_type === 'header_bar');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Header Bar Module */}
        {headerBarModule && (
          <HeaderBar
            title={screenName}
            config={headerBarModule.config}
            leftMenu={leftSidebarMenu}
            rightMenu={rightSidebarMenu}
            onLeftIconPress={() => setLeftSidebarVisible(true)}
            onRightIconPress={() => setRightSidebarVisible(true)}
          />
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
            />
          }
        >
          {content.elements
            .sort((a, b) => a.display_order - b.display_order)
            .map((element, index) => (
              <View key={element.id || `element-${index}`}>
                {renderElement(element)}
              </View>
            ))}

          {hasFormElements && (
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Dynamic Tab Bar */}
        {tabbarMenu && tabbarMenu.items.length > 0 && (
          <DynamicTabBar
            menu={tabbarMenu}
            currentScreenId={screenId}
            onNavigate={handleNavigate}
          />
        )}

        {/* Left Sidebar */}
        {leftSidebarMenu && leftSidebarMenu.items.length > 0 && (
          <DynamicSidebar
            menu={leftSidebarMenu}
            visible={leftSidebarVisible}
            onClose={() => setLeftSidebarVisible(false)}
            currentScreenId={screenId}
            onNavigate={handleNavigate}
          />
        )}

        {/* Right Sidebar */}
        {rightSidebarMenu && rightSidebarMenu.items.length > 0 && (
          <DynamicSidebar
            menu={rightSidebarMenu}
            visible={rightSidebarVisible}
            onClose={() => setRightSidebarVisible(false)}
            currentScreenId={screenId}
            onNavigate={handleNavigate}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 16,
  },
  fieldContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  headingContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  textContainer: {
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  richTextContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  richTextContent: {
    marginTop: 8,
  },
  dropdownContainer: {
    marginTop: 8,
  },
  dropdownOption: {
    backgroundColor: '#F2F2F7',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dropdownOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#000000',
  },
  dropdownOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#F2F2F7',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  uploadedText: {
    fontSize: 14,
    color: '#34C759',
    marginTop: 8,
  },
  datePickerButton: {
    backgroundColor: '#F2F2F7',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  datePickerText: {
    fontSize: 16,
    color: '#000000',
  },
  placeholderText: {
    color: '#8E8E93',
  },
  imagePreviewContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#F2F2F7',
  },
  removeImageButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 6,
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  linkContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default DynamicScreen;
