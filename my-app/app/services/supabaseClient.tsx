import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Declare variables outside the block
let supabaseUrl: string | undefined;
let supabaseAnonKey: string | undefined;

// Get the expoConfig safely
const expoConfig = Constants.expoConfig;

if (expoConfig) {
  supabaseUrl = expoConfig.extra?.SUPABASE_URL;
  supabaseAnonKey = expoConfig.extra?.SUPABASE_ANON_KEY;

  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Anon Key:', supabaseAnonKey);
} else {
  console.error('Expo config is not available.');
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
