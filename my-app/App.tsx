<<<<<<< HEAD
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importing screens
import HomeScreen from './app/screens/HomeScreen';
import EventsScreen from './app/screens/EventsScreen';
import ServicesScreen from './app/screens/ServicesScreen';
import AccountScreen from './app/screens/AccountScreen';

import EditProfileScreen from './app/screens/EditProfileScreen';
=======
// // App.tsx
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from './app/screens/HomeScreen';
// import EventsScreen from './app/screens/EventsScreen';
// import ServicesScreen from './app/screens/ServicesScreen';
// import AccountScreen from './app/screens/AccountScreen';
// import OnboardingFlow from './app/screens/OnBoardingFlow';

// const Tab = createBottomTabNavigator();


// export default function App() {
//   return (
//    
//     ///UNCOMMENT THIS FOR ONBOARDINGFLOW///
//     // <NavigationContainer>
//     //   <OnboardingFlow />
//     // </NavigationContainer>
//   );
// }


// App.tsx
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from './app/screens/HomeScreen';
// import EventsScreen from './app/screens/EventsScreen';
// import ServicesScreen from './app/screens/ServicesScreen';
// import AccountScreen from './app/screens/AccountScreen';

// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name="Homeeeeee" component={HomeScreen} />
//         <Tab.Screen name="Events" component={EventsScreen} />
//         <Tab.Screen name="Services" component={ServicesScreen} />
//         <Tab.Screen name="Profile" component={AccountScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
  
//   );
// }

// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigation';
>>>>>>> 165694fca955ffd0f221c2d55e0cc64ca507ef20

// Create Navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator(); // This is now imported from native-stack

// Stack Navigator for Profile and EditProfile screens
const AccountStack = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={AccountScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
<<<<<<< HEAD
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Events" component={EventsScreen} />
        <Tab.Screen name="Services" component={ServicesScreen} />
        {/* Account tab uses the AccountStack to handle Profile and EditProfile screens */}
        <Tab.Screen name="Account" component={AccountStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
=======
      <AppNavigator />
    </NavigationContainer>
  );
}

>>>>>>> 165694fca955ffd0f221c2d55e0cc64ca507ef20
