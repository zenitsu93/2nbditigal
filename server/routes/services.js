import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import supabase from '../lib/supabase.js';

const router = express.Router();

// GET all services avec cache (services changent rarement, cache plus long)
router.get('/', cacheMiddleware(10 * 60 * 1000), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('id, title, description, image, features, createdAt, updatedAt')
      .order('createdAt', { ascending: true })
      .limit(100); // Limite raisonnable

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET service by ID avec cache
router.get('/:id', cacheMiddleware(10 * 60 * 1000), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Service not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: error.message });
  }
});

// CREATE service (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, image, features } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('services')
      .insert({
        title,
        description,
        image: image || null,
        features: Array.isArray(features) ? features : [],
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single();

    if (error) throw error;
    
    // Invalider le cache des services
    invalidateCache('/api/services');
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE service (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, features } = req.body;

    const updateData = { updatedAt: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image || null;
    if (features !== undefined) updateData.features = Array.isArray(features) ? features : [];

    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Service not found' });
      }
      throw error;
    }

    // Invalider le cache des services
    invalidateCache('/api/services');
    invalidateCache(`/api/services/${id}`);

    res.json(data);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE service (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Invalider le cache des services
    invalidateCache('/api/services');
    invalidateCache(`/api/services/${id}`);

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
