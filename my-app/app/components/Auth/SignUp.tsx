import React, { useState } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { NativeBaseProvider, Box, VStack, Input, Button, Text, ScrollView, useToast } from 'native-base';
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
        console.log('Token:', token);
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
      <ImageBackground
        source={require('../../assets/pablo-heimplatz-ZODcBkEohk8-unsplash.jpg')}
        style={styles.backgroundImage}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Box safeArea p="2" py="8" w="90%" maxW="290">
            <VStack space={4} mt="5">
              <Input
                placeholder="First Name"
                value={firstname}
                onChangeText={setFirstname}
                bg="rgba(255,255,255,0.2)"
                borderWidth={0}
                color="white"
                placeholderTextColor="#FFA500" // Updated color
              />
              <Input
                placeholder="Last Name"
                value={lastname}
                onChangeText={setLastname}
                bg="rgba(255,255,255,0.2)"
                borderWidth={0}
                color="white"
                placeholderTextColor="#FFA500" // Updated color
              />
              <Input
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                bg="rgba(255,255,255,0.2)"
                borderWidth={0}
                color="white"
                placeholderTextColor="#FFA500" // Updated color
              />
              <Input
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                bg="rgba(255,255,255,0.2)"
                borderWidth={0}
                color="white"
                placeholderTextColor="#FFA500" // Updated color
              />
              <Input
                placeholder="Create Password"
                type="password"
                value={password}
                onChangeText={setPassword}
                bg="rgba(255,255,255,0.2)"
                borderWidth={0}
                color="white"
                placeholderTextColor="#FFA500" // Updated color
              />
              <Button mt="2" bg="yellow.400" onPress={handleSubmit}>
                Sign Up
              </Button>
              <Text mt="2" textAlign="center" color="white">
                Already have an account?{" "}
                <Text color="yellow.400" fontWeight="medium" onPress={() => navigation.navigate('Signin' as never)}>
                  Sign In
                </Text>
              </Text>
            </VStack>
          </Box>
        </ScrollView>
      </ImageBackground>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center horizontally
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default Signup;