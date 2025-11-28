import React, { useEffect, useState, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import ListingDetailScreen from '../screens/ListingDetailScreen';
import DynamicScreen from '../screens/DynamicScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import BookingScreen from '../screens/BookingScreen';
import BookingDetailScreen from '../screens/BookingDetailScreen';
import ChatScreen from '../screens/ChatScreen';

import { useAuth } from '../context/AuthContext';
import { screensService, menusService, appService } from '../api/screensService';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Bar Navigator with dynamic screens from menus
const TabNavigator = ({ route }: any) => {
  const [tabScreens, setTabScreens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const initialTabScreenId = route?.params?.initialTabScreenId;
  const tabBarMenuId = route?.params?.tabBarMenuId;

  useEffect(() => {
    loadTabBarScreens();
  }, []);

  const loadTabBarScreens = async () => {
    try {
      // Get menus for the app
      const menus = await menusService.getAppMenus();
      
      // Find the tab bar menu - prefer specific menu ID if provided
      let tabBarMenu;
      if (tabBarMenuId) {
        tabBarMenu = menus.find((menu: any) => menu.id === tabBarMenuId && menu.menu_type === 'tabbar');
      }
      if (!tabBarMenu) {
        // Fallback to first tabbar menu
        tabBarMenu = menus.find((menu: any) => menu.menu_type === 'tabbar');
      }
      
      if (tabBarMenu && tabBarMenu.items && tabBarMenu.items.length > 0) {
        setTabScreens(tabBarMenu.items);
      } else {
        // Fallback: use old tabbar_order system
        const screens = await screensService.getTabbarScreens();
        setTabScreens(screens.map((screen: any) => ({
          screen_id: screen.id,
          label: screen.tabbar_label || screen.name,
          icon: screen.tabbar_icon || 'circle',
          screen_name: screen.name,
        })));
      }
    } catch (error) {
      console.error('Error loading tab bar screens:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Filter out sidebar items - they can't be tabs in React Navigation
  // Sidebar items are handled by the custom tab bar in DynamicScreen
  const screenItems = tabScreens.filter((item: any) => item.item_type !== 'sidebar');

  if (screenItems.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyTitle}>No tab bar configured</Text>
        <Text style={styles.emptySubtitle}>
          Please configure a tab bar menu in the admin portal.
        </Text>
      </View>
    );
  }

  // Determine initial tab route name
  const getInitialRouteName = () => {
    if (initialTabScreenId) {
      const matchingTab = screenItems.find((item: any) => item.screen_id === initialTabScreenId);
      if (matchingTab) {
        return `Tab_${matchingTab.screen_id}`;
      }
    }
    // Default to first tab
    return screenItems.length > 0 ? `Tab_${screenItems[0].screen_id}` : undefined;
  };

  return (
    <Tab.Navigator
      initialRouteName={getInitialRouteName()}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      {screenItems.map((item: any, index: number) => (
        <Tab.Screen
          key={item.screen_id || index}
          name={`Tab_${item.screen_id}`}
          options={{
            tabBarLabel: item.label === '__NO_LABEL__' ? '' : (item.label || item.screen_name),
            tabBarShowLabel: item.label !== '__NO_LABEL__',
            tabBarIcon: ({ color, size }) => (
              <Icon name={item.icon || 'circle'} size={size} color={color} />
            ),
          }}
        >
          {(props) => (
            <DynamicScreen
              {...props}
              route={{
                ...props.route,
                params: {
                  screenId: item.screen_id,
                  screenName: item.screen_name || item.label,
                  hideTabBar: true, // Already inside TabNavigator, don't show custom tab bar
                },
              }}
            />
          )}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const [initialRoute, setInitialRoute] = useState<{ name: string; params?: any } | null>(null);
  const [checkingRedirect, setCheckingRedirect] = useState(false);
  const [homeScreenId, setHomeScreenId] = useState<number | null>(null);
  const [homeScreenName, setHomeScreenName] = useState<string>('Home');
  const [homeScreenLoaded, setHomeScreenLoaded] = useState(false);
  const wasAuthenticated = useRef(false);

  // Fetch the app's default home screen setting
  useEffect(() => {
    const fetchHomeScreen = async () => {
      try {
        console.log('[AppNavigator] Fetching home screen...');
        const homeData = await appService.getHomeScreen();
        console.log('[AppNavigator] Home screen from API:', homeData);
        setHomeScreenId(homeData.id);
        setHomeScreenName(homeData.name || 'Home');
      } catch (error) {
        console.error('[AppNavigator] Error fetching home screen:', error);
      } finally {
        setHomeScreenLoaded(true);
      }
    };
    fetchHomeScreen();
  }, []);

  // Check for login redirect when transitioning to authenticated state
  useEffect(() => {
    const checkLoginRedirect = async () => {
      // Only check when transitioning from not authenticated to authenticated
      if (isAuthenticated && !wasAuthenticated.current) {
        wasAuthenticated.current = true;
        setCheckingRedirect(true);
        
        try {
          const redirectData = await AsyncStorage.getItem('login_redirect_screen');
          if (redirectData) {
            const { screenId } = JSON.parse(redirectData);
            await AsyncStorage.removeItem('login_redirect_screen');
            
            if (screenId) {
              try {
                // Navigate directly to the screen - DynamicScreen handles its own tab bar
                const targetScreen = await screensService.getScreenContent(screenId);
                setInitialRoute({
                  name: 'DynamicScreen',
                  params: {
                    screenId: screenId,
                    screenName: targetScreen.screen.name || 'Screen'
                  }
                });
              } catch (error: any) {
                console.error('Error fetching redirect screen:', error);
                setInitialRoute({ name: 'Home' });
              }
            } else {
              setInitialRoute({ name: 'Home' });
            }
          } else {
            setInitialRoute({ name: 'Home' });
          }
        } catch (error: any) {
          console.error('Error checking login redirect:', error);
          setInitialRoute({ name: 'Home' });
        } finally {
          setCheckingRedirect(false);
        }
      } else if (!isAuthenticated) {
        // Reset when logged out
        wasAuthenticated.current = false;
        setInitialRoute(null);
      }
    };
    
    checkLoginRedirect();
  }, [isAuthenticated]);

  if (loading || !homeScreenLoaded || (isAuthenticated && checkingRedirect)) {
    return null; // Show splash screen or loading indicator
  }

  // Determine if we should use TabNavigator or DynamicScreen as home
  // If homeScreenId is set and it's NOT in a tabbar menu, use DynamicScreen directly
  const useCustomHomeScreen = homeScreenId !== null;
  console.log('[AppNavigator] useCustomHomeScreen:', useCustomHomeScreen, 'homeScreenId:', homeScreenId);

  // Build initial state for redirect navigation
  const getInitialState = () => {
    if (!isAuthenticated) return undefined;
    if (!initialRoute) return undefined;
    
    // For DynamicScreen redirect, set up with Home in back stack
    if (initialRoute.name === 'DynamicScreen' && initialRoute.params) {
      return {
        routes: [
          { name: 'Home' },
          { 
            name: 'DynamicScreen', 
            params: {
              screenId: initialRoute.params.screenId,
              screenName: initialRoute.params.screenName
            }
          }
        ],
        index: 1
      };
    }
    return undefined;
  };

  return (
    <NavigationContainer 
      ref={navigationRef}
      initialState={getInitialState()}
    >
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Home' : 'Login'}
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Home"
              options={{ headerShown: false }}
            >
              {(props) => 
                useCustomHomeScreen ? (
                  <DynamicScreen
                    {...props}
                    route={{
                      ...props.route,
                      params: {
                        screenId: homeScreenId,
                        screenName: homeScreenName,
                      },
                    }}
                  />
                ) : (
                  <TabNavigator {...props} />
                )
              }
            </Stack.Screen>
            <Stack.Screen
              name="DynamicScreen"
              component={DynamicScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ListingDetail"
              component={ListingDetailScreen}
              options={{ title: 'Property Details' }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Profile' }}
            />
            {/* Detail Screens - Not in Tab Bar */}
            <Stack.Screen
              name="Booking"
              component={BookingScreen}
              options={{ title: 'Book Property' }}
            />
            <Stack.Screen
              name="BookingDetail"
              component={BookingDetailScreen}
              options={{ title: 'Booking Details' }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ title: 'Chat' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              options={{ headerShown: false }}
            >
              {(props) => (
                <DynamicScreen
                  {...props}
                  route={{ ...props.route, params: { screenId: 18, screenName: 'Login' } }}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default AppNavigator;
