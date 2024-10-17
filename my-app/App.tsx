import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './app/redux/store/store';
import AppNavigator from './app/navigation/AppNavigation';
import { UserProvider } from './app/UserContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
// import Background from './app/components/Background' DONT DELETE THIS  !!!!!!!!!!! ;

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      {/* <Background /> DONT DELETE THIS  !!!!!!!!!!! */}
      <UserProvider>
        <Provider store={store}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </Provider>
      </UserProvider>
    </SafeAreaProvider>
  );
}