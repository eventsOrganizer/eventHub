import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from '../screens/OnBoarding';
import Interests from '../screens/Interests';
import Home from '../screens/Home'; // This should now use the tab navigator

// Define the parameter list for navigation
export type RootStackParamList = {
  Onboarding: undefined;
  Interests: { onComplete: () => void };
  Home: undefined; // Define other routes as needed
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const handleOnComplete = () => {
    console.log("Onboarding complete!");
  };

  return (
    <Stack.Navigator initialRouteName="Onboarding">
      <Stack.Screen 
        name="Onboarding" 
        component={Onboarding} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Interests" 
        component={Interests} 
        initialParams={{ onComplete: handleOnComplete }} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
