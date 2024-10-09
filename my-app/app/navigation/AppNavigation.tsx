import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from '../screens/OnBoarding';
import Interests from '../screens/Interests';
import Home from '../screens/Home'; 
import MapScreen from '../screens/MapScreen'; // Import MapScreen
import CalendarScreen from '../screens/CalendarScreen'; // Import CalendarScreen
import Signup from '../components/Auth/SignUp';
import Signin from '../components/Auth/SignIn';

export type RootStackParamList = {
  Onboarding: undefined;
  Interests: { onComplete: () => void };
  Home: undefined; 
  Map: undefined; // Add Map route
  Calendar: undefined; // Add Calendar route
  Signup: undefined;
  Signin: undefined;
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
      <Stack.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ headerShown: true }} // Adjust as needed
      />
      <Stack.Screen 
        name="Calendar" 
        component={CalendarScreen} 
        options={{ headerShown: true }} // Adjust as needed
      />
      <Stack.Screen 
        name="Signup" 
        component={Signup}  
        options={{ headerShown: true }} // Adjust as needed
      />
      <Stack.Screen 
        name="Signin" 
        component={Signin}  
        options={{ headerShown: true }} // Adjust as needed
      />

    </Stack.Navigator>
  );
};

export default AppNavigator;
