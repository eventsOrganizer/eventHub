import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Import screens
import Onboarding from '../screens/OnBoarding';
import Interests from '../screens/Interests';
import HomeScreen from '../screens/HomeScreen';
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
import CreateServiceScreen from '../screens/CreateServiceScreen';
import EventSetupOptionsScreen from '../screens/EvnetStupOptionScreen'
import ChatRoomScreen from '../components/event/ChatRoomScreen';
import OrganizerProfileScreen from '../components/event/OrganizerProfileScreen';
import ChatListScreen from '../components/event/ChatListScreen';
import RequestsScreen from '../components/event/profile/RequestsScreen';
import PersonalsScreen from '../screens/PersonalServiceScreen/PersonalsScreen';
import PersonalDetail from '../screens/PersonalServiceScreen/PersonalDetail';
import LocalServiceDetailScreen from '../components/LocalService/LocalServiceDetailScreen';
import LocalServiceScreen from '../components/LocalService/LocalServiceScreen';
import UserProfileScreen from '../components/event/profile/UserProfileScreen';
import FriendRequestsScreen from '../components/event/profile/FriendRequestsScreen';
import SavedScreen from '../components/event/profile/SavedScreen';
import CreateLocalServiceStep1 from '../components/LocalServiceCreation/CreateLocalServiceStep1';
import CreateLocalServiceStep2 from '../components/LocalServiceCreation/CreateLocalServiceStep2';
import CreateLocalServiceStep3 from '../components/LocalServiceCreation/CreateLocalServiceStep3';
import CreateLocalServiceStep4 from '../components/LocalServiceCreation/CreateLocalServiceStep4';
import CreateLocalServiceStep5 from '../components/LocalServiceCreation/CreateLocalServiceStep5';
import CreatePersonalServiceStep1 from '../components/PersonalServiceCreation/CreatePersonalServiceStep1';
import CreatePersonalServiceStep2 from '../components/PersonalServiceCreation/CreatePersonalServiceStep2';
import CreatePersonalServiceStep3 from '../components/PersonalServiceCreation/CreatePersonalServiceStep3';
import CreatePersonalServiceStep4 from '../components/PersonalServiceCreation/CreatePersonalServiceStep4';
import CreatePersonalServiceStep5 from '../components/PersonalServiceCreation/CreatePersonalServiceStep5';
import PaymentActionScreen from '../payment/PaymentActionScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';

import NotificationsScreen from '../screens/NotificationsScreen';
import TicketingScreen from '../screens/TicketingScreen';
import EventSummaryScreen from '../screens/EventSummaryScreen';
import ServiceDetailsScreen from '../screens/PersonalServiceScreen/PersonalDetail'
type RootStackParamList = {
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
  HomeScreen: undefined;
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
  CreateService: { serviceType: string };
  EventSetupOptions: { 
    eventName: string; 
    eventDescription: string; 
    eventType: string; 
    selectedCategory: string; 
    selectedSubcategory: string 
  };
  UserProfile: undefined;
  PaymentAction: { price: number; personalId: string };
  SearchResultsScreen: { initialSearchTerm: string };
  ServiceDetails: { serviceId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation: React.FC = () => {
  const handleOnComplete = () => {
    console.log('Onboarding complete!');
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
      component={HomeScreen} />

      
      <Stack.Screen 
      name="SearchResultsScreen" 
      component={SearchResultsScreen} />

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
        name="PersonalsScreen" 
        component={PersonalsScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen 
        name="PersonalDetail" 
        component={PersonalDetail}
        options={{ headerShown: true }}
      />
      <Stack.Screen 
        name="EventDetails" 
        component={EventDetailsScreen} 
        options={{ headerShown: true }} 
      />
      <Stack.Screen   
        name="OrganizerProfile" 
        component={OrganizerProfileScreen} 
        options={{ headerShown: true }} 
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{ headerShown: true }} 
      />
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ headerShown: true }} 
      />
      <Stack.Screen
        name="Requests"
        component={RequestsScreen}
        options={{ headerShown: true }} 
      />
      <Stack.Screen 
        name="CreateLocalServiceStep1" 
        component={CreateLocalServiceStep1} 
        options={{ headerShown: true, title: 'Create Local Service - Step 1' }} 
      />
      <Stack.Screen 
        name="CreateLocalServiceStep2" 
        component={CreateLocalServiceStep2} 
        options={{ headerShown: true, title: 'Create Local Service - Step 2' }} 
      />
      <Stack.Screen 
        name="CreateLocalServiceStep3" 
        component={CreateLocalServiceStep3} 
        options={{ headerShown: true, title: 'Create Local Service - Step 3' }} 
      />
      <Stack.Screen 
        name="CreateLocalServiceStep4" 
        component={CreateLocalServiceStep4} 
        options={{ headerShown: true, title: 'Create Local Service - Step 4' }} 
      />
      <Stack.Screen 
        name="CreateLocalServiceStep5" 
        component={CreateLocalServiceStep5} 
        options={{ headerShown: true, title: 'Create Local Service - Step 5' }} 
      />
      <Stack.Screen
        name="LocalServiceScreen"
        component={LocalServiceScreen}
        options={{ title: 'Local Services' }}
      />
      <Stack.Screen
        name="LocalServiceDetails"
        component={LocalServiceDetailScreen}
        options={{ title: 'Service Details' }}
      />
      <Stack.Screen 
        name="CreatePersonalServiceStep1" 
        component={CreatePersonalServiceStep1} 
        options={{ headerShown: true, title: 'Create Personal Service - Step 1' }} 
      />
      <Stack.Screen 
        name="CreatePersonalServiceStep2" 
        component={CreatePersonalServiceStep2} 
        options={{ headerShown: true, title: 'Create Personal Service - Step 2' }} 
      />
      <Stack.Screen 
        name="CreatePersonalServiceStep3" 
        component={CreatePersonalServiceStep3} 
        options={{ headerShown: true, title: 'Create Personal Service - Step 3' }} 
      />
      <Stack.Screen 
        name="CreatePersonalServiceStep4" 
        component={CreatePersonalServiceStep4} 
        options={{ headerShown: true, title: 'Create Personal Service - Step 4' }} 
      />
      <Stack.Screen 
        name="CreatePersonalServiceStep5" 
        component={CreatePersonalServiceStep5} 
        options={{ headerShown: true, title: 'Create Personal Service - Step 5' }} 
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen} 
        options={{ headerShown: true }} 
      />
      <Stack.Screen
        name="FriendRequests" 
        component={FriendRequestsScreen} 
        options={{ headerShown: true }} 
      />
      <Stack.Screen
        name="Saved" 
        component={SavedScreen} 
        options={{ headerShown: true }} 
      />
      <Stack.Screen
        name="PaymentAction"
        component={PaymentActionScreen}
        options={{ headerShown: true, title: 'Payment' }}
        initialParams={{ price: 200, personalId: '1' }}
      />
   <Stack.Screen name="EventCreation" component={EventCreationScreen} />
   <Stack.Screen name="CategorySelection" component={CategorySelectionScreen} />
<Stack.Screen
  name="SubcategorySelection"
  component={SubcategorySelectionScreen}
  options={{ headerShown: true, title: 'Subcategory Selection' }}
/>

<Stack.Screen
  name="EventSetupOptions"
  component={EventSetupOptionsScreen}
  options={{ headerShown: true, title: 'Event Setup Options' }}
/>
<Stack.Screen 
                name="EventTimeline" 
                component={EventTimelineScreen} 
            />
             <Stack.Screen 
                name="GuestManagement" 
                component={GuestManagementScreen} 
            />
             <Stack.Screen 
                name="TeamCollaboration" 
                component={TeamCollaborationScreen} 
            />
           <Stack.Screen 
                name="MusicAndEntertainment" 
                component={MusicAndEntertainmentScreen} 
            />
            <Stack.Screen 
                name="Notifications" 
                component={NotificationsScreen} 
            />
             <Stack.Screen 
                name="Ticketing" 
                component={TicketingScreen} 
            />
 <Stack.Screen 
                name="EventSummary" 
                component={EventSummaryScreen} 
            />
         <Stack.Screen
  name="ServiceDetails"
  component={ServiceDetailsScreen}
  options={{ headerShown: true, title: 'Service Details' }}
/>
    </Stack.Navigator>
  );
};

export default AppNavigation;