// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// // Importing screens
// import HomeScreen from './app/screens/HomeScreen';
// import EventsScreen from './app/screens/EventsScreen';
// import ServicesScreen from './app/screens/ServicesScreen';
// import AccountScreen from './app/screens/AccountScreen';
// import EditProfileScreen from './app/screens/EditProfileScreen';

// // Create Navigators
// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator(); // This is imported from native-stack

// // Stack Navigator for Profile and EditProfile screens
// const AccountStack = () => {
//   return (
//     <Stack.Navigator>
//       {/* Profile screen */}
//       <Stack.Screen name="Profile" component={AccountScreen} options={{ title: 'My Profile' }} />
//       {/* Edit Profile screen */}
//       <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
//     </Stack.Navigator>
//   );
// };

// // Main App Navigation
// const App = () => {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name="Home" component={HomeScreen} />
//         <Tab.Screen name="Events" component={EventsScreen} />
//         <Tab.Screen name="Services" component={ServicesScreen} />
//         {/* Account tab uses the AccountStack to handle Profile and EditProfile screens */}
//         <Tab.Screen name="Account" component={AccountStack} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigation';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
