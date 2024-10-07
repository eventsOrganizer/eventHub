// App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from './app/screens/OnBoarding';
import Interests from './app/screens/Interests';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Onboarding">
          {({ navigation }) => (
            <Onboarding onNext={() => navigation.navigate('Interests')} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Interests" component={Interests} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
