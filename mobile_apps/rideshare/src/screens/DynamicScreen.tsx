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
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RenderHTML from 'react-native-render-html';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { screensService, menusService, ScreenContent, ScreenElement, Menu, DataSource } from '../api/screensService';
import { uploadService } from '../api/uploadService';
import { authService } from '../api/authService';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DynamicSidebar } from '../components/DynamicSidebar';
import HeaderBar from '../components/HeaderBar';
import {
  AvailabilityCalendarElement,
  BookingFormElement,
  BookingListElement,
  BookingDetailElement,
  ConversationListElement,
  ChatInterfaceElement,
  DynamicPricingElement,
  HostDashboardElement,
  PropertyDetailElement,
  PropertySearchElement,
  PropertyFormElement,
  PropertyListElement,
  ReviewsElement,
  FavoritesListElement,
  ProfileElement,
} from '../components/elements';
import { ElementRenderer } from '../components/primitives';
import apiClient from '../api/client';

const DynamicScreen = ({ route, navigation }: any) => {
  const { screenId, screenName, hideTabBar } = route.params;
  const { width } = useWindowDimensions();
  const { login: authLogin, logout: authLogout, isAuthenticated, token } = useAuth();
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
  const [passwordVisible, setPasswordVisible] = useState<{ [key: string]: boolean }>({});
  const [primitiveData, setPrimitiveData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    navigation.setOptions({ 
      title: screenName,
      headerBackTitle: 'Back'
    });
    fetchScreenContent();
  }, [screenId]);

  // Re-fetch when auth state changes (e.g., after login)
  useEffect(() => {
    if (isAuthenticated && token) {
      console.log('[DynamicScreen] Auth state changed, re-fetching screen', screenId);
      fetchScreenContent();
    }
  }, [isAuthenticated, token]);

  // Auto-trigger logout alert when logout screen loads
  useEffect(() => {
    if (content?.screen?.screen_key === 'logout' || content?.screen?.name?.toLowerCase().includes('logout')) {
      handleLogout();
    }
  }, [content]);

  const fetchScreenContent = async () => {
    try {
      // Debug: Check if token exists
      const token = await AsyncStorage.getItem('auth_token');
      console.log('[DynamicScreen] Fetching screen', screenId, 'with token:', token ? 'YES' : 'NO');
      
      const [screenContent, screenMenus] = await Promise.all([
        screensService.getScreenContent(screenId),
        screensService.getScreenMenus(screenId),
      ]);
      console.log('[DynamicScreen] Screen content received:', JSON.stringify(screenContent?.screen, null, 2));
      console.log('[DynamicScreen] Elements count:', screenContent?.elements?.length || 0);
      console.log('[DynamicScreen] Menus received:', JSON.stringify(screenMenus, null, 2));
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
      
      // If using primitive renderer, fetch data from data sources
      if (screenContent.screen.use_primitive_renderer && screenContent.data_sources) {
        await fetchPrimitiveData(screenContent.data_sources);
      }
    } catch (error: any) {
      console.error('Error fetching screen content:', error);
      console.error('[DynamicScreen] Error details:', error?.response?.data || error?.message);
      // Don't show alert for auth errors - the navigator will handle redirect
      if (error?.response?.status !== 403 && error?.response?.status !== 401) {
        Alert.alert('Error', 'Failed to load screen content');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Fetch data from data sources for primitive renderer
  const fetchPrimitiveData = async (dataSources: DataSource[]) => {
    const data: { [key: string]: any } = {};
    
    for (const source of dataSources) {
      try {
        // Replace route params in endpoint
        let endpoint = source.endpoint;
        if (source.params_from_route) {
          for (const param of source.params_from_route) {
            const value = route.params?.[param];
            if (value) {
              endpoint = endpoint.replace(`{${param}}`, value);
            }
          }
        }
        
        // Make API request
        const response = await apiClient.get(endpoint);
        data[source.name] = response.data?.data || response.data;
      } catch (error) {
        console.error(`Error fetching data source ${source.name}:`, error);
      }
    }
    
    setPrimitiveData(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchScreenContent();
  };

  const handleNavigate = async (targetScreenId: number, targetScreenName: string) => {
    // If navigating to the same screen, do nothing
    if (targetScreenId === screenId) {
      return;
    }
    
    // Check if we're on the Home screen (DynamicScreen as home)
    const routeName = navigation.getState()?.routes?.[navigation.getState()?.index || 0]?.name;
    const isHomeScreen = routeName === 'Home';
    
    // For tab bar items when we're on the home DynamicScreen,
    // just navigate to the new DynamicScreen (replacing current)
    if (isHomeScreen && tabBarMenu) {
      const isTabScreen = tabBarMenu.items?.some((item: any) => item.screen_id === targetScreenId);
      if (isTabScreen) {
        // Navigate to DynamicScreen with the new screen ID
        // Use replace to avoid stacking screens
        navigation.navigate('DynamicScreen', {
          screenId: targetScreenId,
          screenName: targetScreenName,
        });
        return;
      }
    }
    
    // For non-tab screens or when not on home, push normally
    navigation.push('DynamicScreen', {
      screenId: targetScreenId,
      screenName: targetScreenName,
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            // Go back to previous screen
            navigation.goBack();
          }
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Use AuthContext logout - this clears state and triggers navigator switch
              await authLogout();
              // AuthContext handles navigation automatically by updating isAuthenticated to false
              // The navigator will switch from authenticated to unauthenticated stack (Login)
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
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

  // Navigate to a screen after successful action
  const navigateToScreen = async (redirectScreenId: number) => {
    try {
      const targetScreen = await screensService.getScreenContent(redirectScreenId);
      navigation.reset({
        index: 0,
        routes: [{
          name: 'DynamicScreen',
          params: {
            screenId: redirectScreenId,
            screenName: targetScreen.screen.name || 'Screen'
          }
        }],
      });
    } catch (error) {
      console.error('Error navigating to redirect screen:', error);
    }
  };

  // Handle form submission based on submitType
  const handleSubmit = async (submitType: string, redirectScreenId?: number) => {
    setSaving(true);
    let success = false;
    
    try {
      switch (submitType) {
        case 'login':
          // Handle login
          const email = formData.email;
          const password = formData.password;
          
          if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            setSaving(false);
            return;
          }
          
          try {
            // Store redirect screen ID before login (if set)
            if (redirectScreenId) {
              await AsyncStorage.setItem('login_redirect_screen', JSON.stringify({
                screenId: redirectScreenId
              }));
            }
            
            // Use AuthContext login - this updates state and triggers navigator switch
            await authLogin(email, password);
            success = true;
            // AuthContext handles navigation automatically by updating isAuthenticated
            // The navigator will switch from unauthenticated to authenticated stack
          } catch (loginError: any) {
            // Show user-friendly error message
            let errorMessage = 'Invalid email or password';
            if (loginError.response?.data?.message) {
              errorMessage = loginError.response.data.message;
            } else if (loginError.response?.status === 403) {
              errorMessage = 'Your account is inactive or suspended';
            }
            Alert.alert('Unable to Sign In', errorMessage);
          }
          break;
          
        case 'register':
          // Handle registration
          const regEmail = formData.email;
          const regPassword = formData.password;
          const regName = formData.name || formData.full_name || formData.first_name;
          
          if (!regEmail || !regPassword) {
            Alert.alert('Error', 'Please fill in all required fields');
            setSaving(false);
            return;
          }
          
          const registerResponse = await authService.register({
            email: regEmail,
            password: regPassword,
            first_name: formData.first_name || regName?.split(' ')[0] || '',
            last_name: formData.last_name || regName?.split(' ').slice(1).join(' ') || '',
          });
          
          if (registerResponse.success) {
            success = true;
            Alert.alert('Success', 'Registration successful! Please check your email to verify your account.', [
              {
                text: 'OK',
                onPress: () => {
                  if (redirectScreenId) {
                    navigateToScreen(redirectScreenId);
                  }
                }
              }
            ]);
          } else {
            Alert.alert('Error', registerResponse.message || 'Registration failed');
          }
          break;
          
        case 'save':
        default:
          // Default save behavior - save screen content
          await screensService.saveScreenContent(screenId, formData);
          success = true;
          Alert.alert('Success', 'Data saved successfully', [
            {
              text: 'OK',
              onPress: () => {
                if (redirectScreenId) {
                  navigateToScreen(redirectScreenId);
                } else {
                  fetchScreenContent();
                }
              }
            }
          ]);
          break;
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      Alert.alert('Error', error.response?.data?.message || error.message || 'Submission failed');
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
        const isPasswordVisible = passwordVisible[fieldKey] || false;
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={value}
                onChangeText={updateValue}
                placeholder={element.placeholder || `Enter ${displayLabel.toLowerCase()}`}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setPasswordVisible({ ...passwordVisible, [fieldKey]: !isPasswordVisible })}
              >
                <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#666" />
              </TouchableOpacity>
            </View>
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
        const linkActionType = element.content_options?.actionType || element.config?.actionType || element.custom_config?.actionType || 'url';
        const linkUrl = element.content_options?.url || element.config?.url || element.custom_config?.url || '';
        const linkScreenId = element.content_options?.screenId || element.config?.screenId || element.custom_config?.screenId;
        const linkText = element.content_value || displayLabel;
        return (
          <TouchableOpacity
            style={styles.linkContainer}
            onPress={async () => {
              if (linkActionType === 'url' && linkUrl) {
                try {
                  const supported = await Linking.canOpenURL(linkUrl);
                  if (supported) {
                    await Linking.openURL(linkUrl);
                  } else {
                    Alert.alert('Error', `Cannot open URL: ${linkUrl}`);
                  }
                } catch (error) {
                  Alert.alert('Error', 'Failed to open link');
                }
              } else if (linkActionType === 'screen' && linkScreenId) {
                // Navigate to the specified screen
                // Handle auth screens specially - use named routes
                if (linkScreenId === 102) {
                  navigation.navigate('Register');
                } else if (linkScreenId === 18) {
                  navigation.navigate('Login');
                } else {
                  navigation.navigate('DynamicScreen', { screenId: linkScreenId, screenName: 'Screen' });
                }
              } else {
                Alert.alert('Link', 'No URL or screen configured for this link');
              }
            }}
          >
            <Text style={styles.linkText}>{linkText}</Text>
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

      case 'booking_form':
        return (
          <BookingFormElement
            key={element.id}
            element={element}
            navigation={navigation}
            route={route}
          />
        );

      case 'booking_list':
        return (
          <BookingListElement
            key={element.id}
            element={element}
            navigation={navigation}
          />
        );

      case 'booking_detail':
        return (
          <BookingDetailElement
            key={element.id}
            element={element}
            navigation={navigation}
            route={route}
          />
        );

      case 'availability_calendar':
        return (
          <AvailabilityCalendarElement
            key={element.id}
            element={element}
            navigation={navigation}
            route={route}
          />
        );

      case 'conversation_list':
        return (
          <ConversationListElement
            key={element.id}
            element={element}
            navigation={navigation}
          />
        );

      case 'chat_interface':
        return (
          <ChatInterfaceElement
            key={element.id}
            element={element}
            navigation={navigation}
            route={route}
          />
        );

      case 'property_search':
        return (
          <PropertySearchElement
            key={element.id}
            element={element}
            navigation={navigation}
          />
        );

      case 'property_form':
        return (
          <PropertyFormElement
            key={element.id}
            element={element}
            navigation={navigation}
            route={route}
          />
        );

      case 'property_list':
        return (
          <PropertyListElement
            key={element.id}
            element={element}
            navigation={navigation}
          />
        );

      case 'property_detail':
        return (
          <PropertyDetailElement
            key={element.id}
            element={element}
            navigation={navigation}
            route={route}
          />
        );

      case 'reviews':
      case 'reviews_list':
        return (
          <ReviewsElement
            key={element.id}
            element={element}
            navigation={navigation}
            route={route}
          />
        );

      case 'dashboard_stats':
      case 'host_dashboard':
        return (
          <HostDashboardElement
            key={element.id}
            element={element}
            navigation={navigation}
          />
        );

      case 'dynamic_pricing':
      case 'pricing_rules':
        return (
          <DynamicPricingElement
            key={element.id}
            element={element}
            navigation={navigation}
            route={route}
          />
        );

      case 'favorites_list':
      case 'wishlist':
        return (
          <FavoritesListElement
            key={element.id}
            config={element.config}
            onItemPress={(listing) => {
              navigation.push('DynamicScreen', {
                screenId: listing.id,
                screenName: listing.title,
              });
            }}
          />
        );

      case 'user_profile':
      case 'profile':
        return (
          <ProfileElement
            key={element.id}
            config={element.config}
          />
        );

      case 'button':
        const buttonText = element.content_value || displayLabel;
        
        // Parse config if it's a string
        let buttonConfig = element.config;
        if (typeof buttonConfig === 'string') {
          try {
            buttonConfig = JSON.parse(buttonConfig);
          } catch (e) {
            console.error('Failed to parse button config:', e);
            buttonConfig = {};
          }
        }
        
        const buttonActionType = element.content_options?.actionType || buttonConfig?.actionType || element.custom_config?.actionType || 'none';
        const buttonUrl = element.content_options?.url || buttonConfig?.url || element.custom_config?.url;
        const buttonScreenId = element.content_options?.screenId || buttonConfig?.screenId || element.custom_config?.screenId;
        const submitType = element.content_options?.submitType || buttonConfig?.submitType || element.custom_config?.submitType;
        const redirectScreenId = element.content_options?.redirectScreenId || buttonConfig?.redirectScreenId || element.custom_config?.redirectScreenId;

        console.log('[Button Debug]', {
          buttonText,
          buttonActionType,
          submitType,
          redirectScreenId,
          buttonUrl,
          buttonScreenId,
          config: buttonConfig,
          rawConfig: element.config,
          configType: typeof element.config
        });

        return (
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={async () => {
              if (buttonActionType === 'url' && buttonUrl) {
                try {
                  const supported = await Linking.canOpenURL(buttonUrl);
                  if (supported) {
                    await Linking.openURL(buttonUrl);
                  } else {
                    Alert.alert('Error', `Cannot open URL: ${buttonUrl}`);
                  }
                } catch (error) {
                  Alert.alert('Error', 'Failed to open link');
                }
              } else if (buttonActionType === 'screen' && buttonScreenId) {
                // Navigate to the specified screen
                try {
                  const targetScreen = await screensService.getScreenContent(buttonScreenId);
                  navigation.push('DynamicScreen', { 
                    screenId: buttonScreenId,
                    screenName: targetScreen.screen.name || 'Screen'
                  });
                } catch (error) {
                  console.error('Error navigating to screen:', error);
                  Alert.alert('Error', 'Failed to navigate to screen');
                }
              } else if (buttonActionType === 'submit') {
                // Handle form submission based on submitType and redirect
                await handleSubmit(submitType, redirectScreenId);
              } else {
                Alert.alert('Button', `${buttonText} clicked`);
              }
            }}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        );

      case 'logout_button':
        // Don't render the button - logout is handled automatically when screen loads
        return null;

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
  
  const hasButtonElement = content.elements.some((el) => el.element_type === 'button');
  
  // Only show Save button if there are form elements but no button element
  const shouldShowSaveButton = hasFormElements && !hasButtonElement;

  // Find menus by type
  const leftSidebarMenu = menus.find((m) => m.menu_type === 'sidebar_left');
  const rightSidebarMenu = menus.find((m) => m.menu_type === 'sidebar_right');
  const tabBarMenu = menus.find((m) => m.menu_type === 'tabbar');
  
  // Find header bar module
  const headerBarModule = modules.find((m) => m.module_type === 'header_bar');

  // Determine if we should show back button
  // Get the current route name from the route prop - this is more reliable
  const currentRouteName = route.name;
  const isHomeRoute = currentRouteName === 'Home';
  
  // Also check if this is the main/home screen by ID (112 = Search Properties)
  const isHomeScreenById = screenId === 112;
  const isHomeScreen = isHomeRoute || isHomeScreenById;
  
  // Check if we're at the root of the navigation stack
  const navigationState = navigation.getState();
  const isAtRoot = navigationState?.index === 0;
  
  // Show back button only if we're NOT on the Home screen AND not at root of stack
  // This ensures the home screen always shows menu icon, not back button
  const showBackButton = !isHomeScreen && !isAtRoot && navigation.canGoBack();
  
  // Build header config - override leftIconType to 'back' if we should show back button
  // Also ensure showLeftIcon is true when showing back button or when there's a sidebar
  const headerConfig = headerBarModule?.config ? {
    ...headerBarModule.config,
    leftIconType: showBackButton ? 'back' : headerBarModule.config.leftIconType,
    showLeftIcon: showBackButton ? true : headerBarModule.config.showLeftIcon,
  } : {
    showTitle: true,
    showLeftIcon: showBackButton || !!leftSidebarMenu,
    showRightIcon: !!rightSidebarMenu,
    leftIconType: showBackButton ? 'back' : 'menu',
    backgroundColor: '#007AFF',
    textColor: '#FFFFFF',
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Header Bar - show if module exists OR if there's a sidebar menu */}
        {(headerBarModule || leftSidebarMenu || rightSidebarMenu) && (
          <HeaderBar
            title={screenName}
            config={headerConfig}
            leftMenu={leftSidebarMenu}
            rightMenu={rightSidebarMenu}
            onLeftIconPress={() => {
              if (showBackButton) {
                navigation.goBack();
              } else {
                setLeftSidebarVisible(true);
              }
            }}
            onRightIconPress={() => setRightSidebarVisible(true)}
          />
        )}

        {/* Use primitive renderer if enabled */}
        {content.screen.use_primitive_renderer && content.primitive_elements ? (
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
            <ElementRenderer
              elements={content.primitive_elements}
              data={primitiveData}
              formData={formData}
              onFormChange={(field_key, value) => setFormData(prev => ({ ...prev, [field_key]: value }))}
              onAction={(action, payload) => {
                if (action === 'navigate' && payload?.target) {
                  const targetScreenId = parseInt(payload.target);
                  // If navigating to home/main screen, reset to Home instead of pushing
                  // This prevents stacking the home screen on top of other screens
                  if (targetScreenId === 112) { // Search Properties is the main screen
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Home' }],
                    });
                  } else {
                    navigation.push('DynamicScreen', {
                      screenId: targetScreenId,
                      screenName: payload.screenName || 'Screen',
                    });
                  }
                } else if (action === 'submit') {
                  handleSave();
                }
              }}
              navigation={navigation}
            />
          </ScrollView>
        ) : (
          /* Check if any element has its own scrolling (like property_list, booking_list) */
          (() => {
            const sortedElements = content.elements.sort((a, b) => a.display_order - b.display_order);
            const fullScreenElements = ['property_list', 'booking_list', 'favorites_list', 'user_profile'];
            const hasFullScreenElement = sortedElements.some(el => fullScreenElements.includes(el.element_type));
            
            if (hasFullScreenElement && sortedElements.length === 1) {
              // Single full-screen element - render without ScrollView wrapper
              return sortedElements.map((element, index) => (
                <View key={element.id || `element-${index}`} style={{ flex: 1 }}>
                  {renderElement(element)}
                </View>
              ));
            }
            
            // Normal rendering with ScrollView
            return (
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
                {sortedElements.map((element, index) => (
                  <View key={element.id || `element-${index}`}>
                    {renderElement(element)}
                  </View>
                ))}

                {shouldShowSaveButton && (
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
            );
          })()
        )}

        {/* Custom Tab Bar - shown if this screen has a tabbar menu assigned and not inside TabNavigator */}
        {!hideTabBar && tabBarMenu && tabBarMenu.items && tabBarMenu.items.length > 0 && (
          <View style={styles.tabBar}>
            {tabBarMenu.items.map((item: any, index: number) => {
              // For sidebar items, they're never "active" in the traditional sense
              const isSidebarItem = item.item_type === 'sidebar';
              const isActive = !isSidebarItem && item.screen_id === screenId;
              
              return (
                <TouchableOpacity
                  key={isSidebarItem ? `sidebar-${item.id || index}` : item.screen_id}
                  style={styles.tabItem}
                  onPress={() => {
                    if (isSidebarItem) {
                      // Open the appropriate sidebar
                      if (item.sidebar_position === 'left') {
                        setLeftSidebarVisible(true);
                      } else {
                        setRightSidebarVisible(true);
                      }
                    } else if (!isActive) {
                      handleNavigate(item.screen_id, item.screen_name || item.label);
                    }
                  }}
                >
                  <Icon
                    name={item.icon || (isSidebarItem ? 'menu' : 'circle')}
                    size={24}
                    color={isActive ? '#007AFF' : '#8E8E93'}
                  />
                  {item.label !== '__NO_LABEL__' && (
                    <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                      {item.label || item.screen_name}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#000000',
  },
  passwordToggle: {
    padding: 12,
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
  buttonContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: 20, // Safe area padding
    paddingTop: 8,
    minHeight: 60,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#007AFF',
  },
});

export default DynamicScreen;
