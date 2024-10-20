import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL as string;
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_API_KEY as string;

// if (!process.env.supabaseUrl || !process.env.supabaseAnonKey) {
//   console.error('Supabase URL or Anon Key is missing');
// }

export const supabase = createClient(supabaseUrl, supabaseAnonKey);