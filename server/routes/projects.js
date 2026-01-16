import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import { generateSlug, generateUniqueSlug } from '../utils/slug.js';
import supabase from '../lib/supabase.js';

const router = express.Router();

// GET all projects avec pagination et cache (TTL réduit pour permettre les mises à jour rapides)
router.get('/', cacheMiddleware(30 * 1000), async (req, res) => {
  try {
    const { category, limit = '50', offset = '0' } = req.query;
    
    // Limiter à 100 projets max par requête
    const limitNum = Math.min(parseInt(limit) || 50, 100);
    const offsetNum = parseInt(offset) || 0;
    
    let query = supabase
      .from('projects')
      .select('id, title, slug, description, image, video, category, tags, date, createdAt, updatedAt', { count: 'exact' });

    if (category && category !== 'Tous') {
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
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET project by ID ou slug avec cache
router.get('/:identifier', cacheMiddleware(10 * 60 * 1000), async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Déterminer si c'est un ID numérique ou un slug
    const isNumeric = /^\d+$/.test(identifier);
    
    let query = supabase.from('projects').select('*');
    
    if (isNumeric) {
      query = query.eq('id', parseInt(identifier));
    } else {
      query = query.eq('slug', identifier);
    }
    
    const { data, error } = await query.single();

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
    const { title, description, image, video, category, tags, date, slug } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description and category are required' });
    }

    // Générer un slug si non fourni
    let projectSlug = slug || generateSlug(title);
    
    // Vérifier l'unicité du slug
    const checkSlugExists = async (s) => {
      const { data, error } = await supabase.from('projects').select('id').eq('slug', s).maybeSingle();
      // Si error existe ou data existe, le slug est pris
      return !error && data !== null;
    };
    
    projectSlug = await generateUniqueSlug(projectSlug, checkSlugExists);

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        slug: projectSlug,
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
    
    // Invalider le cache des projets
    invalidateCache('/api/projects');
    
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
    const { title, description, image, video, category, tags, date, slug } = req.body;

    const updateData = { updatedAt: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image || null;
    if (video !== undefined) updateData.video = video || null;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags || [];
    if (date !== undefined) updateData.date = new Date(date).toISOString();
    
    // Générer un nouveau slug si le titre change ou si un slug est fourni
    if (slug !== undefined) {
      updateData.slug = slug;
    } else if (title !== undefined) {
      // Vérifier l'unicité du slug
      const checkSlugExists = async (s) => {
        const { data, error } = await supabase.from('projects').select('id').eq('slug', s).neq('id', parseInt(id)).maybeSingle();
        // Si error existe ou data existe, le slug est pris
        return !error && data !== null;
      };
      updateData.slug = await generateUniqueSlug(generateSlug(title), checkSlugExists);
    }

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

    // Invalider le cache des projets
    invalidateCache('/api/projects');
    invalidateCache(`/api/projects/${id}`);
    if (data.slug) {
      invalidateCache(`/api/projects/${data.slug}`);
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

    // Invalider le cache des projets
    invalidateCache('/api/projects');
    invalidateCache(`/api/projects/${id}`);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
