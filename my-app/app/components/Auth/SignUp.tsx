import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NativeBaseProvider, Box, VStack, Heading, Input, Button, Text, FormControl, ScrollView, useToast } from 'native-base';
import useAuth from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = () => {
  const { signup, error, success } = useAuth();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const toast = useToast();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    console.log({ firstname, lastname, username, email, password });
    await signup(firstname, lastname, username, email, password);

    if (success) {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        console.log('youbaaaa:', token);
        navigation.navigate('Signin' as never);
        toast.show({
          title: "Signup Successful",
          description: "Please sign in with your new account"
        });
      }
    } else if (error) {
      toast.show({
        title: "Signup Failed",
        description: error
      });
    }
  };

  return (
    <NativeBaseProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="orange.500" _dark={{
            color: "warmGray.50"
          }}>
            Welcome
          </Heading>
          <Heading mt="1" _dark={{
            color: "warmGray.200"
          }} color="orange.400" fontWeight="medium" size="xs">
            Sign up to continue!
          </Heading>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>First Name</FormControl.Label>
              <Input value={firstname} onChangeText={setFirstname} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Last Name</FormControl.Label>
              <Input value={lastname} onChangeText={setLastname} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Username</FormControl.Label>
              <Input value={username} onChangeText={setUsername} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Email</FormControl.Label>
              <Input value={email} onChangeText={setEmail} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input type="password" value={password} onChangeText={setPassword} />
            </FormControl>
            <Button mt="2" colorScheme="orange" onPress={handleSubmit}>
              Sign up
            </Button>
            <Text mt="2" textAlign="center">
              Already have an account?{" "}
              <Text color="orange.500" fontWeight="medium" onPress={() => navigation.navigate('Signin' as never)}>
                Sign In
              </Text>
            </Text>
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default Signup;

