import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const Login = () => {
    // Updated the type definition for useAuth to include login
    const { login, error, success }: { login: (identifier: string, password: string) => Promise<void>; error: string | null; success: string | null; } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(identifier, password);
            // Handle success (e.g., redirect or show a success message)
        } catch (err) {
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Identifier"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
        </form>
    );
};

export default Login;



// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, Alert } from 'react-native';
// import useAuth from '../../hooks/useAuth';

// const Login = () => {
//     const { login, error, success } = useAuth();
//     const [identifier, setIdentifier] = useState('');
//     const [password, setPassword] = useState('');
//     const [validationError, setValidationError] = useState('');

//     const handleSubmit = async () => {
//         if (!identifier || !password) {
//             setValidationError('Both fields are required.');
//             return;
//         }

//         setValidationError(''); // Clear validation error on valid submission

//         try {
//             await login(identifier, password);
//             if (success) {
//                 Alert.alert('Success', 'You have logged in successfully.');
//                 // Handle success (e.g., redirect or show a success message)
//             }
//         } catch (err) {
//             if (error) {
//                 Alert.alert('Error', error);
//             }
//         }
//     };

//     return (
//         <View style={{ padding: 20 }}>
//             <TextInput
//                 placeholder="Identifier"
//                 value={identifier}
//                 onChangeText={setIdentifier}
//                 style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
//             />
//             <TextInput
//                 placeholder="Password"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={true}
//                 style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
//             />
//             <Button title="Login" onPress={handleSubmit} />
//             {validationError ? <Text style={{ color: 'red' }}>{validationError}</Text> : null}
//             {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
//             {success ? <Text style={{ color: 'green' }}>{success}</Text> : null}
//         </View>
//     );
// };

// export default Login;
