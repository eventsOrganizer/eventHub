import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import your screens
import LandingPage from '../screens/LandingPage';  // Import the LandingPage screen
import EventCreationScreen from '../screens/EventCreationScreen'; // Event creation screen import
import Onboarding from '../screens/OnBoarding';
import Interests from '../screens/Interests';
import Home from '../screens/Home';
import MapScreen from '../screens/MapScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/AccountScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import CategorySelectionScreen from '../screens/CategorySelectionScreen';
import SubcategorySelectionScreen from '../screens/subcategorySelectionScreen';

// Define the types for your stack params
export type RootStackParamList = {
  LandingPage: undefined;
  Onboarding: undefined;
  Interests: { onComplete: () => void };
  Home: undefined;
  Map: undefined;
  Calendar: undefined;
  Profile: undefined;
  EditProfile: undefined;
  EventCreation: undefined;
  EventDetails: { eventName: string, eventDescription: string, eventType: string };
  CategorySelection: { eventName: string, eventDescription: string, eventType: string };
  SubcategorySelection: { eventName: string, eventDescription: string, eventType: string, selectedCategory: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="LandingPage">
      {/* Landing Page */}
      <Stack.Screen 
        name="LandingPage" 
        component={LandingPage} 
        options={{ headerShown: false }} 
      />
      
      {/* Event Creation Screen */}
      <Stack.Screen 
        name="EventCreation" 
        component={EventCreationScreen} 
        options={{ title: 'Create Event' }} 
      />
      
      {/* Other Screens */}
      <Stack.Screen 
        name="Onboarding" 
        component={Onboarding} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Interests" 
        component={Interests} 
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
      <Stack.Screen 
        name="EventDetails" 
        component={EventDetailsScreen} 
        options={{ title: 'Event Details' }} 
      />
      <Stack.Screen 
        name="CategorySelection" 
        component={CategorySelectionScreen} 
        options={{ title: 'Select Category' }} 
      />
      <Stack.Screen 
        name="SubcategorySelection" 
        component={SubcategorySelectionScreen} 
        options={{ title: 'Select Subcategory' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
