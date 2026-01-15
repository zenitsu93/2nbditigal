import jwt from 'jsonwebtoken';
import supabase from '../lib/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token d\'authentification manquant' });
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

      // Ajouter les informations de l'admin à la requête
      req.admin = {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      };

      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Erreur d\'authentification' });
  }
};
