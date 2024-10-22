import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import useAuth from '../../hooks/useAuth';
import { Ionicons, AntDesign } from '@expo/vector-icons';

const Signup = () => {
  const { signup, error, success } = useAuth();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      // Handle password mismatch
      return;
    }
    if (!acceptTerms) {
      // Handle terms not accepted
      return;
    }
    signup(firstname, lastname, username, email, password);
    if (success) {
      navigation.navigate('signIn');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Join our Exclusive Community</Text>
      <Text style={styles.subtitle}>Become a member to enjoy special content and offers. Sign up now and get 10% off your first purchase with us!</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#888"
        value={firstname}
        onChangeText={setFirstname}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#888"
        value={lastname}
        onChangeText={setLastname}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm your Password"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={styles.termsContainer}>
        <TouchableOpacity onPress={() => setAcceptTerms(!acceptTerms)} style={styles.checkbox}>
          {acceptTerms && <Ionicons name="checkmark" size={18} color="white" />}
        </TouchableOpacity>
        <Text style={styles.termsText}>I accept all terms & conditions!</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create My Account</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="google" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="apple1" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="twitter" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.privacyText}>Your privacy matters. We keep your data secure and never share it.</Text>

      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>{success}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'linear-gradient(89.7deg, rgb(0, 32, 95) 2.8%, rgb(132, 53, 142) 97.8%)',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    color: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 5,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: '#fff',
  },
  eyeIcon: {
    padding: 15,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#00C2FF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  orText: {
    color: '#888',
    paddingHorizontal: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  privacyText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 12,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Signup;