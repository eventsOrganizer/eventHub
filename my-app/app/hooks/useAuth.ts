import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/types';
import { useUser } from '../UserContext';


const useAuth = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
    const { userId, setUserId } = useUser();
    const { selectedInterests } = useUser();

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
            console.error('Signup error:', error);
            setError(error.message);
            setSuccess(null);
        } else if (data?.user) {
            console.log('Signup successful:', data.user);
            setSuccess("Signup successful");
            setError(null);

            // Debug logs
            console.log('Starting interest save process...');
            console.log('Selected interests:', selectedInterests);
            
            if (data.user && selectedInterests.length > 0) {
                const interestsToInsert = selectedInterests.map(subcategoryId => ({
                    user_id: data.user.id,  // Use the auth user ID directly
                    subcategory_id: parseInt(subcategoryId)
                }));

                console.log('Interests to insert:', interestsToInsert);

                const { error: insertError } = await supabase
                    .from('interest')
                    .insert(interestsToInsert);

                if (insertError) {
                    console.error('Failed to insert interests:', insertError);
                } else {
                    console.log('Interests saved successfully!');
                }
            }


        } else {
            console.error('Unexpected result:', data);
            setError("An unexpected error occurred");
            setSuccess(null);
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
        } else if (data.session) {
            setSuccess("Login successful");
            setError(null);
            console.log('Logged in user:', data.user);
            console.log('Logged in user ID:', data.user?.id);
            setUserId(data.user?.id || null);
            navigation.navigate('Home');
        } else {
            setError("Login failed: No session created");
            setSuccess(null);
        }
    };

    return { signup, login, error, success, userId };
};

export default useAuth;