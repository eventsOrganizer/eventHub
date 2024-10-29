import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './app/redux/store/store';
import AppNavigator from './app/navigation/AppNavigation';
import { UserProvider } from './app/UserContext';
import { BasketProvider } from './app/components/basket/BasketContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
// import Background from './app/components/Background' DONT DELETE THIS  !!!!!!!!!!! ;
import { StripeProvider } from '@stripe/stripe-react-native';

const App = () => {
  return (
    <BasketProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        {/* <Background /> DONT DELETE THIS  !!!!!!!!!!! */}
      <StripeProvider
      publishableKey="pk_test_51QClepFlPYG1ImxpWSMG9xSRk1nx5GSs0ICY7GLfHDYRVpP8ALGVhJmkcehDZH4A67JOhek41fcQdFmXcjsJhEdo00y4GqAitW" // Replace with your actual Stripe publishable key
    >
        <UserProvider>
          <Provider store={store}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </Provider>
        </UserProvider>
      </StripeProvider>
      </SafeAreaProvider>
    </BasketProvider>
  );
};

export default App;
