import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import supabase from '../lib/supabase.js';

const router = express.Router();

// GET active promotions (public)
router.get('/active', cacheMiddleware(10 * 60 * 1000), async (req, res) => {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('active', true)
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order('createdAt', { ascending: false })
      .limit(1); // Une seule promotion active à la fois

    if (error) throw error;
    
    res.json(data && data.length > 0 ? data[0] : null);
  } catch (error) {
    console.error('Error fetching active promotion:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET all promotions (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET promotion by ID (admin only)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Promotion not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching promotion:', error);
    res.status(500).json({ error: error.message });
  }
});

// CREATE promotion (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, image, icon, cta_text, cta_link, active, start_date, end_date } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('promotions')
      .insert({
        title,
        description,
        image: image || null,
        icon: icon || null,
        cta_text: cta_text || 'Nous contacter',
        cta_link: cta_link || '/contact',
        active: active !== undefined ? active : true,
        start_date: start_date ? new Date(start_date).toISOString() : null,
        end_date: end_date ? new Date(end_date).toISOString() : null,
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single();

    if (error) throw error;
    
    // Invalider le cache des promotions
    invalidateCache('/api/promotions');
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE promotion (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, icon, cta_text, cta_link, active, start_date, end_date } = req.body;

    const updateData = { updatedAt: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image || null;
    if (icon !== undefined) updateData.icon = icon || null;
    if (cta_text !== undefined) updateData.cta_text = cta_text;
    if (cta_link !== undefined) updateData.cta_link = cta_link;
    if (active !== undefined) updateData.active = active;
    if (start_date !== undefined) updateData.start_date = start_date ? new Date(start_date).toISOString() : null;
    if (end_date !== undefined) updateData.end_date = end_date ? new Date(end_date).toISOString() : null;

    const { data, error } = await supabase
      .from('promotions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Promotion not found' });
      }
      throw error;
    }

    // Invalider le cache des promotions
    invalidateCache('/api/promotions');

    res.json(data);
  } catch (error) {
    console.error('Error updating promotion:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE promotion (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Invalider le cache des promotions
    invalidateCache('/api/promotions');

    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
