import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from './CalendarScreen';
import MapScreen from './MapScreen';
import Signup from '../components/Auth/SignUp';
import Signin from '../components/Auth/SignIn';
import Maps from './Maps';
import CreateLocalServiceStack from '../components/LocalServiceCreation/CreateLocalServiceStack';
import CreatePersonalServiceStack from '../components/PersonalServiceCreation/createPersonalServiceStack';
import tw from 'twrnc';

const Tab = createBottomTabNavigator();

const icons = [
  { name: 'Home', icon: 'home', component: HomeScreen },
  { name: 'Calendar', icon: 'calendar', component: CalendarScreen },
  { name: 'Map', icon: 'map', component: Maps },
  { name: 'Signup', icon: 'person-add', component: Signup },
  { name: 'Signin', icon: 'log-in', component: Signin },
  { name: 'CreatePersonal', icon: 'construct', component: CreatePersonalServiceStack },
];

const MainTabNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const CustomTabBar = ({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) => {
    return (
      <View style={tw`absolute bottom-0 left-0 right-0 h-20 bg-gray-900 bg-opacity-90 rounded-t-3xl shadow-xl flex flex-row justify-between items-center px-5`}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
            setActiveTab(route.name);
          };
          const iconName = icons.find(icon => icon.name === route.name)?.icon;
          
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={[
                tw`w-14 h-14 rounded-lg flex items-center justify-center shadow-lg`,
                isFocused ? tw`bg-indigo-600` : tw`bg-gray-800`,
              ]}
            >
              {iconName && <Ionicons name={iconName as any} size={24} color={isFocused ? 'white' : '#A5B4FC'} />}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {icons.map(icon => (
        <Tab.Screen key={icon.name} name={icon.name} component={icon.component} />
      ))}
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
