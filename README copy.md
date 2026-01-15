# 2NB Digital - Site Web

Application web full-stack avec React + Vite (frontend) et Express + Supabase (backend).

## 🚀 Développement local

### Prérequis

- Node.js (v18 ou supérieur)
- Un compte Supabase (gratuit) : [supabase.com](https://supabase.com)

### Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd site-2nb
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   cd server && npm install
   ```

3. **Configurer Supabase**
   - Créez un projet sur [supabase.com](https://supabase.com)
   - Dans Supabase Dashboard → SQL Editor, exécutez le script `server/supabase-schema.sql`
   - Créez un bucket Storage nommé `files` (public) pour les uploads
   - Notez votre URL et vos clés API

4. **Configurer les variables d'environnement**
   
   Créez un fichier `.env` à la racine du projet :
   ```env
   # Supabase
   SUPABASE_URL=https://votre-projet.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
   
   # JWT
   JWT_SECRET=votre-secret-jwt-super-securise-et-long
   
   # Server
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

5. **Créer l'administrateur par défaut**
   ```bash
   cd server
   npm run create-default-admin
   ```
   
   Cela créera un admin avec :
   - Username: `xxxxxxxxxxx`
   - Password: `xxxxxxxxxxx`

6. **Créer un nouvel administrateur** (optionnel)
   ```bash
   cd server
   npm run create-admin <username> <password> [email]
   ```
   
   Exemple :
   ```bash
   npm run create-admin monuser monpassword123 mon@email.com
   ```

7. **Lancer le projet**
   
   **Terminal 1 - Backend** :
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Frontend** :
   ```bash
   npm run dev
   ```

Le backend sera disponible sur `http://localhost:3001`  
Le frontend sera disponible sur `http://localhost:5173`

## 📦 Commandes utiles

```bash
# Démarrer le backend en mode développement
cd server && npm run dev

# Démarrer le backend en production
cd server && npm start

# Créer un admin par défaut
cd server && npm run create-default-admin

# Créer un nouvel admin
cd server && npm run create-admin <username> <password> [email]

# Build du frontend
npm run build
```

## 🏗️ Structure du projet

```
├── server/              # Backend Express + Supabase
│   ├── lib/
│   │   └── supabase.js  # Client Supabase
│   ├── routes/          # Routes API
│   ├── middleware/      # Middleware Express
│   ├── scripts/         # Scripts utilitaires
│   └── supabase-schema.sql  # Script SQL pour créer les tables
├── src/                 # Frontend React + TypeScript
└── public/              # Assets statiques
```

## 🔧 Technologies

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Flowbite
- **Backend**: Express, Supabase (PostgreSQL)
- **Base de données**: Supabase (PostgreSQL)
- **Stockage**: Supabase Storage

## 📝 Notes importantes

- Les fichiers `.env` ne doivent jamais être commités
- Utilisez `SUPABASE_SERVICE_ROLE_KEY` pour avoir tous les droits sur la base de données
- Changez le mot de passe de l'admin par défaut après la première connexion
- Les fichiers uploadés sont stockés dans Supabase Storage (bucket `files`)
