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
import CreatePersonalServiceStack from '../components/PersonalServiceCreation/createPersonalServiceStack';

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Signup" component={Signup}/>
      <Tab.Screen name="Signin" component={Signin}/>
      {/* Add the CreateLocalServiceScreen to the tab navigator */}
      <Tab.Screen name="CreateService" component={CreateLocalServiceStack} /> 
      <Tab.Screen name="CreatePersonal" component={CreatePersonalServiceStack}/>
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
