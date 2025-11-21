import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

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
import { screensService, menusService } from '../api/screensService';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Bar Navigator with dynamic screens from menus
const TabNavigator = () => {
  const [tabScreens, setTabScreens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTabBarScreens();
  }, []);

  const loadTabBarScreens = async () => {
    try {
      // Get menus for the app
      const menus = await menusService.getAppMenus();
      
      // Find the tab bar menu
      const tabBarMenu = menus.find((menu: any) => menu.menu_type === 'tabbar');
      
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

  if (tabScreens.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyTitle}>No tab bar configured</Text>
        <Text style={styles.emptySubtitle}>
          Please configure a tab bar menu in the admin portal.
        </Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      {tabScreens.map((item: any, index: number) => (
        <Tab.Screen
          key={item.screen_id || index}
          name={`Tab_${item.screen_id}`}
          options={{
            tabBarLabel: item.label || item.screen_name,
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

  if (loading) {
    return null; // Show splash screen or loading indicator
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
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
              component={TabNavigator}
              options={{ headerShown: false }}
            />
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
              component={LoginScreen}
              options={{ headerShown: false }}
            />
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
