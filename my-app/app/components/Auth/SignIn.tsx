import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import useAuth from '../../hooks/useAuth';

const Login = () => {
    const { login, error, success } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        login(identifier, password);
    };

    return (
        <View>
            <TextInput placeholder="Username or Email" value={identifier} onChangeText={setIdentifier} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Login" onPress={handleSubmit} />
            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>{success}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    error: { color: 'red' },
    success: { color: 'green' },
});

export default Login;