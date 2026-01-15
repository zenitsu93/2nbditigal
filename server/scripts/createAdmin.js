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

async function createAdmin() {
  try {
    // Récupérer les arguments de la ligne de commande
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.log('Usage: node scripts/createAdmin.js <username> <password> [email]');
      console.log('');
      console.log('Exemple:');
      console.log('  node scripts/createAdmin.js monuser monpassword123');
      console.log('  node scripts/createAdmin.js monuser monpassword123 mon@email.com');
      process.exit(1);
    }

    const username = args[0];
    const password = args[1];
    const email = args[2] || null;

    if (password.length < 6) {
      console.error('❌ Le mot de passe doit contenir au moins 6 caractères');
      process.exit(1);
    }

    // Vérifier si l'admin existe déjà
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('id, username')
      .eq('username', username)
      .single();

    if (existingAdmin) {
      console.log(`❌ L'administrateur "${username}" existe déjà`);
      process.exit(1);
    }

    // Vérifier si l'email existe déjà (si fourni)
    if (email) {
      const { data: existingEmail } = await supabase
        .from('admins')
        .select('id, username')
        .eq('email', email)
        .single();

      if (existingEmail) {
        console.log(`❌ L'email "${email}" est déjà utilisé par l'utilisateur "${existingEmail.username}"`);
        process.exit(1);
      }
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
        email: email || null,
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Administrateur créé avec succès!');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email || 'Non défini'}`);
    console.log(`   ID: ${admin.id}`);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error.message);
    process.exit(1);
  }
}

createAdmin();
