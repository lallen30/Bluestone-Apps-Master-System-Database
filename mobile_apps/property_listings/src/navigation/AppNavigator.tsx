import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import ListingDetailScreen from '../screens/ListingDetailScreen';
import DynamicScreen from '../screens/DynamicScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import { useAuth } from '../context/AuthContext';
import { screensService, AppScreen } from '../api/screensService';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for authenticated users (fully dynamic)
const TabNavigator = () => {
  const [tabScreens, setTabScreens] = useState<AppScreen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTabScreens();
  }, []);

  const loadTabScreens = async () => {
    try {
      const screens = await screensService.getTabbarScreens();
      setTabScreens(screens);
    } catch (error) {
      console.error('Error loading tab screens:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!tabScreens.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyTitle}>No tabs configured</Text>
        <Text style={styles.emptySubtitle}>
          Please publish at least one screen and enable "Show in tab bar" in the admin portal.
        </Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      }}
    >
      {tabScreens.map((screen) => (
        <Tab.Screen
          key={screen.id}
          name={`Screen_${screen.id}`}
          component={DynamicScreen}
          initialParams={{
            screenId: screen.id,
            screenName: screen.name,
          }}
          options={{
            tabBarLabel: screen.tabbar_label || screen.name,
            tabBarIcon: ({ color, size }) => (
              <Icon
                name={screen.tabbar_icon || 'article'}
                color={color}
                size={size}
              />
            ),
          }}
        />
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
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ListingDetail"
              component={ListingDetailScreen}
              options={{ title: 'Property Details' }}
            />
            <Stack.Screen
              name="DynamicScreen"
              component={DynamicScreen}
              options={{ title: 'Screen' }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Profile' }}
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
