import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
//  process.env.SUPABASE_URL 
  'https://cdvnddjpkcdvspccjvre.supabase.co' as string;
const supabaseAnonKey = 
// process.env.SUPABASE_API_KEY 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdm5kZGpwa2NkdnNwY2NqdnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzMzc1NzksImV4cCI6MjA0MzkxMzU3OX0.A0Z32L8JCwX29nuq2lbrJCiEZo2ai5k1Emf7PMClLJE' as string;
console.log("check  supabaseUrl, supabaseAnonKey",supabaseUrl, supabaseAnonKey);
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or API Key is missing');
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase client initialized for admin dashboard');