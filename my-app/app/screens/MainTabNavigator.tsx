import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import EventsScreen from './EventsScreen';
import ServicesScreen from './ServicesScreen';
import AccountScreen from './AccountScreen';
import CalendarScreen from './CalendarScreen';
import MapScreen from './MapScreen';
import ProfileScreen from './AccountScreen';
import Signup from '../components/Auth/SignUp';
import Signin from '../components/Auth/SignIn';
// Import the CreateLocalServiceScreen
import CreateLocalServiceStack from '../components/LocalServiceCreation/CreateLocalServiceStack';

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen}  options={{ headerShown: false }} />
      <Tab.Screen name="Events" component={EventsScreen}  options={{ headerShown: false }} />
      <Tab.Screen name="Services" component={ServicesScreen}  options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen}  options={{ headerShown: false }} />
      <Tab.Screen name="Calendar" component={CalendarScreen}  options={{ headerShown: false }} />
      <Tab.Screen name="Map" component={MapScreen}  options={{ headerShown: false }} />
      <Tab.Screen name="Signup" component={Signup}  options={{ headerShown: false }}/>
      <Tab.Screen name="Signin" component={Signin}/>
      {/* Add the CreateLocalServiceScreen to the tab navigator */}
      <Tab.Screen name="CreateService" component={CreateLocalServiceStack} /> 
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
