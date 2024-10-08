import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface AuthError {
    message: string;
}

const useAuth = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const signup = async (
        firstname: string,
        lastname: string,
        username: string,
        email: string,
        password: string
    ) => {
        const { data, error }: { data: { user: any; session: any; }; error: AuthError | null } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    firstname,
                    lastname,
                    username,
                },
            },
        });

        if (error) {
            setError(error.message);
            setSuccess(null);
        } else {
            setSuccess("Signup successful");
            setError(null);
        }
    };

    const login = async (identifier: string, password: string) => {
        const { data, error }: { data: { user: any; session: any; }; error: AuthError | null } = await supabase.auth.signInWithPassword({
            email: identifier,
            password,
        });

        if (error) {
            setError(error.message);
            setSuccess(null);
        } else {
            setSuccess("Login successful");
            setError(null);
        }
    };

    return { signup, login, error, success };
};

export default useAuth;