import cache from '../utils/cache.js';

/**
 * Middleware de cache pour les routes GET
 * @param {number} ttl - Temps de vie du cache en millisecondes (défaut: 5 minutes)
 * @param {boolean} skipCache - Si true, ignore le cache (pour les requêtes admin)
 */
export const cacheMiddleware = (ttl = 5 * 60 * 1000, skipCache = false) => {
  return async (req, res, next) => {
    // Ne mettre en cache que les requêtes GET
    if (req.method !== 'GET' || skipCache) {
      return next();
    }

    // Ignorer le cache si le paramètre _t (timestamp) est présent
    if (req.query._t) {
      return next();
    }

    // Générer la clé de cache
    const cacheKey = cache.generateKey(req.originalUrl, req.query);

    // Vérifier le cache
    const cachedData = cache.get(cacheKey);
    if (cachedData !== null) {
      // Headers de cache HTTP pour le navigateur
      const maxAge = Math.floor(ttl / 1000); // Convertir en secondes
      res.setHeader('Cache-Control', `public, max-age=${maxAge}, s-maxage=${maxAge}`);
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedData);
    }

    // Intercepter res.json pour mettre en cache la réponse
    const originalJson = res.json.bind(res);
    res.json = function(data) {
      // Mettre en cache uniquement les réponses réussies
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(cacheKey, data, ttl);
        
        // Headers de cache HTTP pour le navigateur
        const maxAge = Math.floor(ttl / 1000); // Convertir en secondes
        res.setHeader('Cache-Control', `public, max-age=${maxAge}, s-maxage=${maxAge}`);
        res.setHeader('X-Cache', 'MISS');
      }
      return originalJson(data);
    };

    next();
  };
};

/**
 * Invalide le cache pour une route spécifique
 */
export const invalidateCache = (pattern) => {
  cache.deletePattern(pattern);
};

export default cacheMiddleware;
