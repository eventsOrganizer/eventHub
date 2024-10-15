import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from '../screens/OnBoarding';
import Interests from '../screens/Interests';
import Home from '../screens/Home'; 
import MapScreen from '../screens/MapScreen'; // Import MapScreen
import CalendarScreen from '../screens/CalendarScreen'; // Import CalendarScreen
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
  EventDetails: { eventId: number };
  OrganizerProfile: { organizerId: string };
  ChatRoom: { userId: string; organizerId: string };
  ChatList: undefined;
  Requests: undefined;
  PersonalsScreen: undefined;
  PersonalDetail: undefined;
  LocalServiceScreen: undefined;
  LocalServiceDetails: { localServiceId: number };
  UserProfile: undefined;
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
        name="Profile" 
        component={ProfileScreen} 
        options={{ headerShown: true }} // Adjust as needed
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
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

      {/* Your other screens */}
      <Stack.Screen 
      name="UserProfile" 
      component={UserProfileScreen} />
    

    

    </Stack.Navigator>
  );
};

export default AppNavigator;
