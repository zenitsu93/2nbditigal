/**
 * Système de cache simple en mémoire pour améliorer les performances
 * Cache les réponses des requêtes GET fréquentes
 */

class SimpleCache {
  constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutes par défaut
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Génère une clé de cache à partir d'une URL et de paramètres
   */
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${url}${sortedParams ? `?${sortedParams}` : ''}`;
  }

  /**
   * Récupère une valeur du cache
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Vérifier si l'item a expiré
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Stocke une valeur dans le cache
   */
  set(key, value, ttl = null) {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Supprime une clé du cache
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Supprime toutes les clés qui correspondent à un pattern
   */
  deletePattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Vide tout le cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Nettoie les entrées expirées
   */
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Retourne la taille du cache
   */
  size() {
    return this.cache.size;
  }
}

// Instance globale du cache
const cache = new SimpleCache(5 * 60 * 1000); // 5 minutes TTL par défaut

// Nettoyer le cache toutes les 10 minutes
setInterval(() => {
  cache.cleanup();
}, 10 * 60 * 1000);

export default cache;
