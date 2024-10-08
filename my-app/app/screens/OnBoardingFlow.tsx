import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from './OnBoarding';
import Interest from './Interests';

const Stack = createStackNavigator();

const OnboardingFlow: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Onboarding" 
        component={Onboarding} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Interests" 
        component={Interest} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default OnboardingFlow;
