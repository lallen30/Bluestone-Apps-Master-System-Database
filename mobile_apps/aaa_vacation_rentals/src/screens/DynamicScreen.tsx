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
import { profileService } from '../api/profileService';
import { API_CONFIG } from '../api/config';
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
  NotificationListElement,
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
  const { screenId, screenName, hideTabBar, userId, viewingOtherUser } = route.params;
  const { width } = useWindowDimensions();
  const { login: authLogin, logout: authLogout } = useAuth();
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

  // Auto-trigger logout alert when logout screen loads
  useEffect(() => {
    if (content?.screen?.screen_key === 'logout' || content?.screen?.name?.toLowerCase().includes('logout')) {
      handleLogout();
    }
  }, [content]);

  const fetchScreenContent = async () => {
    try {
      // Pass userId if viewing another user's profile (e.g., host profile)
      const screenOptions = userId ? { userId } : undefined;
      const [screenContent, screenMenus] = await Promise.all([
        screensService.getScreenContent(screenId, screenOptions),
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
      
      // If using primitive renderer, fetch data from data sources
      if (screenContent.screen.use_primitive_renderer && screenContent.data_sources) {
        await fetchPrimitiveData(screenContent.data_sources);
      }
    } catch (error) {
      console.error('Error fetching screen content:', error);
      Alert.alert('Error', 'Failed to load screen content');
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
      
      // For profile screens, also update the user's profile in app_users table
      const screenName = content?.screen?.name?.toLowerCase() || '';
      if (screenName.includes('edit profile') || screenName.includes('profile edit')) {
        // Update user profile via profile API
        try {
          const profileData: any = {};
          
          // Map form fields to profile fields
          if (formData.first_name !== undefined) profileData.first_name = formData.first_name;
          if (formData.last_name !== undefined) profileData.last_name = formData.last_name;
          if (formData.phone !== undefined) profileData.phone = formData.phone;
          if (formData.bio !== undefined) profileData.bio = formData.bio;
          if (formData.date_of_birth !== undefined) profileData.date_of_birth = formData.date_of_birth;
          if (formData.gender !== undefined) profileData.gender = formData.gender;
          
          // Update profile if we have any data
          if (Object.keys(profileData).length > 0) {
            await profileService.updateProfile(profileData);
            console.log('Updated user profile:', profileData);
          }
          
          // Handle profile photo separately - upload to avatar endpoint
          if (formData.profile_photo && formData.profile_photo.startsWith('http')) {
            // Photo was already uploaded via uploadService, now update avatar_url
            try {
              // The photo URL is already on the server, we just need to update the user record
              // Extract the path from the full URL (e.g., http://localhost:3000/uploads/general/file.jpg -> /uploads/general/file.jpg)
              let avatarPath = formData.profile_photo;
              const serverUrl = API_CONFIG.SERVER_URL || 'http://localhost:3000';
              if (avatarPath.startsWith(serverUrl)) {
                avatarPath = avatarPath.replace(serverUrl, '');
              }
              
              // Update avatar via a direct API call
              await apiClient.put(`/apps/${API_CONFIG.APP_ID}/profile`, {
                avatar_url: avatarPath
              });
              console.log('Updated avatar_url to:', avatarPath);
            } catch (avatarError) {
              console.log('Could not update avatar_url:', avatarError);
            }
          }
          
          // Sync to view profile screen
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
          console.log('Could not update user profile:', e);
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

      case 'radio_button':
      case 'radio':
        // Radio button - single choice from visible options
        const radioConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const radioOptions = radioConfig?.options || [];
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            {radioOptions.length === 0 ? (
              <Text style={styles.errorText}>No options available</Text>
            ) : (
              <View style={styles.radioGroup}>
                {radioOptions.map((option: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.radioOption}
                    onPress={() => updateValue(option.value)}
                  >
                    <View style={[
                      styles.radioOuter,
                      value === option.value && styles.radioOuterSelected
                    ]}>
                      {value === option.value && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );

      case 'checkbox_group':
      case 'checkboxes':
        // Checkbox group - multiple choice from options
        const checkboxConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const checkboxOptions = checkboxConfig?.options || [];
        const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
        
        const toggleCheckbox = (optionValue: string) => {
          if (selectedValues.includes(optionValue)) {
            updateValue(selectedValues.filter((v: string) => v !== optionValue));
          } else {
            updateValue([...selectedValues, optionValue]);
          }
        };
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            {checkboxOptions.length === 0 ? (
              <Text style={styles.errorText}>No options available</Text>
            ) : (
              <View style={styles.checkboxGroup}>
                {checkboxOptions.map((option: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.checkboxOption}
                    onPress={() => toggleCheckbox(option.value)}
                  >
                    <View style={[
                      styles.checkboxOuter,
                      selectedValues.includes(option.value) && styles.checkboxOuterSelected
                    ]}>
                      {selectedValues.includes(option.value) && (
                        <Icon name="check" size={14} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );

      case 'multi_select':
        // Multi-select dropdown - multiple selections
        const multiConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const multiOptions = multiConfig?.options || [];
        const multiSelectedValues = Array.isArray(value) ? value : (value ? [value] : []);
        
        const toggleMultiSelect = (optionValue: string) => {
          if (multiSelectedValues.includes(optionValue)) {
            updateValue(multiSelectedValues.filter((v: string) => v !== optionValue));
          } else {
            updateValue([...multiSelectedValues, optionValue]);
          }
        };
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            {multiOptions.length === 0 ? (
              <Text style={styles.errorText}>No options available</Text>
            ) : (
              <View style={styles.multiSelectContainer}>
                {multiOptions.map((option: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.multiSelectOption,
                      multiSelectedValues.includes(option.value) && styles.multiSelectOptionSelected
                    ]}
                    onPress={() => toggleMultiSelect(option.value)}
                  >
                    <Text style={[
                      styles.multiSelectOptionText,
                      multiSelectedValues.includes(option.value) && styles.multiSelectOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                    {multiSelectedValues.includes(option.value) && (
                      <Icon name="check" size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );

      case 'time':
      case 'time_picker':
        const timeValue = value || '';
        const displayTime = timeValue || '';
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => {
                const now = new Date();
                if (timeValue) {
                  const [hours, minutes] = timeValue.split(':');
                  now.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                }
                setTempDate(now);
                setShowDatePicker(`time_${fieldKey}`);
              }}
            >
              <Text style={[styles.datePickerText, !displayTime && styles.placeholderText]}>
                {displayTime || element.placeholder || 'Select time'}
              </Text>
              <Icon name="clock-outline" size={20} color="#666" />
            </TouchableOpacity>
            
            {showDatePicker === `time_${fieldKey}` && (
              <DateTimePicker
                value={tempDate}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') {
                    setShowDatePicker(null);
                  }
                  if (selectedDate && event.type === 'set') {
                    const hours = selectedDate.getHours().toString().padStart(2, '0');
                    const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                    updateValue(`${hours}:${minutes}`);
                    if (Platform.OS === 'ios') {
                      setShowDatePicker(null);
                    }
                  }
                }}
              />
            )}
          </View>
        );

      case 'datetime':
      case 'datetime_picker':
        const datetimeValue = value ? new Date(value) : null;
        const displayDatetime = datetimeValue 
          ? `${datetimeValue.toLocaleDateString()} ${datetimeValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : '';
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => {
                setTempDate(datetimeValue || new Date());
                setShowDatePicker(`datetime_${fieldKey}`);
              }}
            >
              <Text style={[styles.datePickerText, !displayDatetime && styles.placeholderText]}>
                {displayDatetime || element.placeholder || 'Select date and time'}
              </Text>
              <Icon name="calendar-clock" size={20} color="#666" />
            </TouchableOpacity>
            
            {showDatePicker === `datetime_${fieldKey}` && (
              <DateTimePicker
                value={tempDate}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') {
                    setShowDatePicker(null);
                  }
                  if (selectedDate && event.type === 'set') {
                    setTempDate(selectedDate);
                    updateValue(selectedDate.toISOString());
                    if (Platform.OS === 'ios') {
                      setShowDatePicker(null);
                    }
                  }
                }}
              />
            )}
          </View>
        );

      case 'slider':
      case 'range':
        const sliderConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const minValue = sliderConfig?.min ?? 0;
        const maxValue = sliderConfig?.max ?? 100;
        const stepValue = sliderConfig?.step ?? 1;
        const sliderValue = typeof value === 'number' ? value : (parseFloat(value) || minValue);
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{sliderValue}</Text>
              <View style={styles.sliderTrack}>
                <View 
                  style={[
                    styles.sliderFill, 
                    { width: `${((sliderValue - minValue) / (maxValue - minValue)) * 100}%` }
                  ]} 
                />
                <View 
                  style={[
                    styles.sliderThumb,
                    { left: `${((sliderValue - minValue) / (maxValue - minValue)) * 100}%` }
                  ]}
                />
              </View>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderMinMax}>{minValue}</Text>
                <Text style={styles.sliderMinMax}>{maxValue}</Text>
              </View>
              {/* Simple increment/decrement for now - full slider requires gesture handler */}
              <View style={styles.sliderButtons}>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => updateValue(Math.max(minValue, sliderValue - stepValue))}
                >
                  <Icon name="minus" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => updateValue(Math.min(maxValue, sliderValue + stepValue))}
                >
                  <Icon name="plus" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 'stepper':
      case 'number_stepper':
        const stepperConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const stepperMin = stepperConfig?.min ?? 0;
        const stepperMax = stepperConfig?.max ?? 100;
        const stepperStep = stepperConfig?.step ?? 1;
        const stepperValue = typeof value === 'number' ? value : (parseInt(value, 10) || stepperMin);
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={[
                  styles.stepperButton,
                  stepperValue <= stepperMin && styles.stepperButtonDisabled
                ]}
                onPress={() => updateValue(Math.max(stepperMin, stepperValue - stepperStep))}
                disabled={stepperValue <= stepperMin}
              >
                <Icon name="minus" size={24} color={stepperValue <= stepperMin ? '#CCC' : '#007AFF'} />
              </TouchableOpacity>
              <View style={styles.stepperValueContainer}>
                <Text style={styles.stepperValue}>{stepperValue}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.stepperButton,
                  stepperValue >= stepperMax && styles.stepperButtonDisabled
                ]}
                onPress={() => updateValue(Math.min(stepperMax, stepperValue + stepperStep))}
                disabled={stepperValue >= stepperMax}
              >
                <Icon name="plus" size={24} color={stepperValue >= stepperMax ? '#CCC' : '#007AFF'} />
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'rating':
      case 'star_rating':
      case 'star_rating_input':
        const ratingConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const maxStars = ratingConfig?.maxStars ?? 5;
        const ratingValue = typeof value === 'number' ? value : (parseInt(value, 10) || 0);
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.ratingContainer}>
              {[...Array(maxStars)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => updateValue(index + 1)}
                  style={styles.starButton}
                >
                  <Icon
                    name={index < ratingValue ? 'star' : 'star-outline'}
                    size={32}
                    color={index < ratingValue ? '#FFD700' : '#CCC'}
                  />
                </TouchableOpacity>
              ))}
              <Text style={styles.ratingText}>{ratingValue} / {maxStars}</Text>
            </View>
          </View>
        );

      case 'star_rating_display':
        // Read-only star rating display
        const displayRatingConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const displayMaxStars = displayRatingConfig?.maxStars ?? 5;
        const displayRatingValue = typeof value === 'number' ? value : (parseFloat(value) || 0);
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.ratingContainer}>
              {[...Array(displayMaxStars)].map((_, index) => (
                <Icon
                  key={index}
                  name={index < Math.floor(displayRatingValue) ? 'star' : (index < displayRatingValue ? 'star-half-full' : 'star-outline')}
                  size={24}
                  color={index < displayRatingValue ? '#FFD700' : '#CCC'}
                />
              ))}
              <Text style={styles.ratingText}>{displayRatingValue.toFixed(1)}</Text>
            </View>
          </View>
        );

      case 'currency_input':
      case 'currency':
        // Currency input with formatting
        const currencyConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const currencySymbol = currencyConfig?.symbol || '$';
        const currencyCode = currencyConfig?.code || 'USD';
        const currencyValue = typeof value === 'number' ? value : (parseFloat(value) || 0);
        
        const formatCurrency = (num: number) => {
          return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.currencyInputContainer}>
              <Text style={styles.currencySymbol}>{currencySymbol}</Text>
              <TextInput
                style={styles.currencyInput}
                value={currencyValue > 0 ? formatCurrency(currencyValue) : ''}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9.]/g, '');
                  const num = parseFloat(cleaned) || 0;
                  updateValue(num);
                }}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
              <Text style={styles.currencyCode}>{currencyCode}</Text>
            </View>
          </View>
        );

      case 'address_input':
      case 'address':
        // Structured address fields
        const addressConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const addressValue = typeof value === 'object' ? value : {};
        
        const updateAddressField = (field: string, val: string) => {
          updateValue({ ...addressValue, [field]: val });
        };
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.addressContainer}>
              <TextInput
                style={styles.addressInput}
                value={addressValue.street || ''}
                onChangeText={(text) => updateAddressField('street', text)}
                placeholder="Street Address"
              />
              {addressConfig?.showLine2 !== false && (
                <TextInput
                  style={styles.addressInput}
                  value={addressValue.street2 || ''}
                  onChangeText={(text) => updateAddressField('street2', text)}
                  placeholder="Apt, Suite, Unit (optional)"
                />
              )}
              <View style={styles.addressRow}>
                <TextInput
                  style={[styles.addressInput, { flex: 2 }]}
                  value={addressValue.city || ''}
                  onChangeText={(text) => updateAddressField('city', text)}
                  placeholder="City"
                />
                <TextInput
                  style={[styles.addressInput, { flex: 1, marginLeft: 8 }]}
                  value={addressValue.state || ''}
                  onChangeText={(text) => updateAddressField('state', text)}
                  placeholder="State"
                />
              </View>
              <View style={styles.addressRow}>
                <TextInput
                  style={[styles.addressInput, { flex: 1 }]}
                  value={addressValue.zip || ''}
                  onChangeText={(text) => updateAddressField('zip', text)}
                  placeholder="ZIP Code"
                  keyboardType="number-pad"
                />
                <TextInput
                  style={[styles.addressInput, { flex: 2, marginLeft: 8 }]}
                  value={addressValue.country || ''}
                  onChangeText={(text) => updateAddressField('country', text)}
                  placeholder="Country"
                />
              </View>
            </View>
          </View>
        );

      case 'otp_input':
      case 'otp':
        // One-time password input (6 digits)
        const otpConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const otpLength = otpConfig?.length || 6;
        const otpValue = (value || '').toString();
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.otpContainer}>
              {[...Array(otpLength)].map((_, index) => (
                <View key={index} style={styles.otpBox}>
                  <Text style={styles.otpDigit}>
                    {otpValue[index] || ''}
                  </Text>
                </View>
              ))}
            </View>
            <TextInput
              style={styles.otpHiddenInput}
              value={otpValue}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '').slice(0, otpLength);
                updateValue(cleaned);
              }}
              keyboardType="number-pad"
              maxLength={otpLength}
              autoFocus={otpConfig?.autoFocus}
            />
          </View>
        );

      case 'tags_input':
      case 'tags':
        // Multiple tag entries
        const tagsConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const tagsValue = Array.isArray(value) ? value : (value ? [value] : []);
        const [tagInput, setTagInput] = React.useState('');
        
        const addTag = () => {
          if (tagInput.trim() && !tagsValue.includes(tagInput.trim())) {
            updateValue([...tagsValue, tagInput.trim()]);
            setTagInput('');
          }
        };
        
        const removeTag = (tagToRemove: string) => {
          updateValue(tagsValue.filter((tag: string) => tag !== tagToRemove));
        };
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.tagsInputContainer}>
              <TextInput
                style={styles.tagTextInput}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
                placeholder={tagsConfig?.placeholder || 'Add tag...'}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
                <Icon name="plus" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            {tagsValue.length > 0 && (
              <View style={styles.tagsContainer}>
                {tagsValue.map((tag: string, index: number) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity onPress={() => removeTag(tag)}>
                      <Icon name="close-circle" size={18} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        );

      case 'autocomplete':
        // Input with suggestions
        const autocompleteConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const suggestions = autocompleteConfig?.suggestions || [];
        const [showSuggestions, setShowSuggestions] = React.useState(false);
        const filteredSuggestions = suggestions.filter((s: string) => 
          s.toLowerCase().includes((value || '').toLowerCase())
        );
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={styles.input}
              value={value || ''}
              onChangeText={(text) => {
                updateValue(text);
                setShowSuggestions(text.length > 0);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={element.placeholder || 'Type to search...'}
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {filteredSuggestions.slice(0, 5).map((suggestion: string, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      updateValue(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );

      case 'search_bar':
      case 'search':
        // Search input with icon
        const searchConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        
        return (
          <View style={styles.searchBarContainer}>
            <Icon name="magnify" size={20} color="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              value={value || ''}
              onChangeText={updateValue}
              placeholder={element.placeholder || searchConfig?.placeholder || 'Search...'}
              returnKeyType="search"
              onSubmitEditing={() => {
                if (searchConfig?.onSearch) {
                  // Trigger search callback
                }
              }}
            />
            {value && (
              <TouchableOpacity onPress={() => updateValue('')}>
                <Icon name="close-circle" size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
        );

      case 'country_selector':
      case 'country':
        // Country dropdown with flags
        const countryConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const countries = countryConfig?.countries || [
          { code: 'US', name: 'United States', flag: '🇺🇸' },
          { code: 'CA', name: 'Canada', flag: '🇨🇦' },
          { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
          { code: 'AU', name: 'Australia', flag: '🇦🇺' },
          { code: 'DE', name: 'Germany', flag: '🇩🇪' },
          { code: 'FR', name: 'France', flag: '🇫🇷' },
          { code: 'JP', name: 'Japan', flag: '🇯🇵' },
          { code: 'CN', name: 'China', flag: '🇨🇳' },
          { code: 'IN', name: 'India', flag: '🇮🇳' },
          { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
          { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
        ];
        const selectedCountry = countries.find((c: any) => c.code === value);
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.countrySelector}>
              {countries.map((country: any) => (
                <TouchableOpacity
                  key={country.code}
                  style={[
                    styles.countryOption,
                    value === country.code && styles.countryOptionSelected
                  ]}
                  onPress={() => updateValue(country.code)}
                >
                  <Text style={styles.countryFlag}>{country.flag}</Text>
                  <Text style={[
                    styles.countryName,
                    value === country.code && styles.countryNameSelected
                  ]}>
                    {country.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'language_selector':
      case 'language':
        // Language picker
        const languageConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const languages = languageConfig?.languages || [
          { code: 'en', name: 'English', native: 'English' },
          { code: 'es', name: 'Spanish', native: 'Español' },
          { code: 'fr', name: 'French', native: 'Français' },
          { code: 'de', name: 'German', native: 'Deutsch' },
          { code: 'it', name: 'Italian', native: 'Italiano' },
          { code: 'pt', name: 'Portuguese', native: 'Português' },
          { code: 'zh', name: 'Chinese', native: '中文' },
          { code: 'ja', name: 'Japanese', native: '日本語' },
          { code: 'ko', name: 'Korean', native: '한국어' },
          { code: 'ar', name: 'Arabic', native: 'العربية' },
        ];
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.languageSelector}>
              {languages.map((lang: any) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    value === lang.code && styles.languageOptionSelected
                  ]}
                  onPress={() => updateValue(lang.code)}
                >
                  <Text style={[
                    styles.languageName,
                    value === lang.code && styles.languageNameSelected
                  ]}>
                    {lang.name}
                  </Text>
                  <Text style={styles.languageNative}>{lang.native}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'color_picker':
      case 'color':
        // Color selection
        const colorConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const colors = colorConfig?.colors || [
          '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#00C7BE',
          '#007AFF', '#5856D6', '#AF52DE', '#FF2D55', '#A2845E',
          '#8E8E93', '#000000', '#FFFFFF',
        ];
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.colorPickerContainer}>
              {colors.map((color: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    value === color && styles.colorOptionSelected
                  ]}
                  onPress={() => updateValue(color)}
                >
                  {value === color && (
                    <Icon name="check" size={20} color={color === '#FFFFFF' ? '#000' : '#FFF'} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {value && (
              <View style={styles.selectedColorPreview}>
                <View style={[styles.colorPreviewBox, { backgroundColor: value }]} />
                <Text style={styles.colorPreviewText}>{value}</Text>
              </View>
            )}
          </View>
        );

      case 'accordion':
      case 'expandable':
        // Expandable/collapsible sections
        const accordionConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const accordionItems = accordionConfig?.items || [];
        const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
        
        const toggleAccordion = (itemId: string) => {
          if (expandedItems.includes(itemId)) {
            setExpandedItems(expandedItems.filter(id => id !== itemId));
          } else {
            if (accordionConfig?.allowMultiple) {
              setExpandedItems([...expandedItems, itemId]);
            } else {
              setExpandedItems([itemId]);
            }
          }
        };
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.accordionContainer}>
              {accordionItems.map((item: any, index: number) => {
                const itemId = item.id || `item_${index}`;
                const isExpanded = expandedItems.includes(itemId);
                return (
                  <View key={itemId} style={styles.accordionItem}>
                    <TouchableOpacity
                      style={styles.accordionHeader}
                      onPress={() => toggleAccordion(itemId)}
                    >
                      <Text style={styles.accordionTitle}>{item.title}</Text>
                      <Icon 
                        name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                        size={24} 
                        color="#666" 
                      />
                    </TouchableOpacity>
                    {isExpanded && (
                      <View style={styles.accordionContent}>
                        <Text style={styles.accordionText}>{item.content}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        );

      case 'carousel':
      case 'image_carousel':
        // Image/content carousel
        const carouselConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const carouselItems = Array.isArray(value) ? value : (carouselConfig?.items || []);
        const [carouselIndex, setCarouselIndex] = React.useState(0);
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.carouselContainer}>
              {carouselItems.length > 0 ? (
                <>
                  <View style={styles.carouselImageContainer}>
                    {carouselItems[carouselIndex]?.image ? (
                      <Image
                        source={{ uri: carouselItems[carouselIndex].image }}
                        style={styles.carouselImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.carouselPlaceholder}>
                        <Icon name="image-outline" size={48} color="#D1D1D6" />
                      </View>
                    )}
                    {carouselItems[carouselIndex]?.caption && (
                      <Text style={styles.carouselCaption}>
                        {carouselItems[carouselIndex].caption}
                      </Text>
                    )}
                  </View>
                  <View style={styles.carouselControls}>
                    <TouchableOpacity
                      style={[styles.carouselButton, carouselIndex === 0 && styles.carouselButtonDisabled]}
                      onPress={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
                      disabled={carouselIndex === 0}
                    >
                      <Icon name="chevron-left" size={24} color={carouselIndex === 0 ? '#D1D1D6' : '#007AFF'} />
                    </TouchableOpacity>
                    <View style={styles.carouselDots}>
                      {carouselItems.map((_: any, idx: number) => (
                        <View
                          key={idx}
                          style={[
                            styles.carouselDot,
                            idx === carouselIndex && styles.carouselDotActive
                          ]}
                        />
                      ))}
                    </View>
                    <TouchableOpacity
                      style={[styles.carouselButton, carouselIndex === carouselItems.length - 1 && styles.carouselButtonDisabled]}
                      onPress={() => setCarouselIndex(Math.min(carouselItems.length - 1, carouselIndex + 1))}
                      disabled={carouselIndex === carouselItems.length - 1}
                    >
                      <Icon name="chevron-right" size={24} color={carouselIndex === carouselItems.length - 1 ? '#D1D1D6' : '#007AFF'} />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.carouselPlaceholder}>
                  <Icon name="image-multiple-outline" size={48} color="#D1D1D6" />
                  <Text style={styles.carouselEmptyText}>No images</Text>
                </View>
              )}
            </View>
          </View>
        );

      case 'modal':
      case 'popup':
        // Modal dialog - shows a button that opens a modal
        const modalConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const [modalVisible, setModalVisible] = React.useState(false);
        
        return (
          <View style={styles.fieldContainer}>
            <TouchableOpacity
              style={styles.modalTriggerButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.modalTriggerText}>
                {modalConfig?.buttonText || displayLabel || 'Open Modal'}
              </Text>
            </TouchableOpacity>
            {modalVisible && (
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{modalConfig?.title || 'Modal'}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Icon name="close" size={24} color="#000" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText}>{value || modalConfig?.content || ''}</Text>
                  </View>
                  <View style={styles.modalFooter}>
                    {modalConfig?.showCancel !== false && (
                      <TouchableOpacity
                        style={styles.modalCancelButton}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={styles.modalCancelText}>Cancel</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.modalConfirmButton}
                      onPress={() => {
                        setModalVisible(false);
                        if (modalConfig?.onConfirm) {
                          updateValue(true);
                        }
                      }}
                    >
                      <Text style={styles.modalConfirmText}>
                        {modalConfig?.confirmText || 'OK'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        );

      case 'bottom_sheet':
        // Bottom sliding panel
        const bottomSheetConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const [sheetVisible, setSheetVisible] = React.useState(false);
        
        return (
          <View style={styles.fieldContainer}>
            <TouchableOpacity
              style={styles.bottomSheetTrigger}
              onPress={() => setSheetVisible(true)}
            >
              <Text style={styles.bottomSheetTriggerText}>
                {bottomSheetConfig?.buttonText || displayLabel || 'Show Options'}
              </Text>
              <Icon name="chevron-up" size={20} color="#007AFF" />
            </TouchableOpacity>
            {sheetVisible && (
              <View style={styles.bottomSheetOverlay}>
                <TouchableOpacity 
                  style={styles.bottomSheetBackdrop}
                  onPress={() => setSheetVisible(false)}
                />
                <View style={styles.bottomSheetContainer}>
                  <View style={styles.bottomSheetHandle} />
                  <Text style={styles.bottomSheetTitle}>
                    {bottomSheetConfig?.title || 'Options'}
                  </Text>
                  <View style={styles.bottomSheetContent}>
                    {(bottomSheetConfig?.options || []).map((option: any, idx: number) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.bottomSheetOption}
                        onPress={() => {
                          updateValue(option.value);
                          setSheetVisible(false);
                        }}
                      >
                        {option.icon && <Icon name={option.icon} size={24} color="#007AFF" />}
                        <Text style={styles.bottomSheetOptionText}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.bottomSheetCloseButton}
                    onPress={() => setSheetVisible(false)}
                  >
                    <Text style={styles.bottomSheetCloseText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        );

      case 'action_sheet':
        // Action selection sheet
        const actionSheetConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        
        const showActionSheet = () => {
          const options = actionSheetConfig?.options || [];
          const buttons = [
            ...options.map((opt: any) => opt.label),
            'Cancel'
          ];
          
          Alert.alert(
            actionSheetConfig?.title || 'Select Action',
            actionSheetConfig?.message || '',
            buttons.map((label, idx) => ({
              text: label,
              style: idx === buttons.length - 1 ? 'cancel' : 
                     options[idx]?.destructive ? 'destructive' : 'default',
              onPress: () => {
                if (idx < options.length) {
                  updateValue(options[idx].value);
                }
              }
            }))
          );
        };
        
        return (
          <View style={styles.fieldContainer}>
            <TouchableOpacity
              style={styles.actionSheetTrigger}
              onPress={showActionSheet}
            >
              <Text style={styles.actionSheetTriggerText}>
                {value || actionSheetConfig?.placeholder || displayLabel || 'Select...'}
              </Text>
              <Icon name="dots-horizontal" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        );

      case 'toast':
      case 'toast_message':
        // Toast notification display
        const toastConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const toastType = toastConfig?.type || 'info';
        const toastMessage = value || toastConfig?.message || '';
        
        if (!toastMessage) return null;
        
        const toastColors: Record<string, { bg: string; text: string; icon: string }> = {
          info: { bg: '#007AFF', text: '#FFFFFF', icon: 'information' },
          success: { bg: '#34C759', text: '#FFFFFF', icon: 'check-circle' },
          warning: { bg: '#FF9500', text: '#FFFFFF', icon: 'alert' },
          error: { bg: '#FF3B30', text: '#FFFFFF', icon: 'alert-circle' },
        };
        const toastStyle = toastColors[toastType] || toastColors.info;
        
        return (
          <View style={[styles.toastContainer, { backgroundColor: toastStyle.bg }]}>
            <Icon name={toastStyle.icon} size={20} color={toastStyle.text} />
            <Text style={[styles.toastText, { color: toastStyle.text }]}>{toastMessage}</Text>
            <TouchableOpacity onPress={() => updateValue('')}>
              <Icon name="close" size={18} color={toastStyle.text} />
            </TouchableOpacity>
          </View>
        );

      case 'snackbar':
        // Temporary notification at bottom
        const snackbarConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const snackbarMessage = value || snackbarConfig?.message || '';
        const snackbarAction = snackbarConfig?.actionText;
        
        if (!snackbarMessage) return null;
        
        return (
          <View style={styles.snackbarContainer}>
            <Text style={styles.snackbarText}>{snackbarMessage}</Text>
            {snackbarAction && (
              <TouchableOpacity
                onPress={() => {
                  if (snackbarConfig?.onAction) {
                    updateValue({ action: true });
                  }
                }}
              >
                <Text style={styles.snackbarAction}>{snackbarAction}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => updateValue('')}>
              <Icon name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        );

      case 'map_view':
      case 'map':
        // Interactive map display
        const mapConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const mapLocation = typeof value === 'object' ? value : { lat: mapConfig?.defaultLat || 37.7749, lng: mapConfig?.defaultLng || -122.4194 };
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.mapContainer}>
              <View style={styles.mapPlaceholder}>
                <Icon name="map-marker" size={48} color="#007AFF" />
                <Text style={styles.mapPlaceholderText}>Map View</Text>
                <Text style={styles.mapCoordinates}>
                  {mapLocation.lat?.toFixed(4)}, {mapLocation.lng?.toFixed(4)}
                </Text>
              </View>
              <Text style={styles.mapNote}>
                Full map requires react-native-maps package
              </Text>
            </View>
          </View>
        );

      case 'location_picker':
      case 'location':
        // GPS/map location picker
        const locationConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const locationValue = typeof value === 'object' ? value : null;
        
        const getCurrentLocation = () => {
          // In a real implementation, this would use Geolocation API
          Alert.alert(
            'Location Access',
            'This would request GPS location. Requires react-native-geolocation-service.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Use Sample Location', 
                onPress: () => updateValue({ 
                  lat: 37.7749, 
                  lng: -122.4194, 
                  address: '123 Sample St, San Francisco, CA' 
                })
              }
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
              style={styles.locationPickerButton}
              onPress={getCurrentLocation}
            >
              <Icon name="crosshairs-gps" size={24} color="#007AFF" />
              <Text style={styles.locationPickerText}>
                {locationValue?.address || 'Get Current Location'}
              </Text>
            </TouchableOpacity>
            {locationValue && (
              <View style={styles.locationPreview}>
                <Icon name="map-marker" size={20} color="#34C759" />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationAddress}>{locationValue.address}</Text>
                  <Text style={styles.locationCoords}>
                    {locationValue.lat?.toFixed(6)}, {locationValue.lng?.toFixed(6)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => updateValue(null)}>
                  <Icon name="close-circle" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'barcode_scanner':
      case 'qr_scanner':
        // QR/barcode scanning
        const scannerConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        
        const openScanner = () => {
          Alert.alert(
            'Barcode Scanner',
            'Scanning requires react-native-camera or expo-barcode-scanner package.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Enter Code Manually', 
                onPress: () => {
                  Alert.prompt?.(
                    'Enter Code',
                    'Type the barcode/QR code value:',
                    (text) => text && updateValue(text)
                  ) || updateValue('SAMPLE-CODE-12345');
                }
              }
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
              style={styles.scannerButton}
              onPress={openScanner}
            >
              <Icon name="barcode-scan" size={32} color="#FFFFFF" />
              <Text style={styles.scannerButtonText}>
                {scannerConfig?.buttonText || 'Scan Code'}
              </Text>
            </TouchableOpacity>
            {value && (
              <View style={styles.scannedResult}>
                <Icon name="check-circle" size={20} color="#34C759" />
                <Text style={styles.scannedValue}>{value}</Text>
                <TouchableOpacity onPress={() => updateValue('')}>
                  <Icon name="close-circle" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'signature_pad':
      case 'signature':
        // Digital signature capture
        const signatureConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.signaturePadContainer}>
              {value ? (
                <View style={styles.signaturePreview}>
                  <Image
                    source={{ uri: value }}
                    style={styles.signatureImage}
                    resizeMode="contain"
                  />
                  <TouchableOpacity
                    style={styles.clearSignatureButton}
                    onPress={() => updateValue('')}
                  >
                    <Text style={styles.clearSignatureText}>Clear Signature</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.signaturePlaceholder}>
                  <Icon name="draw" size={48} color="#D1D1D6" />
                  <Text style={styles.signaturePlaceholderText}>
                    Tap to sign
                  </Text>
                  <Text style={styles.signatureNote}>
                    Full signature pad requires react-native-signature-canvas
                  </Text>
                  <TouchableOpacity
                    style={styles.signatureDemoButton}
                    onPress={() => updateValue('data:image/png;base64,demo_signature')}
                  >
                    <Text style={styles.signatureDemoText}>Add Demo Signature</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        );

      case 'chart':
      case 'chart_graph':
      case 'graph':
        // Data visualization chart
        const chartConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const chartType = chartConfig?.type || 'bar';
        const chartData = Array.isArray(value) ? value : (chartConfig?.data || [
          { label: 'Jan', value: 30 },
          { label: 'Feb', value: 45 },
          { label: 'Mar', value: 28 },
          { label: 'Apr', value: 60 },
          { label: 'May', value: 52 },
        ]);
        const maxChartValue = Math.max(...chartData.map((d: any) => d.value), 1);
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.chartContainer}>
              {chartType === 'bar' && (
                <View style={styles.barChart}>
                  {chartData.map((item: any, idx: number) => (
                    <View key={idx} style={styles.barChartItem}>
                      <View style={styles.barChartBarContainer}>
                        <View 
                          style={[
                            styles.barChartBar,
                            { height: `${(item.value / maxChartValue) * 100}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.barChartLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              )}
              {chartType === 'line' && (
                <View style={styles.lineChartPlaceholder}>
                  <Icon name="chart-line" size={48} color="#007AFF" />
                  <Text style={styles.chartPlaceholderText}>Line Chart</Text>
                  <Text style={styles.chartNote}>
                    Full charts require react-native-chart-kit
                  </Text>
                </View>
              )}
              {chartType === 'pie' && (
                <View style={styles.pieChartPlaceholder}>
                  <Icon name="chart-pie" size={48} color="#007AFF" />
                  <Text style={styles.chartPlaceholderText}>Pie Chart</Text>
                  <Text style={styles.chartNote}>
                    Full charts require react-native-chart-kit
                  </Text>
                </View>
              )}
            </View>
          </View>
        );

      case 'qr_code_display':
      case 'qr_code':
        // Display QR code
        const qrConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const qrValue = value || qrConfig?.value || 'https://example.com';
        const qrSize = qrConfig?.size || 200;
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.qrCodeContainer}>
              <View style={[styles.qrCodePlaceholder, { width: qrSize, height: qrSize }]}>
                <Icon name="qrcode" size={qrSize * 0.6} color="#000000" />
              </View>
              <Text style={styles.qrCodeValue} numberOfLines={2}>{qrValue}</Text>
              <Text style={styles.qrCodeNote}>
                Full QR code requires react-native-qrcode-svg
              </Text>
            </View>
          </View>
        );

      case 'calendar':
      case 'calendar_view':
        // Full calendar view
        const calendarConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const selectedDate = value ? new Date(value) : new Date();
        const currentMonth = selectedDate.getMonth();
        const currentYear = selectedDate.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        const calendarDays = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
          calendarDays.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
          calendarDays.push(i);
        }
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity
                  onPress={() => {
                    const newDate = new Date(currentYear, currentMonth - 1, 1);
                    updateValue(newDate.toISOString());
                  }}
                >
                  <Icon name="chevron-left" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.calendarMonthYear}>
                  {monthNames[currentMonth]} {currentYear}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const newDate = new Date(currentYear, currentMonth + 1, 1);
                    updateValue(newDate.toISOString());
                  }}
                >
                  <Icon name="chevron-right" size={24} color="#007AFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.calendarDayNames}>
                {dayNames.map((day, idx) => (
                  <Text key={idx} style={styles.calendarDayName}>{day}</Text>
                ))}
              </View>
              <View style={styles.calendarGrid}>
                {calendarDays.map((day, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.calendarDay,
                      day === selectedDate.getDate() && styles.calendarDaySelected
                    ]}
                    onPress={() => {
                      if (day) {
                        const newDate = new Date(currentYear, currentMonth, day);
                        updateValue(newDate.toISOString());
                      }
                    }}
                    disabled={!day}
                  >
                    <Text style={[
                      styles.calendarDayText,
                      day === selectedDate.getDate() && styles.calendarDayTextSelected
                    ]}>
                      {day || ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 'pull_to_refresh':
        // Pull to refresh indicator
        const refreshConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const [isRefreshing, setIsRefreshing] = React.useState(false);
        
        const onRefresh = () => {
          setIsRefreshing(true);
          // Simulate refresh
          setTimeout(() => {
            setIsRefreshing(false);
            updateValue(new Date().toISOString());
          }, 1500);
        };
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.pullToRefreshContainer}>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={onRefresh}
                disabled={isRefreshing}
              >
                <Icon 
                  name={isRefreshing ? 'loading' : 'refresh'} 
                  size={24} 
                  color="#007AFF" 
                />
                <Text style={styles.refreshText}>
                  {isRefreshing ? 'Refreshing...' : 'Pull to Refresh'}
                </Text>
              </TouchableOpacity>
              {value && (
                <Text style={styles.lastRefreshed}>
                  Last updated: {new Date(value).toLocaleTimeString()}
                </Text>
              )}
              <Text style={styles.refreshNote}>
                In a real list, this would be integrated with ScrollView/FlatList
              </Text>
            </View>
          </View>
        );

      case 'infinite_scroll':
      case 'load_more':
        // Infinite scroll / load more
        const infiniteConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const [loadingMore, setLoadingMore] = React.useState(false);
        const currentPage = typeof value === 'number' ? value : 1;
        
        const loadMore = () => {
          setLoadingMore(true);
          setTimeout(() => {
            updateValue(currentPage + 1);
            setLoadingMore(false);
          }, 1000);
        };
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.infiniteScrollContainer}>
              <Text style={styles.pageIndicator}>Page {currentPage}</Text>
              <TouchableOpacity
                style={[styles.loadMoreButton, loadingMore && styles.loadMoreButtonDisabled]}
                onPress={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <Text style={styles.loadMoreText}>Loading...</Text>
                ) : (
                  <>
                    <Text style={styles.loadMoreText}>Load More</Text>
                    <Icon name="chevron-down" size={20} color="#007AFF" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'swipe_actions':
      case 'swipeable':
        // Swipeable list item
        const swipeConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const swipeActions = swipeConfig?.actions || [
          { label: 'Edit', color: '#007AFF', icon: 'pencil' },
          { label: 'Delete', color: '#FF3B30', icon: 'trash-can' },
        ];
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.swipeableContainer}>
              <View style={styles.swipeableContent}>
                <Text style={styles.swipeableText}>{value || 'Swipeable Item'}</Text>
                <Text style={styles.swipeableHint}>← Swipe to reveal actions</Text>
              </View>
              <View style={styles.swipeActions}>
                {swipeActions.map((action: any, idx: number) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.swipeAction, { backgroundColor: action.color }]}
                    onPress={() => updateValue({ action: action.label })}
                  >
                    <Icon name={action.icon} size={20} color="#FFFFFF" />
                    <Text style={styles.swipeActionText}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Text style={styles.swipeNote}>
              Full swipe requires react-native-gesture-handler
            </Text>
          </View>
        );

      case 'table':
      case 'data_table':
        // Data table display
        const tableConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const tableColumns = tableConfig?.columns || ['Name', 'Value', 'Status'];
        const tableData = Array.isArray(value) ? value : (tableConfig?.data || [
          { Name: 'Item 1', Value: '$100', Status: 'Active' },
          { Name: 'Item 2', Value: '$250', Status: 'Pending' },
          { Name: 'Item 3', Value: '$75', Status: 'Active' },
        ]);
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                {tableColumns.map((col: string, idx: number) => (
                  <Text key={idx} style={styles.tableHeaderCell}>{col}</Text>
                ))}
              </View>
              {tableData.map((row: any, rowIdx: number) => (
                <View key={rowIdx} style={[styles.tableRow, rowIdx % 2 === 1 && styles.tableRowAlt]}>
                  {tableColumns.map((col: string, colIdx: number) => (
                    <Text key={colIdx} style={styles.tableCell}>{row[col] || '-'}</Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        );

      case 'data_grid':
      case 'grid':
        // Grid layout for items
        const gridConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const gridColumns = gridConfig?.columns || 3;
        const gridItems = Array.isArray(value) ? value : (gridConfig?.items || [
          { title: 'Item 1', icon: 'folder' },
          { title: 'Item 2', icon: 'file' },
          { title: 'Item 3', icon: 'image' },
          { title: 'Item 4', icon: 'music' },
          { title: 'Item 5', icon: 'video' },
          { title: 'Item 6', icon: 'star' },
        ]);
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.dataGridContainer}>
              {gridItems.map((item: any, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.dataGridItem, { width: `${100 / gridColumns - 2}%` }]}
                  onPress={() => updateValue(item)}
                >
                  <Icon name={item.icon || 'square'} size={32} color="#007AFF" />
                  <Text style={styles.dataGridItemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'timeline':
        // Vertical timeline
        const timelineConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const timelineItems = Array.isArray(value) ? value : (timelineConfig?.items || [
          { title: 'Order Placed', time: '10:00 AM', description: 'Your order has been placed', completed: true },
          { title: 'Processing', time: '10:30 AM', description: 'Order is being processed', completed: true },
          { title: 'Shipped', time: '2:00 PM', description: 'Package has been shipped', completed: false },
          { title: 'Delivered', time: 'Pending', description: 'Estimated delivery tomorrow', completed: false },
        ]);
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.timelineContainer}>
              {timelineItems.map((item: any, idx: number) => (
                <View key={idx} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[
                      styles.timelineDot,
                      item.completed && styles.timelineDotCompleted
                    ]}>
                      {item.completed && <Icon name="check" size={12} color="#FFFFFF" />}
                    </View>
                    {idx < timelineItems.length - 1 && (
                      <View style={[
                        styles.timelineLine,
                        item.completed && styles.timelineLineCompleted
                      ]} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>{item.title}</Text>
                    <Text style={styles.timelineTime}>{item.time}</Text>
                    {item.description && (
                      <Text style={styles.timelineDescription}>{item.description}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        );

      case 'pagination':
      case 'pager':
        // Page navigation
        const paginationConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const totalPages = paginationConfig?.totalPages || 10;
        const currentPageNum = typeof value === 'number' ? value : 1;
        const showPages = 5;
        
        let startPage = Math.max(1, currentPageNum - Math.floor(showPages / 2));
        let endPage = Math.min(totalPages, startPage + showPages - 1);
        if (endPage - startPage < showPages - 1) {
          startPage = Math.max(1, endPage - showPages + 1);
        }
        
        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[styles.paginationButton, currentPageNum === 1 && styles.paginationButtonDisabled]}
                onPress={() => updateValue(1)}
                disabled={currentPageNum === 1}
              >
                <Icon name="chevron-double-left" size={18} color={currentPageNum === 1 ? '#D1D1D6' : '#007AFF'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.paginationButton, currentPageNum === 1 && styles.paginationButtonDisabled]}
                onPress={() => updateValue(Math.max(1, currentPageNum - 1))}
                disabled={currentPageNum === 1}
              >
                <Icon name="chevron-left" size={18} color={currentPageNum === 1 ? '#D1D1D6' : '#007AFF'} />
              </TouchableOpacity>
              
              {pageNumbers.map((page) => (
                <TouchableOpacity
                  key={page}
                  style={[
                    styles.paginationPage,
                    page === currentPageNum && styles.paginationPageActive
                  ]}
                  onPress={() => updateValue(page)}
                >
                  <Text style={[
                    styles.paginationPageText,
                    page === currentPageNum && styles.paginationPageTextActive
                  ]}>
                    {page}
                  </Text>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={[styles.paginationButton, currentPageNum === totalPages && styles.paginationButtonDisabled]}
                onPress={() => updateValue(Math.min(totalPages, currentPageNum + 1))}
                disabled={currentPageNum === totalPages}
              >
                <Icon name="chevron-right" size={18} color={currentPageNum === totalPages ? '#D1D1D6' : '#007AFF'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.paginationButton, currentPageNum === totalPages && styles.paginationButtonDisabled]}
                onPress={() => updateValue(totalPages)}
                disabled={currentPageNum === totalPages}
              >
                <Icon name="chevron-double-right" size={18} color={currentPageNum === totalPages ? '#D1D1D6' : '#007AFF'} />
              </TouchableOpacity>
            </View>
            <Text style={styles.paginationInfo}>
              Page {currentPageNum} of {totalPages}
            </Text>
          </View>
        );

      case 'payment_method_card':
      case 'payment_card':
        // Payment method display card
        const paymentConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const paymentData = typeof value === 'object' ? value : {
          type: 'visa',
          last4: '4242',
          expiry: '12/25',
          name: 'John Doe'
        };
        
        const cardIcons: Record<string, string> = {
          visa: 'credit-card',
          mastercard: 'credit-card',
          amex: 'credit-card',
          discover: 'credit-card',
          paypal: 'paypal',
          apple: 'apple',
          google: 'google',
        };
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.paymentCardContainer}>
              <View style={styles.paymentCardHeader}>
                <Icon name={cardIcons[paymentData.type] || 'credit-card'} size={32} color="#007AFF" />
                <Text style={styles.paymentCardType}>
                  {paymentData.type?.toUpperCase() || 'CARD'}
                </Text>
              </View>
              <Text style={styles.paymentCardNumber}>
                •••• •••• •••• {paymentData.last4 || '****'}
              </Text>
              <View style={styles.paymentCardFooter}>
                <View>
                  <Text style={styles.paymentCardLabel}>Card Holder</Text>
                  <Text style={styles.paymentCardValue}>{paymentData.name || 'N/A'}</Text>
                </View>
                <View>
                  <Text style={styles.paymentCardLabel}>Expires</Text>
                  <Text style={styles.paymentCardValue}>{paymentData.expiry || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 'transaction_list_item':
      case 'transaction':
        // Transaction display item
        const transactionConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const transactionData = typeof value === 'object' ? value : {
          title: 'Payment Received',
          description: 'Booking #12345',
          amount: 250.00,
          type: 'credit',
          date: new Date().toISOString(),
          status: 'completed'
        };
        
        const isCredit = transactionData.type === 'credit';
        const statusColors: Record<string, string> = {
          completed: '#34C759',
          pending: '#FF9500',
          failed: '#FF3B30',
        };
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <TouchableOpacity style={styles.transactionItem}>
              <View style={[styles.transactionIcon, { backgroundColor: isCredit ? '#E8F5E9' : '#FFEBEE' }]}>
                <Icon 
                  name={isCredit ? 'arrow-down' : 'arrow-up'} 
                  size={20} 
                  color={isCredit ? '#34C759' : '#FF3B30'} 
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{transactionData.title}</Text>
                <Text style={styles.transactionDescription}>{transactionData.description}</Text>
                <Text style={styles.transactionDate}>
                  {new Date(transactionData.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.transactionAmountContainer}>
                <Text style={[styles.transactionAmount, { color: isCredit ? '#34C759' : '#FF3B30' }]}>
                  {isCredit ? '+' : '-'}${transactionData.amount?.toFixed(2)}
                </Text>
                <View style={[styles.transactionStatus, { backgroundColor: statusColors[transactionData.status] || '#8E8E93' }]}>
                  <Text style={styles.transactionStatusText}>
                    {transactionData.status?.charAt(0).toUpperCase() + transactionData.status?.slice(1)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );

      case 'fee_breakdown':
      case 'fees':
        // Itemized fees display
        const feeConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const feeItems = Array.isArray(value) ? value : (feeConfig?.items || [
          { label: 'Subtotal', amount: 200.00 },
          { label: 'Service Fee', amount: 25.00 },
          { label: 'Cleaning Fee', amount: 50.00 },
          { label: 'Tax', amount: 22.00, isPercent: true, percent: 8 },
        ]);
        const feeTotal = feeItems.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.feeBreakdownContainer}>
              {feeItems.map((item: any, idx: number) => (
                <View key={idx} style={styles.feeItem}>
                  <Text style={styles.feeLabel}>
                    {item.label}
                    {item.isPercent && ` (${item.percent}%)`}
                  </Text>
                  <Text style={styles.feeAmount}>${item.amount?.toFixed(2)}</Text>
                </View>
              ))}
              <View style={styles.feeTotalRow}>
                <Text style={styles.feeTotalLabel}>Total</Text>
                <Text style={styles.feeTotalAmount}>${feeTotal.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        );

      case 'earnings_summary':
      case 'earnings':
        // Earnings overview display
        const earningsConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const earningsData = typeof value === 'object' ? value : {
          totalEarnings: 5250.00,
          pendingPayout: 750.00,
          lastPayout: 1200.00,
          lastPayoutDate: '2024-01-15',
          thisMonth: 2100.00,
          lastMonth: 1850.00,
        };
        
        const monthChange = earningsData.thisMonth - earningsData.lastMonth;
        const monthChangePercent = ((monthChange / earningsData.lastMonth) * 100).toFixed(1);
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.earningsContainer}>
              <View style={styles.earningsMainCard}>
                <Text style={styles.earningsLabel}>Total Earnings</Text>
                <Text style={styles.earningsTotal}>${earningsData.totalEarnings?.toLocaleString()}</Text>
              </View>
              <View style={styles.earningsRow}>
                <View style={styles.earningsCard}>
                  <Text style={styles.earningsCardLabel}>Pending</Text>
                  <Text style={styles.earningsCardValue}>${earningsData.pendingPayout?.toFixed(2)}</Text>
                </View>
                <View style={styles.earningsCard}>
                  <Text style={styles.earningsCardLabel}>Last Payout</Text>
                  <Text style={styles.earningsCardValue}>${earningsData.lastPayout?.toFixed(2)}</Text>
                </View>
              </View>
              <View style={styles.earningsComparison}>
                <Text style={styles.earningsCompareLabel}>This Month vs Last Month</Text>
                <View style={styles.earningsCompareRow}>
                  <Text style={styles.earningsCompareValue}>${earningsData.thisMonth?.toFixed(2)}</Text>
                  <View style={[styles.earningsChange, { backgroundColor: monthChange >= 0 ? '#E8F5E9' : '#FFEBEE' }]}>
                    <Icon 
                      name={monthChange >= 0 ? 'trending-up' : 'trending-down'} 
                      size={16} 
                      color={monthChange >= 0 ? '#34C759' : '#FF3B30'} 
                    />
                    <Text style={[styles.earningsChangeText, { color: monthChange >= 0 ? '#34C759' : '#FF3B30' }]}>
                      {monthChange >= 0 ? '+' : ''}{monthChangePercent}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );

      case 'quote_builder':
      case 'quote':
        // Itemized quote builder
        const quoteConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const quoteItems = Array.isArray(value) ? value : [];
        
        const addQuoteItem = () => {
          const newItem = { id: Date.now(), description: 'New Item', quantity: 1, price: 0 };
          updateValue([...quoteItems, newItem]);
        };
        
        const updateQuoteItem = (id: number, field: string, val: any) => {
          updateValue(quoteItems.map((item: any) => 
            item.id === id ? { ...item, [field]: val } : item
          ));
        };
        
        const removeQuoteItem = (id: number) => {
          updateValue(quoteItems.filter((item: any) => item.id !== id));
        };
        
        const quoteTotal = quoteItems.reduce((sum: number, item: any) => 
          sum + (item.quantity || 0) * (item.price || 0), 0
        );
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.quoteBuilderContainer}>
              {quoteItems.map((item: any, idx: number) => (
                <View key={item.id} style={styles.quoteItem}>
                  <TextInput
                    style={styles.quoteItemDescription}
                    value={item.description}
                    onChangeText={(text) => updateQuoteItem(item.id, 'description', text)}
                    placeholder="Description"
                  />
                  <TextInput
                    style={styles.quoteItemQty}
                    value={String(item.quantity || '')}
                    onChangeText={(text) => updateQuoteItem(item.id, 'quantity', parseInt(text) || 0)}
                    keyboardType="number-pad"
                    placeholder="Qty"
                  />
                  <TextInput
                    style={styles.quoteItemPrice}
                    value={String(item.price || '')}
                    onChangeText={(text) => updateQuoteItem(item.id, 'price', parseFloat(text) || 0)}
                    keyboardType="decimal-pad"
                    placeholder="Price"
                  />
                  <TouchableOpacity onPress={() => removeQuoteItem(item.id)}>
                    <Icon name="close-circle" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addQuoteItemButton} onPress={addQuoteItem}>
                <Icon name="plus" size={20} color="#007AFF" />
                <Text style={styles.addQuoteItemText}>Add Item</Text>
              </TouchableOpacity>
              <View style={styles.quoteTotalRow}>
                <Text style={styles.quoteTotalLabel}>Total</Text>
                <Text style={styles.quoteTotalAmount}>${quoteTotal.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        );

      case 'currency_selector':
      case 'currency_picker':
        // Currency selection dropdown
        const currencySelectorConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const currencies = currencySelectorConfig?.currencies || [
          { code: 'USD', symbol: '$', name: 'US Dollar' },
          { code: 'EUR', symbol: '€', name: 'Euro' },
          { code: 'GBP', symbol: '£', name: 'British Pound' },
          { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
          { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
          { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
          { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
          { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
          { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
          { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
        ];
        const selectedCurrency = currencies.find((c: any) => c.code === value);
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.currencySelectorContainer}>
              {currencies.map((currency: any) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyOption,
                    value === currency.code && styles.currencyOptionSelected
                  ]}
                  onPress={() => updateValue(currency.code)}
                >
                  <Text style={styles.currencySymbolLarge}>{currency.symbol}</Text>
                  <View style={styles.currencyInfo}>
                    <Text style={[
                      styles.currencyCodeText,
                      value === currency.code && styles.currencyCodeTextSelected
                    ]}>
                      {currency.code}
                    </Text>
                    <Text style={styles.currencyNameText}>{currency.name}</Text>
                  </View>
                  {value === currency.code && (
                    <Icon name="check" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'amount_input_currency':
      case 'money_input':
        // Large amount input with currency
        const amountConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const amountCurrency = amountConfig?.currency || 'USD';
        const amountSymbol = amountConfig?.symbol || '$';
        const amountValue = typeof value === 'number' ? value : (parseFloat(value) || 0);
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.amountSymbol}>{amountSymbol}</Text>
              <TextInput
                style={styles.amountInput}
                value={amountValue > 0 ? amountValue.toFixed(2) : ''}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9.]/g, '');
                  updateValue(parseFloat(cleaned) || 0);
                }}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
              <View style={styles.amountCurrencyBadge}>
                <Text style={styles.amountCurrencyText}>{amountCurrency}</Text>
              </View>
            </View>
            {amountConfig?.showConversion && amountConfig?.conversionRate && (
              <Text style={styles.amountConversion}>
                ≈ {amountConfig.conversionSymbol || '€'}{(amountValue * amountConfig.conversionRate).toFixed(2)} {amountConfig.conversionCurrency || 'EUR'}
              </Text>
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

      case 'file_upload':
      case 'document_picker':
        // Generic file upload using document picker
        const handleFilePick = async () => {
          try {
            const result = await launchImageLibrary({
              mediaType: 'mixed',
              quality: 0.8,
            });
            
            if (result.didCancel) return;
            if (result.errorCode) {
              Alert.alert('Error', result.errorMessage || 'Failed to select file');
              return;
            }
            
            if (result.assets && result.assets[0]) {
              const file = result.assets[0];
              updateValue({
                uri: file.uri,
                name: file.fileName || 'file',
                type: file.type || 'application/octet-stream',
                size: file.fileSize,
              });
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to pick file');
          }
        };

        const fileValue = typeof value === 'object' ? value : null;
        
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleFilePick}
            >
              <Icon name="file-upload-outline" size={24} color="#007AFF" />
              <Text style={styles.uploadButtonText}>
                {element.config?.uploadText || 'Select File'}
              </Text>
            </TouchableOpacity>
            {fileValue && (
              <View style={styles.fileInfoContainer}>
                <Icon name="file-document-outline" size={24} color="#007AFF" />
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>{fileValue.name}</Text>
                  {fileValue.size && (
                    <Text style={styles.fileSize}>
                      {(fileValue.size / 1024).toFixed(1)} KB
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => updateValue(null)}>
                  <Icon name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'camera_capture':
        // Direct camera capture
        const handleCameraCapture = () => {
          launchCamera(
            {
              mediaType: 'photo',
              quality: 0.8,
              maxWidth: 1920,
              maxHeight: 1080,
              saveToPhotos: true,
            },
            async (response) => {
              if (response.didCancel) return;
              if (response.errorCode) {
                Alert.alert('Error', response.errorMessage || 'Failed to capture');
                return;
              }
              if (response.assets && response.assets[0]?.uri) {
                const localUri = response.assets[0].uri;
                updateValue(localUri);
                
                // Upload to server
                try {
                  const serverUrl = await uploadService.uploadImage(localUri);
                  updateValue(serverUrl);
                } catch (error) {
                  console.error('Upload failed:', error);
                }
              }
            }
          );
        };

        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleCameraCapture}
            >
              <Icon name="camera" size={32} color="#FFFFFF" />
              <Text style={styles.cameraButtonText}>
                {element.config?.buttonText || 'Take Photo'}
              </Text>
            </TouchableOpacity>
            {value && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: value }}
                  style={styles.capturedImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => updateValue('')}
                >
                  <Text style={styles.removeImageText}>Retake</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'video_upload':
        // Video file upload
        const handleVideoUpload = () => {
          Alert.alert(
            'Select Video',
            'Choose video source',
            [
              {
                text: 'Record Video',
                onPress: () => {
                  launchCamera(
                    {
                      mediaType: 'video',
                      videoQuality: 'high',
                      durationLimit: element.config?.maxDuration || 60,
                    },
                    (response) => {
                      if (response.didCancel) return;
                      if (response.errorCode) {
                        Alert.alert('Error', response.errorMessage || 'Failed to record');
                        return;
                      }
                      if (response.assets && response.assets[0]?.uri) {
                        updateValue({
                          uri: response.assets[0].uri,
                          duration: response.assets[0].duration,
                          type: response.assets[0].type,
                        });
                      }
                    }
                  );
                },
              },
              {
                text: 'Choose from Library',
                onPress: () => {
                  launchImageLibrary(
                    {
                      mediaType: 'video',
                      videoQuality: 'high',
                    },
                    (response) => {
                      if (response.didCancel) return;
                      if (response.errorCode) {
                        Alert.alert('Error', response.errorMessage || 'Failed to select');
                        return;
                      }
                      if (response.assets && response.assets[0]?.uri) {
                        updateValue({
                          uri: response.assets[0].uri,
                          duration: response.assets[0].duration,
                          type: response.assets[0].type,
                        });
                      }
                    }
                  );
                },
              },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        };

        const videoValue = typeof value === 'object' ? value : (value ? { uri: value } : null);

        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleVideoUpload}
            >
              <Icon name="video-plus" size={24} color="#007AFF" />
              <Text style={styles.uploadButtonText}>
                {element.config?.uploadText || 'Upload Video'}
              </Text>
            </TouchableOpacity>
            {videoValue && (
              <View style={styles.videoPreviewContainer}>
                <View style={styles.videoThumbnail}>
                  <Icon name="play-circle" size={48} color="#FFFFFF" />
                </View>
                {videoValue.duration && (
                  <Text style={styles.videoDuration}>
                    {Math.floor(videoValue.duration / 60)}:{String(Math.floor(videoValue.duration % 60)).padStart(2, '0')}
                  </Text>
                )}
                <TouchableOpacity
                  style={styles.removeVideoButton}
                  onPress={() => updateValue(null)}
                >
                  <Icon name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'video_player':
        // Video player display (read-only)
        const videoUrl = typeof value === 'object' ? value.uri : value;
        if (!videoUrl) return null;
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.videoPlayerContainer}>
              <View style={styles.videoPlaceholder}>
                <Icon name="play-circle-outline" size={64} color="#007AFF" />
                <Text style={styles.videoPlayText}>Tap to play video</Text>
              </View>
              <TouchableOpacity
                style={styles.videoPlayButton}
                onPress={() => {
                  // In a full implementation, this would open a video player modal
                  Alert.alert('Video Player', 'Video playback requires react-native-video package');
                }}
              >
                <Text style={styles.videoPlayButtonText}>Play Video</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'audio_player':
        // Audio player display
        const audioUrl = typeof value === 'object' ? value.uri : value;
        if (!audioUrl) return null;
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.audioPlayerContainer}>
              <TouchableOpacity style={styles.audioPlayButton}>
                <Icon name="play" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.audioProgress}>
                <View style={styles.audioProgressBar}>
                  <View style={[styles.audioProgressFill, { width: '0%' }]} />
                </View>
                <Text style={styles.audioTime}>0:00 / --:--</Text>
              </View>
              <TouchableOpacity>
                <Icon name="volume-high" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.audioNote}>Audio playback requires react-native-audio-recorder-player</Text>
          </View>
        );

      case 'audio_recorder':
        // Audio recorder
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.audioRecorderContainer}>
              {!value ? (
                <TouchableOpacity
                  style={styles.recordButton}
                  onPress={() => {
                    Alert.alert('Audio Recorder', 'Audio recording requires react-native-audio-recorder-player package');
                  }}
                >
                  <Icon name="microphone" size={32} color="#FFFFFF" />
                  <Text style={styles.recordButtonText}>
                    {element.config?.recordText || 'Start Recording'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.recordedAudioContainer}>
                  <View style={styles.audioPlayerContainer}>
                    <TouchableOpacity style={styles.audioPlayButton}>
                      <Icon name="play" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.audioProgress}>
                      <View style={styles.audioProgressBar}>
                        <View style={[styles.audioProgressFill, { width: '100%' }]} />
                      </View>
                      <Text style={styles.audioTime}>Recording saved</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteRecordingButton}
                    onPress={() => updateValue(null)}
                  >
                    <Icon name="delete" size={20} color="#FF3B30" />
                    <Text style={styles.deleteRecordingText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        );

      case 'image_picker':
        // Multiple image picker
        const handleMultiImagePick = () => {
          launchImageLibrary(
            {
              mediaType: 'photo',
              quality: 0.8,
              selectionLimit: element.config?.maxImages || 10,
            },
            async (response) => {
              if (response.didCancel) return;
              if (response.errorCode) {
                Alert.alert('Error', response.errorMessage || 'Failed to select images');
                return;
              }
              if (response.assets && response.assets.length > 0) {
                const images = response.assets.map(asset => ({
                  uri: asset.uri,
                  width: asset.width,
                  height: asset.height,
                }));
                const currentImages = Array.isArray(value) ? value : [];
                updateValue([...currentImages, ...images]);
              }
            }
          );
        };

        const selectedImages = Array.isArray(value) ? value : [];

        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleMultiImagePick}
            >
              <Icon name="image-multiple" size={24} color="#007AFF" />
              <Text style={styles.uploadButtonText}>
                {element.config?.uploadText || 'Select Images'}
              </Text>
            </TouchableOpacity>
            {selectedImages.length > 0 && (
              <View style={styles.imageGridContainer}>
                {selectedImages.map((img: any, index: number) => (
                  <View key={index} style={styles.imageGridItem}>
                    <Image
                      source={{ uri: img.uri }}
                      style={styles.imageGridImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.imageGridRemove}
                      onPress={() => {
                        const newImages = selectedImages.filter((_: any, i: number) => i !== index);
                        updateValue(newImages);
                      }}
                    >
                      <Icon name="close-circle" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            <Text style={styles.imageCountText}>
              {selectedImages.length} / {element.config?.maxImages || 10} images selected
            </Text>
          </View>
        );

      case 'video_picker':
        // Video picker from library
        const handleVideoPick = () => {
          launchImageLibrary(
            {
              mediaType: 'video',
              videoQuality: 'high',
            },
            (response) => {
              if (response.didCancel) return;
              if (response.errorCode) {
                Alert.alert('Error', response.errorMessage || 'Failed to select video');
                return;
              }
              if (response.assets && response.assets[0]?.uri) {
                updateValue({
                  uri: response.assets[0].uri,
                  duration: response.assets[0].duration,
                  type: response.assets[0].type,
                  fileName: response.assets[0].fileName,
                });
              }
            }
          );
        };

        const pickedVideo = typeof value === 'object' ? value : null;

        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {displayLabel}
              {Boolean(element.is_required) && <Text style={styles.required}> *</Text>}
            </Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleVideoPick}
            >
              <Icon name="video-outline" size={24} color="#007AFF" />
              <Text style={styles.uploadButtonText}>
                {element.config?.uploadText || 'Select Video'}
              </Text>
            </TouchableOpacity>
            {pickedVideo && (
              <View style={styles.videoPreviewContainer}>
                <View style={styles.videoThumbnail}>
                  <Icon name="play-circle" size={48} color="#FFFFFF" />
                </View>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoFileName} numberOfLines={1}>
                    {pickedVideo.fileName || 'Video'}
                  </Text>
                  {pickedVideo.duration && (
                    <Text style={styles.videoDuration}>
                      {Math.floor(pickedVideo.duration / 60)}:{String(Math.floor(pickedVideo.duration % 60)).padStart(2, '0')}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => updateValue(null)}>
                  <Icon name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'media_gallery':
        // Media gallery for multiple images and videos
        const MediaGalleryElement = require('../components/elements/MediaGalleryElement').default;
        return (
          <MediaGalleryElement
            key={element.id}
            element={element}
            value={Array.isArray(value) ? value : []}
            onChange={updateValue}
            disabled={false}
          />
        );

      case 'icon':
        // Display icon from icon library
        const iconConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const iconName = iconConfig?.name || value || 'help-circle';
        const iconSize = iconConfig?.size || 24;
        const iconColor = iconConfig?.color || '#000000';
        
        return (
          <View style={[styles.iconContainer, { alignItems: iconConfig?.align || 'flex-start' }]}>
            <Icon name={iconName} size={iconSize} color={iconColor} />
          </View>
        );

      case 'spacer':
        // Empty space with configurable height
        const spacerConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const spacerHeight = spacerConfig?.height || 16;
        
        return <View style={{ height: spacerHeight }} />;

      case 'avatar':
        // User avatar/profile picture
        const avatarConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const avatarSize = avatarConfig?.size || 64;
        const avatarUrl = value || avatarConfig?.defaultImage;
        const avatarInitials = avatarConfig?.initials || '';
        
        return (
          <View style={styles.avatarContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}>
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
                  resizeMode="cover"
                />
              ) : (
                <Text style={[styles.avatarInitials, { fontSize: avatarSize / 2.5 }]}>
                  {avatarInitials || '?'}
                </Text>
              )}
            </View>
          </View>
        );

      case 'badge':
        // Small status or count badge
        const badgeConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const badgeText = value || badgeConfig?.text || '';
        const badgeColor = badgeConfig?.color || '#007AFF';
        const badgeTextColor = badgeConfig?.textColor || '#FFFFFF';
        
        return (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>{badgeText}</Text>
          </View>
        );

      case 'chip':
        // Compact element for tags or filters
        const chipConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const chipText = value || displayLabel;
        const chipSelected = chipConfig?.selected || false;
        const chipIcon = chipConfig?.icon;
        
        return (
          <TouchableOpacity
            style={[
              styles.chip,
              chipSelected && styles.chipSelected
            ]}
            onPress={() => {
              if (chipConfig?.onPress) {
                updateValue(!chipSelected);
              }
            }}
          >
            {chipIcon && <Icon name={chipIcon} size={16} color={chipSelected ? '#FFFFFF' : '#666'} />}
            <Text style={[styles.chipText, chipSelected && styles.chipTextSelected]}>
              {chipText}
            </Text>
          </TouchableOpacity>
        );

      case 'progress_bar':
        // Progress indicator
        const progressConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const progressValue = typeof value === 'number' ? value : (parseFloat(value) || 0);
        const progressMax = progressConfig?.max || 100;
        const progressColor = progressConfig?.color || '#007AFF';
        const progressPercent = Math.min(100, (progressValue / progressMax) * 100);
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarTrack}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${progressPercent}%`, backgroundColor: progressColor }
                  ]} 
                />
              </View>
              <Text style={styles.progressBarText}>
                {progressConfig?.showPercent !== false ? `${Math.round(progressPercent)}%` : `${progressValue}/${progressMax}`}
              </Text>
            </View>
          </View>
        );

      case 'empty_state':
        // Empty state placeholder
        const emptyConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const emptyIcon = emptyConfig?.icon || 'inbox-outline';
        const emptyTitle = emptyConfig?.title || displayLabel || 'No items';
        const emptyMessage = emptyConfig?.message || value || 'There are no items to display.';
        const emptyButtonText = emptyConfig?.buttonText;
        
        return (
          <View style={styles.emptyStateContainer}>
            <Icon name={emptyIcon} size={64} color="#D1D1D6" />
            <Text style={styles.emptyStateTitle}>{emptyTitle}</Text>
            <Text style={styles.emptyStateMessage}>{emptyMessage}</Text>
            {emptyButtonText && (
              <TouchableOpacity style={styles.emptyStateButton}>
                <Text style={styles.emptyStateButtonText}>{emptyButtonText}</Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case 'skeleton_loader':
      case 'skeleton':
        // Loading placeholder skeleton
        const skeletonConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const skeletonType = skeletonConfig?.type || 'text';
        const skeletonLines = skeletonConfig?.lines || 3;
        
        return (
          <View style={styles.skeletonContainer}>
            {skeletonType === 'avatar' && (
              <View style={styles.skeletonAvatar} />
            )}
            {skeletonType === 'image' && (
              <View style={styles.skeletonImage} />
            )}
            {(skeletonType === 'text' || skeletonType === 'card') && (
              <>
                {[...Array(skeletonLines)].map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.skeletonLine,
                      index === skeletonLines - 1 && { width: '60%' }
                    ]} 
                  />
                ))}
              </>
            )}
          </View>
        );

      case 'alert_banner':
      case 'alert':
        // Alert or notification banner
        const alertConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const alertType = alertConfig?.type || 'info'; // info, success, warning, error
        const alertTitle = alertConfig?.title || displayLabel;
        const alertMessage = value || alertConfig?.message || '';
        const alertDismissible = alertConfig?.dismissible !== false;
        
        const alertColors: Record<string, { bg: string; border: string; icon: string; text: string }> = {
          info: { bg: '#E3F2FD', border: '#2196F3', icon: 'information', text: '#1565C0' },
          success: { bg: '#E8F5E9', border: '#4CAF50', icon: 'check-circle', text: '#2E7D32' },
          warning: { bg: '#FFF3E0', border: '#FF9800', icon: 'alert', text: '#E65100' },
          error: { bg: '#FFEBEE', border: '#F44336', icon: 'alert-circle', text: '#C62828' },
        };
        const alertStyle = alertColors[alertType] || alertColors.info;
        
        return (
          <View style={[styles.alertBanner, { backgroundColor: alertStyle.bg, borderLeftColor: alertStyle.border }]}>
            <Icon name={alertStyle.icon} size={24} color={alertStyle.text} />
            <View style={styles.alertContent}>
              {alertTitle && <Text style={[styles.alertTitle, { color: alertStyle.text }]}>{alertTitle}</Text>}
              {alertMessage && <Text style={[styles.alertMessage, { color: alertStyle.text }]}>{alertMessage}</Text>}
            </View>
            {alertDismissible && (
              <TouchableOpacity onPress={() => updateValue(null)}>
                <Icon name="close" size={20} color={alertStyle.text} />
              </TouchableOpacity>
            )}
          </View>
        );

      case 'timer_countdown':
      case 'countdown':
        // Timer/Countdown display
        const timerConfig = typeof element.config === 'string' 
          ? JSON.parse(element.config) 
          : element.config;
        const targetTime = value ? new Date(value) : null;
        const now = new Date();
        let timeRemaining = targetTime ? Math.max(0, targetTime.getTime() - now.getTime()) : 0;
        
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        return (
          <View style={styles.fieldContainer}>
            {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
            <View style={styles.countdownContainer}>
              {days > 0 && (
                <View style={styles.countdownUnit}>
                  <Text style={styles.countdownValue}>{days}</Text>
                  <Text style={styles.countdownLabel}>Days</Text>
                </View>
              )}
              <View style={styles.countdownUnit}>
                <Text style={styles.countdownValue}>{String(hours).padStart(2, '0')}</Text>
                <Text style={styles.countdownLabel}>Hours</Text>
              </View>
              <View style={styles.countdownUnit}>
                <Text style={styles.countdownValue}>{String(minutes).padStart(2, '0')}</Text>
                <Text style={styles.countdownLabel}>Min</Text>
              </View>
              <View style={styles.countdownUnit}>
                <Text style={styles.countdownValue}>{String(seconds).padStart(2, '0')}</Text>
                <Text style={styles.countdownLabel}>Sec</Text>
              </View>
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
            route={route}
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

      case 'notification_list':
        return (
          <NotificationListElement
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
  const canShowBackButton = !isHomeScreen && !isAtRoot && navigation.canGoBack();
  
  // Build header config:
  // - showLeftIcon from config controls whether to show the BACK button
  // - Menu icon should always show if there's a left sidebar menu assigned
  const configShowBackButton = headerBarModule?.config?.showLeftIcon ?? false;
  const showBackButton = canShowBackButton && configShowBackButton;
  const hasLeftMenu = !!leftSidebarMenu;
  
  // Show left icon if: we have a menu OR we should show back button
  const shouldShowLeftIcon = hasLeftMenu || showBackButton;
  
  const headerConfig = headerBarModule?.config ? {
    ...headerBarModule.config,
    leftIconType: showBackButton ? 'back' : 'menu',
    showLeftIcon: shouldShowLeftIcon,
  } : { leftIconType: canShowBackButton ? 'back' : 'menu', showLeftIcon: hasLeftMenu };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Header Bar Module */}
        {headerBarModule && (
          <HeaderBar
            title={screenName}
            config={headerConfig}
            leftMenu={leftSidebarMenu}
            rightMenu={rightSidebarMenu}
            onLeftIconPress={() => setLeftSidebarVisible(true)}
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
            const fullScreenElements = ['property_list', 'booking_list', 'favorites_list', 'user_profile', 'chat_interface', 'conversation_list', 'notification_list'];
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
  // Radio Button styles
  radioGroup: {
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D1D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioOuterSelected: {
    borderColor: '#007AFF',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#000000',
  },
  // Checkbox styles
  checkboxGroup: {
    marginTop: 8,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkboxOuter: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D1D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxOuterSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000000',
  },
  // Multi-select styles
  multiSelectContainer: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  multiSelectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  multiSelectOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  multiSelectOptionText: {
    fontSize: 14,
    color: '#000000',
    marginRight: 6,
  },
  multiSelectOptionTextSelected: {
    color: '#FFFFFF',
  },
  // Slider styles
  sliderContainer: {
    marginTop: 8,
  },
  sliderValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    position: 'relative',
  },
  sliderFill: {
    height: 6,
    backgroundColor: '#007AFF',
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#007AFF',
    position: 'absolute',
    top: -9,
    marginLeft: -12,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderMinMax: {
    fontSize: 12,
    color: '#8E8E93',
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 24,
  },
  sliderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Stepper styles
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperButtonDisabled: {
    opacity: 0.5,
  },
  stepperValueContainer: {
    minWidth: 80,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  stepperValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  // Rating styles
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 12,
  },
  // File upload styles
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  fileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  fileSize: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  // Camera capture styles
  cameraButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  // Video styles
  videoPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  videoThumbnail: {
    width: 80,
    height: 60,
    backgroundColor: '#000000',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  videoFileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  videoDuration: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  removeVideoButton: {
    padding: 8,
  },
  // Video player styles
  videoPlayerContainer: {
    backgroundColor: '#000000',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  videoPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 8,
  },
  videoPlayButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    alignItems: 'center',
  },
  videoPlayButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Audio player styles
  audioPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  audioPlayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioProgress: {
    flex: 1,
    marginHorizontal: 12,
  },
  audioProgressBar: {
    height: 4,
    backgroundColor: '#D1D1D6',
    borderRadius: 2,
  },
  audioProgressFill: {
    height: 4,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  audioTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  audioNote: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  // Audio recorder styles
  audioRecorderContainer: {
    marginTop: 8,
  },
  recordButton: {
    backgroundColor: '#FF3B30',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  recordedAudioContainer: {
    marginTop: 8,
  },
  deleteRecordingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 8,
  },
  deleteRecordingText: {
    color: '#FF3B30',
    fontSize: 14,
    marginLeft: 4,
  },
  // Image picker grid styles
  imageGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  imageGridItem: {
    width: '31%',
    aspectRatio: 1,
    position: 'relative',
  },
  imageGridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imageGridRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  imageCountText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },
  // Icon styles
  iconContainer: {
    padding: 8,
  },
  // Avatar styles
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarInitials: {
    fontWeight: 'bold',
    color: '#8E8E93',
  },
  // Badge styles
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Chip styles
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 4,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  // Progress bar styles
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  progressBarText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 4,
  },
  // Empty state styles
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Skeleton loader styles
  skeletonContainer: {
    padding: 16,
  },
  skeletonAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E5EA',
  },
  skeletonImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
  },
  skeletonLine: {
    height: 16,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },
  // Alert banner styles
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  // Countdown styles
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  countdownUnit: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  countdownValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  countdownLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  // Currency input styles
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 4,
  },
  currencyInput: {
    flex: 1,
    fontSize: 18,
    padding: 12,
    color: '#000000',
  },
  currencyCode: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
  },
  // Address input styles
  addressContainer: {
    marginTop: 8,
  },
  addressInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
  },
  // OTP input styles
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#D1D1D6',
  },
  otpDigit: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  otpHiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: 56,
  },
  // Tags input styles
  tagsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  tagTextInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
  },
  addTagButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 4,
  },
  // Autocomplete styles
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  suggestionText: {
    fontSize: 16,
    color: '#000000',
  },
  // Search bar styles
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    color: '#000000',
  },
  // Country selector styles
  countrySelector: {
    marginTop: 8,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  countryOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryName: {
    fontSize: 16,
    color: '#000000',
  },
  countryNameSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  // Language selector styles
  languageSelector: {
    marginTop: 8,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  languageName: {
    fontSize: 16,
    color: '#000000',
  },
  languageNameSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  languageNative: {
    fontSize: 14,
    color: '#8E8E93',
  },
  // Color picker styles
  colorPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#000000',
  },
  selectedColorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  colorPreviewBox: {
    width: 32,
    height: 32,
    borderRadius: 4,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  colorPreviewText: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'monospace',
  },
  // Accordion styles
  accordionContainer: {
    marginTop: 8,
  },
  accordionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  accordionContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  accordionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  // Carousel styles
  carouselContainer: {
    marginTop: 8,
  },
  carouselImageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F2F2F7',
  },
  carouselImage: {
    width: '100%',
    height: 200,
  },
  carouselPlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  carouselCaption: {
    padding: 12,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  carouselEmptyText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
  },
  carouselControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  carouselButton: {
    padding: 8,
  },
  carouselButtonDisabled: {
    opacity: 0.5,
  },
  carouselDots: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D1D6',
    marginHorizontal: 4,
  },
  carouselDotActive: {
    backgroundColor: '#007AFF',
  },
  // Modal styles
  modalTriggerButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTriggerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  modalContent: {
    padding: 16,
    minHeight: 100,
  },
  modalText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    gap: 12,
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666666',
  },
  modalConfirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  modalConfirmText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Bottom sheet styles
  bottomSheetTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 14,
    borderRadius: 8,
  },
  bottomSheetTriggerText: {
    fontSize: 16,
    color: '#007AFF',
  },
  bottomSheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  bottomSheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D1D6',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    padding: 16,
  },
  bottomSheetContent: {
    paddingHorizontal: 16,
  },
  bottomSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  bottomSheetOptionText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
  },
  bottomSheetCloseButton: {
    margin: 16,
    padding: 14,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    alignItems: 'center',
  },
  bottomSheetCloseText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
  // Action sheet styles
  actionSheetTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 14,
    borderRadius: 8,
  },
  actionSheetTriggerText: {
    fontSize: 16,
    color: '#000000',
  },
  // Toast styles
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: 8,
  },
  // Snackbar styles
  snackbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#323232',
    padding: 14,
    borderRadius: 4,
    marginBottom: 12,
  },
  snackbarText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
  },
  snackbarAction: {
    fontSize: 14,
    color: '#BB86FC',
    fontWeight: '600',
    marginRight: 12,
  },
  // Map styles
  mapContainer: {
    marginTop: 8,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#E8F4E8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 8,
  },
  mapCoordinates: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  mapNote: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  // Location picker styles
  locationPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  locationPickerText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 12,
    flex: 1,
  },
  locationPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 8,
  },
  locationAddress: {
    fontSize: 14,
    color: '#000000',
  },
  locationCoords: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  // Scanner styles
  scannerButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  scannerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  scannedResult: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  scannedValue: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
    fontFamily: 'monospace',
  },
  // Signature styles
  signaturePadContainer: {
    marginTop: 8,
  },
  signaturePreview: {
    alignItems: 'center',
  },
  signatureImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  clearSignatureButton: {
    marginTop: 12,
    padding: 10,
  },
  clearSignatureText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  signaturePlaceholder: {
    height: 150,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signaturePlaceholderText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 8,
  },
  signatureNote: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
  signatureDemoButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 12,
  },
  signatureDemoText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  // Chart styles
  chartContainer: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  barChartItem: {
    alignItems: 'center',
    flex: 1,
  },
  barChartBarContainer: {
    height: 120,
    width: 30,
    justifyContent: 'flex-end',
  },
  barChartBar: {
    width: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  barChartLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
  },
  lineChartPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieChartPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 8,
  },
  chartNote: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
  },
  // QR Code styles
  qrCodeContainer: {
    alignItems: 'center',
    marginTop: 8,
    padding: 16,
  },
  qrCodePlaceholder: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
  },
  qrCodeValue: {
    fontSize: 12,
    color: '#666666',
    marginTop: 12,
    textAlign: 'center',
  },
  qrCodeNote: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
    fontStyle: 'italic',
  },
  // Calendar styles
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarMonthYear: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  calendarDayNames: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calendarDayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  calendarDaySelected: {
    backgroundColor: '#007AFF',
  },
  calendarDayText: {
    fontSize: 16,
    color: '#000000',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Pull to refresh styles
  pullToRefreshContainer: {
    alignItems: 'center',
    padding: 16,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  refreshText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  lastRefreshed: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
  },
  refreshNote: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  // Infinite scroll styles
  infiniteScrollContainer: {
    alignItems: 'center',
    padding: 16,
  },
  pageIndicator: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  loadMoreButtonDisabled: {
    opacity: 0.6,
  },
  loadMoreText: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 4,
  },
  // Swipe actions styles
  swipeableContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  swipeableContent: {
    flex: 1,
    padding: 16,
  },
  swipeableText: {
    fontSize: 16,
    color: '#000000',
  },
  swipeableHint: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  swipeActions: {
    flexDirection: 'row',
  },
  swipeAction: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  swipeNote: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
    fontStyle: 'italic',
  },
  // Table styles
  tableContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tableRowAlt: {
    backgroundColor: '#F9F9F9',
  },
  tableCell: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: '#333333',
  },
  // Data grid styles
  dataGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  dataGridItem: {
    aspectRatio: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  dataGridItemTitle: {
    fontSize: 12,
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
  },
  // Timeline styles
  timelineContainer: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 80,
  },
  timelineLeft: {
    width: 40,
    alignItems: 'center',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1D1D6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotCompleted: {
    backgroundColor: '#34C759',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#D1D1D6',
    marginVertical: 4,
  },
  timelineLineCompleted: {
    backgroundColor: '#34C759',
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  timelineTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  // Pagination styles
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  paginationButton: {
    padding: 8,
  },
  paginationButtonDisabled: {
    opacity: 0.4,
  },
  paginationPage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  paginationPageActive: {
    backgroundColor: '#007AFF',
  },
  paginationPageText: {
    fontSize: 14,
    color: '#007AFF',
  },
  paginationPageTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  paginationInfo: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },
  // Payment card styles
  paymentCardContainer: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  paymentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentCardType: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 12,
    fontWeight: '600',
  },
  paymentCardNumber: {
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 20,
  },
  paymentCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentCardLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginBottom: 4,
  },
  paymentCardValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  // Transaction styles
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  transactionDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  transactionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  transactionStatusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Fee breakdown styles
  feeBreakdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  feeLabel: {
    fontSize: 14,
    color: '#666666',
  },
  feeAmount: {
    fontSize: 14,
    color: '#000000',
  },
  feeTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 2,
    borderTopColor: '#E5E5EA',
  },
  feeTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  feeTotalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  // Earnings styles
  earningsContainer: {
    marginTop: 8,
  },
  earningsMainCard: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  earningsLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  earningsTotal: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  earningsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  earningsCard: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
  },
  earningsCardLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  earningsCardValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 4,
  },
  earningsComparison: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  earningsCompareLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
  },
  earningsCompareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  earningsCompareValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  earningsChange: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  earningsChangeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Quote builder styles
  quoteBuilderContainer: {
    marginTop: 8,
  },
  quoteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  quoteItemDescription: {
    flex: 2,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  quoteItemQty: {
    width: 60,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  quoteItemPrice: {
    width: 80,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    textAlign: 'right',
  },
  addQuoteItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginTop: 8,
  },
  addQuoteItemText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
  },
  quoteTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E5E5EA',
  },
  quoteTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  quoteTotalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  // Currency selector styles
  currencySelectorContainer: {
    marginTop: 8,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currencyOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  currencySymbolLarge: {
    fontSize: 24,
    fontWeight: '600',
    width: 40,
    textAlign: 'center',
    color: '#007AFF',
  },
  currencyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  currencyCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  currencyCodeTextSelected: {
    color: '#007AFF',
  },
  currencyNameText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  // Amount input styles
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  amountSymbol: {
    fontSize: 32,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
  },
  amountCurrencyBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  amountCurrencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  amountConversion: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DynamicScreen;
