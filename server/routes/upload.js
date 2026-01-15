import express from 'express';
import multer from 'multer';
import supabase from '../lib/supabase.js';
import path from 'path';
import crypto from 'crypto';

const router = express.Router();

// Configuration de multer pour la mémoire (on upload directement vers Supabase)
const storage = multer.memoryStorage();

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  // Autoriser images et vidéos
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|ogg|mov/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers images (jpeg, jpg, png, gif, webp) et vidéos (mp4, webm, ogg, mov) sont autorisés!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  },
  fileFilter: fileFilter
});

// Route pour uploader un fichier vers Supabase Storage
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    // Générer un nom de fichier unique
    const ext = path.extname(req.file.originalname);
    const uniqueId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueId}${ext}`;
    const filePath = `uploads/${filename}`;

    // Uploader vers Supabase Storage
    const { data, error } = await supabase.storage
      .from('files')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Error uploading to Supabase Storage:', error);
      if (error.message && error.message.includes('Bucket not found')) {
        return res.status(500).json({ 
          error: 'Bucket "files" non trouvé dans Supabase Storage. Veuillez créer le bucket "files" dans Supabase Dashboard → Storage. Consultez CREER_BUCKET_SUPABASE.md pour les instructions.' 
        });
      }
      return res.status(500).json({ error: error.message || 'Erreur lors de l\'upload vers Supabase Storage' });
    }

    // Obtenir l'URL publique du fichier
    const { data: urlData } = supabase.storage
      .from('files')
      .getPublicUrl(filePath);

    // S'assurer que l'URL est bien formatée
    const publicUrl = urlData.publicUrl;
    console.log('✅ Fichier uploadé vers Supabase Storage:', {
      path: filePath,
      url: publicUrl,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    res.json({
      url: publicUrl,
      filename: filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error.message || 'Erreur lors de l\'upload du fichier' });
  }
});

// Route pour supprimer un fichier de Supabase Storage
router.delete('/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = `uploads/${filename}`;

    const { error } = await supabase.storage
      .from('files')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting from Supabase Storage:', error);
      return res.status(500).json({ error: error.message || 'Erreur lors de la suppression du fichier' });
    }

    res.json({ message: 'Fichier supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
