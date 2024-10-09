import 'react-native-url-polyfill/auto';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY } from '@env';

// Vérifier si les variables d'environnement sont 

console.log("iiiiiiii",SUPABASE_URL, SUPABASE_API_KEY);
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_API_KEY) {
  throw new Error('Supabase URL or API Key is missing');
}


export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

