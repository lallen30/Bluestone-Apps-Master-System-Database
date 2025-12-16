/**
 * Property Listings App
 * React Native App for Property Rental Platform
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
// import { StripeProvider } from './src/context/StripeProvider'; // Commented out for testing
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          {/* StripeProvider commented out for testing */}
          {/* <StripeProvider> */}
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AppNavigator />
          {/* </StripeProvider> */}
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
