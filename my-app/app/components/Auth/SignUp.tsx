import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import useAuth from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // Importing the correct type
import { AuthStackParamList } from '../../navigation/types'; // Adjust the import path as necessary
import  useFileUpload  from '../../services/uploadFiles';

const Signup = () => {
    const { signup, error, success } = useAuth();
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>(); // Typing the navigation prop
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { uploadFile, uploading, error: uploadError } = useFileUpload();
    const handleSubmit =  () => {
        console.log({ firstname, lastname, username, email, password });
         signup(firstname, lastname, username, email, password);

        if(success){
            navigation.navigate('Signin' as never) 
        }
      
                //   navigation.navigate('Signin' as never); 
                  // Cast to 'never' to bypass type checking
               
    };

    return (
        <View>
            <TextInput placeholder="First Name" value={firstname} onChangeText={setFirstname} />
            <TextInput placeholder="Last Name" value={lastname} onChangeText={setLastname} />
            <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Sign Up" onPress={handleSubmit} />
            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>{success}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    error: { color: 'red' },
    success: { color: 'green' },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default Signup;