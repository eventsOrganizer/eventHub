import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project details
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_API_KEY || '';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useSupabaseUserId() {
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      async function getUserId() {
        try {
          setLoading(true);
          
          // Get the current session
          const { data: { session }, error } = await supabase.auth.getSession();
  
          if (error) {
            throw error;
          }
  
          if (session?.user) {
            setUserId(session.user.id);
          } else {
            setUserId(null);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          setError(error instanceof Error ? error.message : String(error));
          setUserId(null);
        } finally {
          setLoading(false);
        }
      }
  
      getUserId();
  
      // Set up a listener for auth state changes
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUserId(session?.user?.id || null);
        } else if (event === 'SIGNED_OUT') {
          setUserId(null);
        }
      });
  
      // Clean up the listener when the component unmounts
      return () => {
        authListener?.subscription.unsubscribe();
      };
    }, []);
  
    return { userId, loading, error };
  }