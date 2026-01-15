import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import supabase from '../lib/supabase.js';

const router = express.Router();

// GET config (public pour la page d'accueil)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('key, value');

    if (error) throw error;

    // Convertir en objet pour faciliter l'utilisation
    const config = {};
    data.forEach(item => {
      config[item.key] = item.value;
    });

    res.json(config);
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET config par clé
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { data, error } = await supabase
      .from('site_config')
      .select('key, value')
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Config key not found' });
      }
      throw error;
    }

    res.json({ key: data.key, value: data.value });
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE config (admin only)
router.put('/:key', authenticateToken, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }

    const now = new Date().toISOString();
    
    // Vérifier si la clé existe
    const { data: existing } = await supabase
      .from('site_config')
      .select('id')
      .eq('key', key)
      .single();

    let result;
    if (existing) {
      // Mettre à jour
      const { data, error } = await supabase
        .from('site_config')
        .update({ value, updatedAt: now })
        .eq('key', key)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Créer
      const { data, error } = await supabase
        .from('site_config')
        .insert({ key, value, createdAt: now, updatedAt: now })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
