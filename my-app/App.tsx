// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './app/screens/HomeScreen';
import EventsScreen from './app/screens/EventsScreen';
import ServicesScreen from './app/screens/ServicesScreen';
import AccountScreen from './app/screens/AccountScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Homeeeeee" component={HomeScreen} />
        <Tab.Screen name="Events" component={EventsScreen} />
        <Tab.Screen name="Services" component={ServicesScreen} />
        <Tab.Screen name="Profile" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
