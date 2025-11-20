import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

// Screens
import ListingDetailScreen from '../screens/ListingDetailScreen';
import DynamicScreen from '../screens/DynamicScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import BookingScreen from '../screens/BookingScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import BookingDetailScreen from '../screens/BookingDetailScreen';
import ConversationsScreen from '../screens/ConversationsScreen';
import ChatScreen from '../screens/ChatScreen';

import { useAuth } from '../context/AuthContext';
import { screensService } from '../api/screensService';

const Stack = createNativeStackNavigator();

// Initial Screen Loader - finds first screen from first menu
const InitialScreenLoader = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialScreen();
  }, []);

  const loadInitialScreen = async () => {
    try {
      // Get all published screens
      const screens = await screensService.getAppScreens();
      
      if (screens.length > 0) {
        // Navigate to the first screen
        const firstScreen = screens[0];
        navigation.replace('DynamicScreen', {
          screenId: firstScreen.id,
          screenName: firstScreen.name,
        });
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading initial screen:', error);
      setLoading(false);
    }
  };

  if (!loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyTitle}>No screens available</Text>
        <Text style={styles.emptySubtitle}>
          Please publish at least one screen in the admin portal.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
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
              name="InitialLoader"
              component={InitialScreenLoader}
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
            {/* Booking Screens */}
            <Stack.Screen
              name="Booking"
              component={BookingScreen}
              options={{ title: 'Book Property' }}
            />
            <Stack.Screen
              name="MyBookings"
              component={MyBookingsScreen}
              options={{ title: 'My Bookings' }}
            />
            <Stack.Screen
              name="BookingDetail"
              component={BookingDetailScreen}
              options={{ title: 'Booking Details' }}
            />
            {/* Messaging Screens */}
            <Stack.Screen
              name="Conversations"
              component={ConversationsScreen}
              options={{ title: 'Messages' }}
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
