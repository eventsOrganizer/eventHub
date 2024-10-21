import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../../hooks/useAuth';
import useFileUpload from '../../services/uploadFiles';
import * as ImagePicker from 'expo-image-picker';
import tw from 'twrnc';

const { width, height } = Dimensions.get('window');

const Signup = () => {
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
    const { signup, error: authError, success } = useAuth();
    const { uploadFile, uploading, uploadSuccess, error: uploadError } = useFileUpload();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [validationError, setValidationError] = useState('');

    const handleSubmit = async () => {
        if (!firstname || !lastname || !username || !email || !password) {
            setValidationError('All fields are required.');
            return;
        }

        setValidationError('');
        const { user, error } = await signup(firstname, lastname, username, email, password);

        if (user) {
            if (file) {
                await uploadFile(file, {
                    userId: user.id,
                    type: 'image',
                });
            }
            Alert.alert('Success', 'You have signed up successfully.');
            navigation.navigate('Signin');
        } else if (error) {
            Alert.alert('Error', error);
        }
    };

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            const response = await fetch(result.assets[0].uri);
            const blob = await response.blob();
            const newFile = new File([blob], 'profileImage.jpg', { type: 'image/jpeg' });
            setFile(newFile);
        }
    };

    return (
        <LinearGradient
            colors={['#FF5F00', '#FF0D95']}
            style={tw`flex-1 justify-center items-center`}
        >
            <BlurView intensity={80} tint="dark" style={tw`w-11/12 rounded-3xl overflow-hidden`}>
                <View style={tw`p-6`}>
                    <Text style={tw`text-white text-3xl font-bold mb-6 text-center`}>Sign Up</Text>
                    <View style={tw`bg-white bg-opacity-20 rounded-full px-4 py-2 mb-4 flex-row items-center`}>
                        <Ionicons name="person-outline" size={24} color="#fff" style={tw`mr-2`} />
                        <TextInput
                            placeholder="First Name"
                            placeholderTextColor="#rgba(255,255,255,0.7)"
                            value={firstname}
                            onChangeText={setFirstname}
                            style={tw`flex-1 text-white text-base`}
                        />
                    </View>
                    <View style={tw`bg-white bg-opacity-20 rounded-full px-4 py-2 mb-4 flex-row items-center`}>
                        <Ionicons name="person-outline" size={24} color="#fff" style={tw`mr-2`} />
                        <TextInput
                            placeholder="Last Name"
                            placeholderTextColor="#rgba(255,255,255,0.7)"
                            value={lastname}
                            onChangeText={setLastname}
                            style={tw`flex-1 text-white text-base`}
                        />
                    </View>
                    <View style={tw`bg-white bg-opacity-20 rounded-full px-4 py-2 mb-4 flex-row items-center`}>
                        <Ionicons name="at-outline" size={24} color="#fff" style={tw`mr-2`} />
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor="#rgba(255,255,255,0.7)"
                            value={username}
                            onChangeText={setUsername}
                            style={tw`flex-1 text-white text-base`}
                        />
                    </View>
                    <View style={tw`bg-white bg-opacity-20 rounded-full px-4 py-2 mb-4 flex-row items-center`}>
                        <Ionicons name="mail-outline" size={24} color="#fff" style={tw`mr-2`} />
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#rgba(255,255,255,0.7)"
                            value={email}
                            onChangeText={setEmail}
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
                        onPress={handleImagePick}
                        style={tw`bg-white bg-opacity-20 rounded-full py-3 px-6 mb-4`}
                    >
                        <Text style={tw`text-white text-center font-bold text-lg`}>
                            {selectedImage ? 'Change Profile Image' : 'Select Profile Image'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={tw`bg-white rounded-full py-3 px-6`}
                    >
                        <Text style={tw`text-[#FF0D95] text-center font-bold text-lg`}>Sign Up</Text>
                    </TouchableOpacity>
                    {validationError && <Text style={tw`text-red-500 mt-4 text-center`}>{validationError}</Text>}
                    {authError && <Text style={tw`text-red-500 mt-4 text-center`}>{authError}</Text>}
                    {uploadError && <Text style={tw`text-red-500 mt-4 text-center`}>{uploadError}</Text>}
                    {uploading && <Text style={tw`text-white mt-4 text-center`}>Uploading image...</Text>}
                    {uploadSuccess && <Text style={tw`text-green-500 mt-4 text-center`}>Image uploaded successfully!</Text>}
                    {success && <Text style={tw`text-green-500 mt-4 text-center`}>{success}</Text>}
                </View>
            </BlurView>
        </LinearGradient>
    );
};

export default Signup;