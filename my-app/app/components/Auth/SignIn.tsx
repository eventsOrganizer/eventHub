// import React, { useState } from 'react';
// import useAuth from '../../hooks/useAuth';

// const Login = () => {
//     // Updated the type definition for useAuth to include login
//     const { login, error, success }: { login: (identifier: string, password: string) => Promise<void>; error: string | null; success: string | null; } = useAuth();
//     const [identifier, setIdentifier] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             await login(identifier, password);
//             // Handle success (e.g., redirect or show a success message)
//         } catch (err) {
//             // Handle error (e.g., show an error message)
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input
//                 type="text"
//                 value={identifier}
//                 onChange={(e) => setIdentifier(e.target.value)}
//                 placeholder="Identifier"
//                 required
//             />
//             <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//                 required
//             />
//             <button type="submit">Login</button>
//             {error && <p>{error}</p>}
//             {success && <p>{success}</p>}
//         </form>
//     );
// };

// export default Login;


import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import useAuth from '../../hooks/useAuth';

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
        <View style={styles.container}>
            <TextInput
                placeholder="Identifier"
                value={identifier}
                onChangeText={setIdentifier}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Login" onPress={handleSubmit} />
            {validationError && <Text style={styles.errorText}>{validationError}</Text>}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {success && <Text style={styles.successText}>{success}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    successText: {
        color: 'green',
        marginTop: 10,
    },
});

export default Login;
