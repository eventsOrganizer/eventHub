import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import useAuth from '../../hooks/useAuth';

const Signup = () => {
    const { signup, error, success } = useAuth();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        signup(firstname, lastname, username, email, password);
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
});

export default Signup;