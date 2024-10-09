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