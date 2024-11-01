import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from './CalendarScreen';
import MapScreen from './MapScreen';
import Signup from '../components/Auth/SignUp';
import Signin from '../components/Auth/SignIn';
import Maps from './Maps';
import { BlurView } from 'expo-blur';
import CreateLocalServiceStack from '../components/LocalServiceCreation/CreateLocalServiceStack';
import CreatePersonalServiceStack from '../components/PersonalServiceCreation/createPersonalServiceStack';
import tw from 'twrnc';
import { theme } from '../../lib/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
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
  const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    return (
      <View style={tw`absolute bottom-0 left-0 right-0`}>
        <BlurView intensity={90} tint="light" style={styles.tabBar}>
          <View style={styles.tabContainer}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;
              const icon = icons.find(icon => icon.name === route.name)?.icon;

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={() => {
                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                      navigation.navigate(route.name);
                    }
                  }}
                  style={[
                    styles.tab,
                    isFocused && styles.activeTab
                  ]}
                >
                  <Ionicons
                    name={icon}
                    size={24}
                    color={isFocused ? theme.colors.accent : theme.colors.secondary}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    );
  };

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {icons.map(icon => (
        <Tab.Screen key={icon.name} name={icon.name} component={icon.component} />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    paddingBottom: theme.spacing.md,
  },
  tab: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.overlay,
  },
});

export default MainTabNavigator;
