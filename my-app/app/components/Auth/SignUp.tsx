import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import useAuth from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import useFileUpload from '../../services/uploadFiles';
import * as ImagePicker from 'expo-image-picker'; // For handling file/image upload

const Signup = () => {
    const { signup, error: authError, success } = useAuth();
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { uploadFile, uploading, uploadSuccess, error: uploadError } = useFileUpload();
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // For file uploads
    const [file, setFile] = useState<File | null>(null); // Store the file object

    const handleSubmit = async () => {
        const { user, error } = await signup(firstname, lastname, username, email, password);

        if (user) {
            if (file) {
                await uploadFile(file, {
                    userId: user.id, // Use the actual user ID from the signup response
                    type: 'image',
                });
            }
            navigation.navigate('Signin');
        }
    };

    const handleImagePick = async () => {
        // Let user pick an image from their device
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri); // Store the URI of the selected image
            console.log("Selected Image URI: ", result.assets[0].uri);

            // Convert the selected image to the File type
            const response = await fetch(result.assets[0].uri);
            const blob = await response.blob();
            //@ts-ignore
            const newFile = new File([blob], result.assets[0].fileName, { type: result.assets[0].type });
            console.log("newFile", newFile);
            setFile(newFile); // Set the File object
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstname}
                onChangeText={setFirstname}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastname}
                onChangeText={setLastname}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            <Button title="Select Profile Image" onPress={handleImagePick} />
            {selectedImage && <Text>Profile image selected</Text>}

            <Button title="Sign Up" onPress={handleSubmit} />

            {authError && <Text style={styles.error}>{authError}</Text>}
            {uploadError && <Text style={styles.error}>{uploadError}</Text>}
            {uploading && <Text>Uploading image...</Text>}
            {uploadSuccess && <Text style={styles.success}>Image uploaded successfully!</Text>}
            {success && <Text style={styles.success}>{success}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    error: {
        color: 'red',
        marginVertical: 8,
    },
    success: {
        color: 'green',
        marginVertical: 8,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '80%',
    },
});

export default Signup;
