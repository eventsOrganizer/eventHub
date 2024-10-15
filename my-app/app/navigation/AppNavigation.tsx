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
import RequestsScreen from '../components/event/RequestsScreen';
import PersonalsScreen from '../screens/PersonalServiceScreen/PersonalsScreen';
import PersonalDetail from '../screens/PersonalServiceScreen/PersonalDetail';
import CreateLocalServiceStep1 from '../components/LocalServiceCreation/CreateLocalServiceStep1';
import CreateLocalServiceStep2 from '../components/LocalServiceCreation/CreateLocalServiceStep2';
import CreateLocalServiceStep3 from '../components/LocalServiceCreation/CreateLocalServiceStep3';
import CreateLocalServiceStep4 from '../components/LocalServiceCreation/CreateLocalServiceStep4';
import CreateLocalServiceStep5 from '../components/LocalServiceCreation/CreateLocalServiceStep5';

// Define the props interface for CreateLocalServiceStep3
interface CreateLocalServiceStep3Props {
  // Add the necessary props here
}

const CreateLocalServiceStep3s: React.FC<CreateLocalServiceStep3Props> = (props) => {
  // Ensure the component returns a valid React node
  return (
    <div>
      {/* Component implementation */}
    </div>
  );
};

// Update the navigation stack to include the props type
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
  CreateLocalServiceStep2: { formData: any }; // Consider defining a specific type for formData
  CreateLocalServiceStep3: CreateLocalServiceStep3Props;
  CreateLocalServiceStep4: { formData: any };
  CreateLocalServiceStep5: { formData: any };
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
      {/* Local Service Creation Steps */}
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
    </Stack.Navigator>
  );
};

export default AppNavigator;
