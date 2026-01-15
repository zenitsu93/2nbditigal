import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger le .env depuis la racine du projet (2 niveaux au-dessus de server/lib/)
const rootDir = join(__dirname, '..', '..');
dotenv.config({ path: join(rootDir, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERREUR CRITIQUE: Variables Supabase manquantes');
  console.error('   Variables requises:');
  console.error('   - SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY (recommandé) ou SUPABASE_ANON_KEY');
  console.error('');
  console.error('   Variables disponibles:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
  throw new Error('Supabase URL and Key environment variables are required');
}

// Créer le client Supabase avec la service role key (pour les opérations admin)
// ou la anon key si service role n'est pas disponible
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('✅ Client Supabase initialisé');
console.log(`   - URL: ${supabaseUrl}`);
console.log(`   - Key: ${supabaseKey.substring(0, 20)}...`);

export default supabase;
