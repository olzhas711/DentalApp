import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { AppointmentProvider } from './src/context/AppointmentContext';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaView, StatusBar } from 'react-native';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import 'react-native-gesture-handler';
import { ChatProvider } from './src/context/ChatContext';

const App = () => {
  return (
    <ErrorBoundary>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <AuthProvider>
          <CartProvider>
            <AppointmentProvider>
              <ChatProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </ChatProvider>
            </AppointmentProvider>
          </CartProvider>
        </AuthProvider>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

export default App; 