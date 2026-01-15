import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import supabase from '../lib/supabase.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger le .env depuis la racine du projet (2 niveaux au-dessus de server/scripts/)
const rootDir = join(__dirname, '..', '..');
dotenv.config({ path: join(rootDir, '.env') });

async function createDefaultAdmin() {
  try {
    const username = 'christian';
    const password = 'j20023700';

    // Vérifier si l'admin existe déjà
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('id, username')
      .eq('username', username)
      .single();

    if (existingAdmin) {
      console.log('✅ L\'administrateur "christian" existe déjà');
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'admin
    const now = new Date().toISOString();
    const { data: admin, error } = await supabase
      .from('admins')
      .insert({
        username,
        password: hashedPassword,
        email: null,
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Administrateur par défaut créé avec succès!');
    console.log(`Username: ${admin.username}`);
    console.log(`ID: ${admin.id}`);
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
    process.exit(1);
  }
}

createDefaultAdmin();
