import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import { generateSlug, generateUniqueSlug } from '../utils/slug.js';
import supabase from '../lib/supabase.js';

const router = express.Router();

// GET all articles avec pagination et cache
router.get('/', cacheMiddleware(5 * 60 * 1000), async (req, res) => {
  try {
    const { published, category, limit = '50', offset = '0' } = req.query;
    
    // Limiter à 100 articles max par requête
    const limitNum = Math.min(parseInt(limit) || 50, 100);
    const offsetNum = parseInt(offset) || 0;
    
    let query = supabase
      .from('articles')
      .select('id, title, slug, excerpt, image, video, author, category, tags, published, date, createdAt, updatedAt', { count: 'exact' });

    if (published !== undefined) {
      query = query.eq('published', published === 'true');
    }

    if (category) {
      query = query.eq('category', category);
    }

    query = query
      .order('date', { ascending: false })
      .range(offsetNum, offsetNum + limitNum - 1);

    const { data, error, count } = await query;

    if (error) throw error;
    
    res.json({
      data: data || [],
      pagination: {
        total: count || 0,
        limit: limitNum,
        offset: offsetNum,
        hasMore: count ? offsetNum + limitNum < count : false
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET article by ID ou slug avec cache
router.get('/:identifier', cacheMiddleware(10 * 60 * 1000), async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Déterminer si c'est un ID numérique ou un slug
    const isNumeric = /^\d+$/.test(identifier);
    
    let query = supabase.from('articles').select('id, title, slug, excerpt, content, image, video, author, category, tags, published, date, createdAt, updatedAt');
    
    if (isNumeric) {
      query = query.eq('id', parseInt(identifier));
    } else {
      query = query.eq('slug', identifier);
    }
    
    const { data, error } = await query.single();

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
    const { title, excerpt, content, image, video, author, category, tags, published, date, slug } = req.body;

    if (!title || !excerpt || !content || !author || !category) {
      return res.status(400).json({ error: 'Title, excerpt, content, author and category are required' });
    }

    // Générer un slug si non fourni
    let articleSlug = slug || generateSlug(title);
    
    // Vérifier l'unicité du slug
    const checkSlugExists = async (s) => {
      const { data, error } = await supabase.from('articles').select('id').eq('slug', s).maybeSingle();
      // Si error existe ou data existe, le slug est pris
      return !error && data !== null;
    };
    
    articleSlug = await generateUniqueSlug(articleSlug, checkSlugExists);

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title,
        slug: articleSlug,
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
    
    // Invalider le cache des articles
    invalidateCache('/api/articles');
    
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
    const { title, excerpt, content, image, video, author, category, tags, published, date, slug } = req.body;

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
    
    // Générer un nouveau slug si le titre change ou si un slug est fourni
    if (slug !== undefined) {
      updateData.slug = slug;
    } else if (title !== undefined) {
      // Vérifier l'unicité du slug
      const checkSlugExists = async (s) => {
        const { data, error } = await supabase.from('articles').select('id').eq('slug', s).neq('id', parseInt(id)).maybeSingle();
        // Si error existe ou data existe, le slug est pris
        return !error && data !== null;
      };
      updateData.slug = await generateUniqueSlug(generateSlug(title), checkSlugExists);
    }

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

    // Invalider le cache des articles
    invalidateCache('/api/articles');
    invalidateCache(`/api/articles/${id}`);
    if (data.slug) {
      invalidateCache(`/api/articles/${data.slug}`);
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

    // Invalider le cache des articles
    invalidateCache('/api/articles');
    invalidateCache(`/api/articles/${id}`);

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
