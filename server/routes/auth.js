import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../lib/supabase.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username et mot de passe requis' });
    }

    // Trouver l'admin par username
    const { data: admin, error } = await supabase
      .from('admins')
      .select('id, username, email, password')
      .eq('username', username)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Retourner les informations (sans le mot de passe)
    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({
      error: 'Erreur lors de la connexion',
      message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : error.message
    });
  }
});

// POST /api/auth/verify
router.post('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Vérifier que l'admin existe toujours
      const { data: admin, error } = await supabase
        .from('admins')
        .select('id, username, email')
        .eq('id', decoded.id)
        .single();

      if (error || !admin) {
        return res.status(401).json({ error: 'Admin introuvable' });
      }

      res.json({ valid: true, admin });
    } catch (error) {
      return res.status(401).json({ error: 'Token invalide' });
    }
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification' });
  }
});

// POST /api/auth/logout (optionnel, côté client on supprime juste le token)
router.post('/logout', (req, res) => {
  res.json({ message: 'Déconnexion réussie' });
});

export default router;
