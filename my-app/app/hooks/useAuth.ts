import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/types';
import { useSupabaseUserId } from './getUser';

const useAuth = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
    const { userId, loading: userIdLoading } = useSupabaseUserId();

    useEffect(() => {
        if (userId) {
            console.log('Current User ID:', userId);
        }
    }, [userId]);

    const signup = async (firstname: string, lastname: string, username: string, email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
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
        let email = identifier;
        if (!identifier.includes('@')) {
            const { data, error } = await supabase
                .from('user')
                .select('email')
                .eq('username', identifier)
                .single();
    
            if (error || !data) {
                setError('User not found');
                return;
            }
            email = data.email;
        }
    
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
    
        if (error) {
            console.error('Login error:', error);
            setError(error.message);
            setSuccess(null);
        } else {
            setSuccess("Login successful");
            setError(null);
            console.log('Logged in user:', data.user);
            console.log('Logged in user ID:', data.user?.id);
            navigation.navigate('Home');
        }
    };

    return { signup, login, error, success, userId, userIdLoading };
};

export default useAuth;