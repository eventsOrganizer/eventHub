import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateLocalServiceStep1 from './CreateLocalServiceStep1';
import CreateLocalServiceStep2 from './CreateLocalServiceStep2';
import CreateLocalServiceStep3 from './CreateLocalServiceStep3';
import CreateLocalServiceStep4 from './CreateLocalServiceStep4';
import CreateLocalServiceStep5 from './CreateLocalServiceStep5';  

const Stack = createStackNavigator();

const CreateLocalServiceStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="CreateLocalServiceStep1">
      <Stack.Screen name="CreateLocalServiceStep1" component={CreateLocalServiceStep1} options={{ headerShown: false }}/>
      <Stack.Screen name="CreateLocalServiceStep2" component={CreateLocalServiceStep2} options={{ headerShown: false }}/>
      <Stack.Screen name="CreateLocalServiceStep3" component={CreateLocalServiceStep3} options={{ headerShown: false }}/>
      <Stack.Screen name="CreateLocalServiceStep4" component={CreateLocalServiceStep4} options={{ headerShown: false }}/>
      <Stack.Screen name="CreateLocalServiceStep5" component={CreateLocalServiceStep5} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export default CreateLocalServiceStack;