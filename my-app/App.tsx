import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './app/screens/HomeScreen';
import EventsScreen from './app/screens/EventsScreen';
import ServicesScreen from './app/screens/ServicesScreen';
import AccountScreen from './app/screens/AccountScreen';
import Signup from './app/components/Auth/SignUp';
import Login from './app/components/Auth/SignIn';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Events" component={EventsScreen} />
                <Tab.Screen name="Services" component={ServicesScreen} />
                <Tab.Screen name="Profile" component={AccountScreen} />
                <Tab.Screen name="Auth" component={AuthStack} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}