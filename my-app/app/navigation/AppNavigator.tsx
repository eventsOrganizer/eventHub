import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreatePersonalServiceStep3 from '../components/PersonalServiceCreation/CreatePersonalServiceStep3';
import CreatePersonalServiceStep4 from '../components/PersonalServiceCreation/CreatePersonalServiceStep4';
import CreatePersonalServiceStep5 from '../components/PersonalServiceCreation/CreatePersonalServiceStep5';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CreatePersonalServiceStep3" component={CreatePersonalServiceStep3} />
      <Stack.Screen name="CreatePersonalServiceStep4" component={CreatePersonalServiceStep4} />
      <Stack.Screen name="CreatePersonalServiceStep5" component={CreatePersonalServiceStep5} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
