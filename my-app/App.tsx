// App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingFlow from './app/screens/OnBoardingFlow';

export default function App() {
  return (
    <NavigationContainer>
      <OnboardingFlow />
    </NavigationContainer>
  );
}
