import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NativeBaseProvider, Box, VStack, Heading, Input, Button, Text, FormControl, ScrollView, useToast } from 'native-base';
import useAuth from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';

const Signin = () => {
  const { login, error, success } = useAuth();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const toast = useToast();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!identifier || !password) {
      toast.show({
        title: "Validation Error",
        description: "Both fields are required."
      });
      return;
    }

    try {
      await login(identifier, password);
      if (success) {
        toast.show({
          title: "Login Successful",
          description: "You have logged in successfully."
        });
        navigation.navigate('Home');
      }
    } catch (err) {
      if (error) {
        toast.show({
          title: "Login Failed",
          description: error
        });
      }
    }
  };

  return (
    <NativeBaseProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="orange.500" _dark={{
            color: "warmGray.50"
          }}>
            Welcome Back
          </Heading>
          <Heading mt="1" _dark={{
            color: "warmGray.200"
          }} color="orange.400" fontWeight="medium" size="xs">
            Sign in to continue!
          </Heading>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>Identifier</FormControl.Label>
              <Input value={identifier} onChangeText={setIdentifier} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input type="password" value={password} onChangeText={setPassword} />
            </FormControl>
            <Button mt="2" colorScheme="orange" onPress={handleSubmit}>
              Sign in
            </Button>
            <Text mt="2" textAlign="center">
              Don't have an account?{" "}
              <Text color="orange.500" fontWeight="medium" onPress={() => navigation.navigate('Signup' as never)}>
                Sign Up
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

export default Signin;