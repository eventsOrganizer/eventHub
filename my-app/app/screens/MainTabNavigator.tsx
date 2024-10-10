import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import EventsScreen from './EventsScreen';
import ServicesScreen from './ServicesScreen';
import AccountScreen from './AccountScreen';
import CalendarScreen from './CalendarScreen';
import MapScreen from './MapScreen';
import ProfileScreen from './AccountScreen';
import Signup from '../components/Auth/SignUp';
import Signin from '../components/Auth/SignIn';

import EventCreationScreen from './EventCreationScreen';
// import EventCustomizationScreen from './EventCustomizationScreen';
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
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
      <Tab.Screen name="EventCreation" component={EventCreationScreen} />
      {/* <Tab.Screen name="EventCustomization" component={EventCustomizationScreen} /> */}
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
