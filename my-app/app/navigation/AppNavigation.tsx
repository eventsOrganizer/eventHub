import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// Import screens
import Onboarding from '../screens/OnBoarding';
import Interests from '../screens/Interests';
import Home from '../screens/Home';
import MapScreen from '../screens/MapScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/AccountScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import Signup from '../components/Auth/SignUp';
import Signin from '../components/Auth/SignIn';
import LandingPage from '../screens/LandingPage';
import EventCreationScreen from '../screens/EventCreationScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import CategorySelectionScreen from '../screens/CategorySelectionScreen';
import SubcategorySelectionScreen from '../screens/subcategorySelectionScreen';
import VenueSelectionScreen from '../screens/VenueSelectionScreen';
import MusicAndEntertainmentScreen from '../screens/MusicAndEntertainmentScreen';
import EventTimelineScreen from '../screens/EventTimelineScreen';
import GuestManagementScreen from '../screens/GuestManagementScreen';
import TeamCollaborationScreen from '../screens/TeamCollaborationScreen';
import CreateServiceScreen from '../screens/CreateServiceScreen'; // Added CreateService import
import EventSetupOptionsScreen from '../screens/EvnetStupOptionScreen';



// Define RootStackParamList to type your navigationimport EventDetailsScreen from '../screens/EventDetailsScreen';
import OrganizerProfileScreen from '../components/event/OrganizerProfileScreen';
import ChatRoomScreen from '../components/event/ChatRoomScreen';
import ChatListScreen from '../components/event/ChatListScreen';
import RequestsScreen from '../components/event/RequestsScreen';
import PersonalsScreen from '../screens/PersonalServiceScreen/PersonalsScreen';
import PersonalDetail from '../screens/PersonalServiceScreen/PersonalDetail';
export type RootStackParamList = {
  Onboarding: undefined;
  Interests: { onComplete: () => void };
  Profile: undefined;
  Home: undefined;
  Map: undefined;
  Calendar: undefined;
  EditProfile: undefined;
  Signup: undefined;
  Signin: undefined;
  LandingPage: undefined;
 
  EventDetails: { eventName: string; eventDescription: string; eventType: string };
  CategorySelection: { eventName: string; eventDescription: string; eventType: string };
  SubcategorySelection: { eventName: string; eventDescription: string; eventType: string; selectedCategory: string };
  VenueSelection: { eventName: string; eventDescription: string; eventType: string; selectedCategory: string; selectedSubcategory: string };
  MusicAndEntertainment: { eventName: string; eventDescription: string; eventType: string; selectedCategory: string; selectedSubcategory: string; venue: string };
  EventTimeline: { eventName: string; eventDescription: string; eventType: string; selectedCategory: string; selectedSubcategory: string; venue: string; music: string };
  
  GuestManagement: { eventName: string; eventDescription: string; eventType: string; selectedCategory: string; selectedSubcategory: string; };
  TeamCollaboration: { eventName: string; eventDescription: string; eventType: string; selectedCategory: string; selectedSubcategory: string; };
  Notifications: { eventName: string; eventDescription: string; eventType: string; selectedCategory: string; selectedSubcategory: string; };
  Ticketing: { eventName: string; eventDescription: string; eventType: string; selectedCategory: string; selectedSubcategory: string; };
  EventSummary: { eventId: string };
  EventCreation: { eventType: string };
  
  // Add the CreateService screen and pass serviceType as a param
  CreateService: { serviceType: string };
  EventSetupOptions: { 
    eventName: string; 
    eventDescription: string; 
    eventType: string; 
    selectedCategory: string; 
    selectedSubcategory: string 
  };
};
type EventSetupOptionsScreenProps = {
  route: RouteProp<RootStackParamList, 'EventSetupOptions'>;
  navigation: NativeStackNavigationProp<RootStackParamList>;
  EventDetails: { eventId: number };
  OrganizerProfile: { organizerId: string };
  ChatRoom: { userId: string; organizerId: string };
  ChatList: undefined;
  Requests: undefined;
  PersonalsScreen: undefined;
  PersonalDetail: undefined;
};




const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  // Callback for Interests screen (as an example)
  const handleOnComplete = () => {
    console.log('Onboarding complete!');
  };

  return (
    <Stack.Navigator initialRouteName="Onboarding">
      {/* Onboarding Screen */}
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{ headerShown: false }}
      />
      
      {/* Interests Screen */}
      <Stack.Screen
        name="Interests"
        component={Interests}
        initialParams={{ onComplete: handleOnComplete }}
        options={{ headerShown: false }}
      />
      
      {/* Home Screen */}
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      
      {/* Map Screen */}
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      
      {/* Calendar Screen */}
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ headerShown: false }}
      />
      
      {/* Profile Screen */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      
      {/* Edit Profile Screen */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      
      {/* Signup Screen */}
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      
      {/* Signin Screen */}
      <Stack.Screen
        name="Signin"
        component={Signin}
        options={{ headerShown: false }}
      />
      
      {/* Landing Page Screen */}
      <Stack.Screen
        name="LandingPage"
        component={LandingPage}
        options={{ headerShown: false }}
      />
      
      {/* Event Creation Screens */}
      <Stack.Screen
        name="EventCreation"
        component={EventCreationScreen}
        options={{ title: 'Create Event' }}
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
      
      {/* Event Customization Screens */}
      <Stack.Screen
        name="VenueSelection"
        component={VenueSelectionScreen}
        options={{ title: 'Select Venue' }}
      />
      
      <Stack.Screen
        name="MusicAndEntertainment"
        component={MusicAndEntertainmentScreen}
        options={{ title: 'Entertainment & Music' }}
      />
      
      <Stack.Screen
        name="EventTimeline"
        component={EventTimelineScreen}
        options={{ title: 'Event Timeline' }}
      />
      
      {/* Event Details Screen */}
      {/* <Stack.Screen
        name="EventDetails"
        component={EventDetailsScreen}
        options={{ title: 'Event Details' }}
      /> */}
      
      {/* New Screens */}
      <Stack.Screen
        name="GuestManagement"
        component={GuestManagementScreen}
        options={{ title: 'Guest Management' }}
      />
      
      <Stack.Screen
        name="TeamCollaboration"
        component={TeamCollaborationScreen}
        options={{ title: 'Team Collaboration' }}
      />
      
      {/* CreateService Screen */}
      <Stack.Screen
        name="CreateService"
        component={CreateServiceScreen}
        options={{ title: 'Create Service' }}
      />
<Stack.Screen
  name="EventSetupOptions"
  component={EventSetupOptionsScreen}
  options={{ title: 'Event Setup Options' }}
/>
         <Stack.Screen 
         name="PersonalsScreen" 
         component={PersonalsScreen}
         options={{ headerShown: true }}
          />
        <Stack.Screen 
        name="PersonalDetail" 
        component={(props:any) => <PersonalDetail {...props} />} 
        options={{ headerShown: true }}
        />
      <Stack.Screen 
        name="EventDetails" 
        component={EventDetailsScreen as React.ComponentType<any>} 
        options={{ headerShown: true }} // Adjust as needed
      />  
      <Stack.Screen 
        name="OrganizerProfile" 
        component={OrganizerProfileScreen as React.ComponentType<any>} 
        options={{ headerShown: true }} // Adjust as needed
      />  
      <Stack.Screen
       name="ChatRoom"
        component={ChatRoomScreen as React.ComponentType<any>}
        options={{ headerShown: true }} // Adjust as needed
      />
      <Stack.Screen
        name ="ChatList"
        component={ChatListScreen as React.ComponentType<any>}
        options={{ headerShown: true }} // Adjust as needed
      />
      <Stack.Screen
        name="Requests"
        component={RequestsScreen as React.ComponentType<any>}
        options={{ headerShown: true }} // Adjust as needed
      />



    </Stack.Navigator>
  );
};

export default AppNavigator;
