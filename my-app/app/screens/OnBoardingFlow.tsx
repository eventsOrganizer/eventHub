// app/screens/OnBoardingFlow.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnBoarding from './OnBoarding';
import Interests from './Interests';
import HomeScreen from './HomeScreen'; // Import HomeScreen

const Stack = createStackNavigator();

const OnboardingFlow: React.FC = () => {
  const handleOnComplete = (navigation: any) => {
    // Navigate to Home when onboarding is complete
    navigation.navigate('Home');
  };

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Onboarding" 
        component={OnBoarding} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Interests" 
        component={(props) => <Interests {...props} onComplete={() => handleOnComplete(props.navigation)} />} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default OnboardingFlow;
