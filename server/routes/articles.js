import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import supabase from '../lib/supabase.js';

const router = express.Router();

// GET all articles
router.get('/', async (req, res) => {
  try {
    const { published, category } = req.query;
    let query = supabase.from('articles').select('*');

    if (published !== undefined) {
      query = query.eq('published', published === 'true');
    }

    if (category) {
      query = query.eq('category', category);
    }

    query = query.order('date', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET article by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Article not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: error.message });
  }
});

// CREATE article (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, excerpt, content, image, video, author, category, tags, published, date } = req.body;

    if (!title || !excerpt || !content || !author || !category) {
      return res.status(400).json({ error: 'Title, excerpt, content, author and category are required' });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title,
        excerpt,
        content,
        image: image || null,
        video: video || null,
        author,
        category,
        tags: tags || [],
        published: published || false,
        date: date ? new Date(date).toISOString() : now,
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE article (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, image, video, author, category, tags, published, date } = req.body;

    const updateData = { updatedAt: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (image !== undefined) updateData.image = image || null;
    if (video !== undefined) updateData.video = video || null;
    if (author !== undefined) updateData.author = author;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags || [];
    if (published !== undefined) updateData.published = published;
    if (date !== undefined) updateData.date = new Date(date).toISOString();

    const { data, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Article not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE article (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
