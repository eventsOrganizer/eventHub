import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreatePersonalServiceStep1 from './CreatePersonalServiceStep1';
import CreatePersonalServiceStep2 from './CreatePersonalServiceStep2';
import CreatePersonalServiceStep3 from './CreatePersonalServiceStep3';
import CreatePersonalServiceStep5 from './CreatePersonalServiceStep5';

const Stack = createStackNavigator();

const CreatePersonalServiceStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="CreatePersonalServiceStep1">
      <Stack.Screen name="CreatePersonalServiceStep1" component={CreatePersonalServiceStep1} />
      <Stack.Screen name="CreatePersonalServiceStep2" component={CreatePersonalServiceStep2} />
      <Stack.Screen name="CreatePersonalServiceStep3" component={CreatePersonalServiceStep3} />
      <Stack.Screen name="CreatePersonalServiceStep5" component={CreatePersonalServiceStep5} />
    </Stack.Navigator>
  );
};

export default CreatePersonalServiceStack;