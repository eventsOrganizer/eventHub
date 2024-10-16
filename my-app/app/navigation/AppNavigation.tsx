import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from '../screens/OnBoarding';
import Interests from '../screens/Interests';
import Home from '../screens/Home';
import MapScreen from '../screens/MapScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/AccountScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import Signup from '../components/Auth/SignUp';
import Signin from '../components/Auth/SignIn';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import OrganizerProfileScreen from '../components/event/OrganizerProfileScreen';
import ChatRoomScreen from '../components/event/ChatRoomScreen';
import ChatListScreen from '../components/event/ChatListScreen';
import RequestsScreen from '../components/event/profile/RequestsScreen';
import PersonalsScreen from '../screens/PersonalServiceScreen/PersonalsScreen';
import PersonalDetail from '../screens/PersonalServiceScreen/PersonalDetail';
import LocalServiceDetailScreen from '../components/LocalService/LocalServiceDetailScreen';
import LocalServiceScreen from '../components/LocalService/LocalServiceScreen';
import UserProfileScreen from '../components/event/profile/UserProfileScreen';

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
  EventDetails: { eventId: number };
  OrganizerProfile: { organizerId: string };
  ChatRoom: { userId: string; organizerId: string };
  ChatList: undefined;
  Requests: undefined;
  PersonalsScreen: undefined;
  PersonalDetail: undefined;
  CreateLocalServiceStep1: undefined;
  CreateLocalServiceStep2: { formData: any };
  CreateLocalServiceStep3: undefined;
  CreateLocalServiceStep4: { formData: any };
  CreateLocalServiceStep5: { formData: any };
  LocalServiceScreen: undefined;
  LocalServiceDetails: { localServiceId: number };
  UserProfile: undefined;
  CreatePersonalServiceStep1: undefined;
  CreatePersonalServiceStep2: { serviceName: string; description: string; subcategoryName: string; subcategoryId: number };
  CreatePersonalServiceStep3: { serviceName: string; description: string; images: string[]; subcategoryName: string; subcategoryId: number };
  CreatePersonalServiceStep4: { serviceName: string; description: string; images: string[]; price: string; availabilityFrom: string; availabilityTo: string; subcategoryName: string; subcategoryId: number };
  CreatePersonalServiceStep5: { serviceName: string; description: string; images: string[]; price: string; availabilityFrom: string; availabilityTo: string; skills: string[]; subcategoryName: string; subcategoryId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation: React.FC = () => {
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
          name="Signup" 
          component={Signup}  
          options={{ headerShown: true }} 
        />
        <Stack.Screen 
          name="Signin" 
          component={Signin}  
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
      </Stack.Navigator>
   
  );
};

export default AppNavigation;