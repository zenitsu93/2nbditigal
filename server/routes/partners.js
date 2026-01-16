import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import supabase from '../lib/supabase.js';

const router = express.Router();

// GET all partners avec cache (partenaires changent rarement)
router.get('/', cacheMiddleware(15 * 60 * 1000), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('id, name, logo, website, createdAt, updatedAt')
      .order('createdAt', { ascending: false })
      .limit(100); // Limite raisonnable

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET partner by ID avec cache
router.get('/:id', cacheMiddleware(15 * 60 * 1000), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Partner not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST create partner (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, logo, website } = req.body;

    if (!name || !logo) {
      return res.status(400).json({ error: 'Le nom et le logo sont requis' });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('partners')
      .insert({
        name: name.trim(),
        logo: logo.trim(),
        website: website?.trim() || null,
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return res.status(400).json({ error: 'Un partenaire avec ce nom existe déjà' });
      }
      throw error;
    }

    // Invalider le cache des partenaires
    invalidateCache('/api/partners');
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ error: error.message || 'Error creating partner' });
  }
});

// PUT update partner (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, logo, website } = req.body;

    const updateData = { updatedAt: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (logo !== undefined) updateData.logo = logo;
    if (website !== undefined) updateData.website = website || null;

    const { data, error } = await supabase
      .from('partners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Partner not found' });
      }
      throw error;
    }

    // Invalider le cache des partenaires
    invalidateCache('/api/partners');
    invalidateCache(`/api/partners/${id}`);

    res.json(data);
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ error: error.message || 'Error updating partner' });
  }
});

// DELETE partner (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Invalider le cache des partenaires
    invalidateCache('/api/partners');
    invalidateCache(`/api/partners/${id}`);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ error: error.message || 'Error deleting partner' });
  }
});

export default router;
