import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import supabase from '../lib/supabase.js';

const router = express.Router();

// GET all testimonials
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET testimonial by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: error.message });
  }
});

// CREATE testimonial (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, role, company, image, content, rating } = req.body;

    if (!name || !role || !company || !content) {
      return res.status(400).json({ error: 'Name, role, company and content are required' });
    }

    const validRating = rating && rating >= 1 && rating <= 5 ? rating : 5;
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        name,
        role,
        company,
        image: image || null,
        content,
        rating: validRating,
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE testimonial (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, company, image, content, rating } = req.body;

    const updateData = { updatedAt: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (company !== undefined) updateData.company = company;
    if (image !== undefined) updateData.image = image || null;
    if (content !== undefined) updateData.content = content;
    if (rating !== undefined) {
      updateData.rating = rating >= 1 && rating <= 5 ? rating : 5;
    }

    const { data, error } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE testimonial (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
