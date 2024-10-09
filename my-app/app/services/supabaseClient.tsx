import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY } from '@env';

// Vérifier si les variables d'environnement sont 

console.log("iiiiiiii",SUPABASE_URL, SUPABASE_API_KEY);
if (!SUPABASE_URL || !SUPABASE_API_KEY) {
  throw new Error('Supabase URL or API Key is missing');
}


export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

