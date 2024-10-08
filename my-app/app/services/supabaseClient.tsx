import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY } from '@env';

// Vérifier si les variables d'environnement sont définies
if (!SUPABASE_URL || !SUPABASE_API_KEY) {
  throw new Error('Supabase URL or API Key is missing');
}
console.log(SUPABASE_URL, SUPABASE_API_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

