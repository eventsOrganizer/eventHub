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
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Événements" component={EventsScreen} />
        <Tab.Screen name="Services" component={ServicesScreen} />
        <Tab.Screen name="Mon Compte" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
