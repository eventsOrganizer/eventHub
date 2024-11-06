import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './app/redux/store/store';
import AppNavigator from './app/navigation/AppNavigation';
import { UserProvider } from './app/UserContext';
import { BasketProvider } from './app/components/basket/BasketContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import { HeartbeatProvider } from './app/components/HeartbeatProvider';
  
const App = () => {
  const stripePublishableKey = Constants.expoConfig?.extra?.STRIPE_PUBLISHABLE_KEY;

  if (!stripePublishableKey) {
    console.warn('Stripe publishable key is not configured in app.config.js');
  }

  return (
    <BasketProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <StripeProvider publishableKey={stripePublishableKey || ''}>
          <UserProvider>
            <HeartbeatProvider>
              <Provider store={store}>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </Provider>
            </HeartbeatProvider>
          </UserProvider>
        </StripeProvider>
      </SafeAreaProvider>
    </BasketProvider>
  );
};

export default App;