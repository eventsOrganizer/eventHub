import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Config from 'react-native-config';

console.log('Environment Variables:', Config); // Log all Config variables

const supabaseUrl = Config.SUPABASE_URL;
const supabaseAnonKey = Config.SUPABASE_API_KEY;

// Log the values being used for debugging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase API Key:', supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  const missingKeys = [];
  if (!supabaseUrl) missingKeys.push('SUPABASE_URL');
  if (!supabaseAnonKey) missingKeys.push('SUPABASE_API_KEY');

  console.error(`Missing Supabase configuration: ${missingKeys.join(', ')}`);
  throw new Error('Missing Supabase configuration. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
