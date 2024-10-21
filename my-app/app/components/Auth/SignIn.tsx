import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../../hooks/useAuth';
import tw from 'twrnc';

const { width, height } = Dimensions.get('window');

const Login = () => {
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
    const { login, error, success } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleSubmit = async () => {
        if (!identifier || !password) {
            setValidationError('Both fields are required.');
            return;
        }

        setValidationError('');
        try {
            await login(identifier, password);
            if (success) {
                Alert.alert('Success', 'You have logged in successfully.');
                navigation.navigate('Home');
            }
        } catch (err) {
            if (error) {
                Alert.alert('Error', error);
            }
        }
    };

    return (
        <LinearGradient
            colors={['#FF5F00', '#FF0D95']}
            style={tw`flex-1 justify-center items-center`}
        >
            <BlurView intensity={80} tint="dark" style={tw`w-11/12 rounded-3xl overflow-hidden`}>
                <View style={tw`p-6`}>
                    <Text style={tw`text-white text-3xl font-bold mb-6 text-center`}>Login</Text>
                    <View style={tw`bg-white bg-opacity-20 rounded-full px-4 py-2 mb-4 flex-row items-center`}>
                        <Ionicons name="person-outline" size={24} color="#fff" style={tw`mr-2`} />
                        <TextInput
                            placeholder="Username or Email"
                            placeholderTextColor="#rgba(255,255,255,0.7)"
                            value={identifier}
                            onChangeText={setIdentifier}
                            style={tw`flex-1 text-white text-base`}
                        />
                    </View>
                    <View style={tw`bg-white bg-opacity-20 rounded-full px-4 py-2 mb-6 flex-row items-center`}>
                        <Ionicons name="lock-closed-outline" size={24} color="#fff" style={tw`mr-2`} />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#rgba(255,255,255,0.7)"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={tw`flex-1 text-white text-base`}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={tw`bg-white rounded-full py-3 px-6`}
                    >
                        <Text style={tw`text-[#FF0D95] text-center font-bold text-lg`}>Login</Text>
                    </TouchableOpacity>
                    {validationError && <Text style={tw`text-red-500 mt-4 text-center`}>{validationError}</Text>}
                    {error && <Text style={tw`text-red-500 mt-4 text-center`}>{error}</Text>}
                    {success && <Text style={tw`text-green-500 mt-4 text-center`}>{success}</Text>}
                </View>
            </BlurView>
        </LinearGradient>
    );
};

export default Login;