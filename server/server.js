import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serviceRoutes from './routes/services.js';
import projectRoutes from './routes/projects.js';
import articleRoutes from './routes/articles.js';
import partnerRoutes from './routes/partners.js';
import testimonialRoutes from './routes/testimonials.js';
import uploadRoutes from './routes/upload.js';
import authRoutes from './routes/auth.js';
import configRoutes from './routes/config.js';
import { authenticateToken } from './middleware/auth.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger le .env depuis la racine du projet
const rootDir = join(__dirname, '..');
dotenv.config({ path: join(rootDir, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) || `http://localhost:${PORT}`;
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

// Middleware CORS
const corsOptions = isProduction
  ? {
      origin: (origin, callback) => {
        if (!origin || origin === FRONTEND_URL || origin.includes(FRONTEND_URL.replace('https://', '').replace('http://', ''))) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true
    }
  : {
      origin: FRONTEND_URL,
      credentials: true
    };

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du frontend (dist/)
const frontendDir = join(__dirname, '..', 'dist');
if (fs.existsSync(frontendDir)) {
  app.use(express.static(frontendDir, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    index: false,
  }));
  console.log('📁 Frontend statique servi depuis:', frontendDir);
}

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/config', configRoutes);
app.use('/api/upload', authenticateToken, uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is running',
    database: 'Supabase'
  });
});

// Health check avec test DB
app.get('/api/health/db', async (req, res) => {
  try {
    const supabase = (await import('./lib/supabase.js')).default;
    const { error } = await supabase.from('services').select('id').limit(1);
    
    if (error) throw error;
    
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Health check DB failed:', error.message);
    res.status(503).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message
    });
  }
});

// Servir le frontend React pour toutes les routes non-API (SPA routing)
if (fs.existsSync(frontendDir)) {
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    
    const requestedPath = join(frontendDir, req.path);
    if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
      return res.sendFile(requestedPath);
    }
    
    res.sendFile(join(frontendDir, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export pour Vercel Serverless Functions
export default app;

// Start server seulement si pas sur Vercel
if (!process.env.VERCEL && typeof PhusionPassenger === 'undefined') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Frontend URL: ${FRONTEND_URL}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('👋 Shutting down gracefully...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('👋 Shutting down gracefully...');
    process.exit(0);
  });
}

// Support Passenger (O2Switch)
if (typeof PhusionPassenger !== 'undefined') {
  PhusionPassenger.configure({ autoInstall: false });
  app.listen('passenger', () => {
    console.log('🚀 Server running on Passenger (O2Switch)');
    console.log(`📁 Frontend URL: ${FRONTEND_URL}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
}
