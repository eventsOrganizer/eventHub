import 'react-native-url-polyfill/auto';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Vérifier si les variables d'environnement sont 

console.log("iiiiiiii",SUPABASE_URL, SUPABASE_API_KEY);
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_API_KEY) {
  throw new Error('Supabase URL or API Key is missing');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY, {
  // export const supabase = createClient("https://cdvnddjpkcdvspccjvre.supabase.co/","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdm5kZGpwa2NkdnNwY2NqdnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzMzc1NzksImV4cCI6MjA0MzkxMzU3OX0.A0Z32L8JCwX29nuq2lbrJCiEZo2ai5k1Emf7PMClLJE" , {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

console.log('Supabase client initialized');
