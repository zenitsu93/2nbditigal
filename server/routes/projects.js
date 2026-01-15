import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import supabase from '../lib/supabase.js';

const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = supabase.from('projects').select('*');

    if (category && category !== 'Tous') {
      query = query.eq('category', category);
    }

    query = query.order('date', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Project not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: error.message });
  }
});

// CREATE project (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, image, video, category, tags, date } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description and category are required' });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        image: image || null,
        video: video || null,
        category,
        tags: tags || [],
        date: date ? new Date(date).toISOString() : now,
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE project (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, video, category, tags, date } = req.body;

    const updateData = { updatedAt: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image || null;
    if (video !== undefined) updateData.video = video || null;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags || [];
    if (date !== undefined) updateData.date = new Date(date).toISOString();

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Project not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE project (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
