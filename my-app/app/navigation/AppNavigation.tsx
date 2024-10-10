// src/navigation/AppNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import your screens
import Onboarding from '../screens/OnBoarding';
import Interests from '../screens/Interests';
import Home from '../screens/Home'; 
import MapScreen from '../screens/MapScreen'; 
import CalendarScreen from '../screens/CalendarScreen'; 
import ProfileScreen from '../screens/AccountScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EventCreationScreen from '../screens/EventCreationScreen'; // Event creation screen import
import EventDetailsScreen from '../screens/EventDetailsScreen'; // Event details screen import


// Define the types for your stack params
export type RootStackParamList = {
  Onboarding: undefined;
  Interests: { onComplete: () => void };
  Home: undefined;
  Map: undefined;
  Calendar: undefined;
  Profile: undefined;
  EditProfile: undefined;
  EventCreation: undefined; // Event creation screen
  EventDetails: { eventName: string, eventDescription: string, eventType: string }; // Event details screen params
};


const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const handleOnComplete = () => {
    console.log("Onboarding complete!");
  };

  return (
      <Stack.Navigator initialRouteName="Onboarding">
        {/* Other Screens */}
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
          options={{ headerShown: true }} 
        />
        <Stack.Screen 
          name="Calendar" 
          component={CalendarScreen} 
          options={{ headerShown: true }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ headerShown: true }} 
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen} 
          options={{ headerShown: true }} 
        />

        {/* Event Creation Screen */}
        <Stack.Screen 
          name="EventCreation" 
          component={EventCreationScreen} 
          options={{ title: 'Create Event' }} 
        />

        {/* Event Details Screen */}
        <Stack.Screen 
          name="EventDetails" 
          component={EventDetailsScreen} 
          options={{ title: 'Event Details' }} 
        />
      </Stack.Navigator>
  )
}

export default AppNavigator;
