import 'react-native-url-polyfill/auto';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Vérifier si les variables d'environnement sont 

console.log("iiiiiiii",SUPABASE_URL, SUPABASE_API_KEY);
// if (!process.env.SUPABASE_URL || !process.env.SUPABASE_API_KEY) {
//   throw new Error('Supabase URL or API Key is missing');
// }

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY, {
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

<<<<<<< HEAD
export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
=======
console.log('Supabase client initialized');
>>>>>>> 27016f8a9b04dc4f12ac01beefabdc660818306a
