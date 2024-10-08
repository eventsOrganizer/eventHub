import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from '../screens/OnBoarding';
import Interests from '../screens/Interests';
import Home from '../screens/HomeScreen'; // Ensure you have this component

const Stack = createStackNavigator();

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
        initialParams={{ onComplete: handleOnComplete }} // Pass the handler as a param
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
