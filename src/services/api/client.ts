// Pour Vercel, utiliser /api si VITE_API_URL n'est pas définie ou est vide
// En développement local, utiliser http://localhost:3001/api
const getApiClientBaseUrl = () => {
  const viteApiUrl = import.meta.env.VITE_API_URL?.trim() || '';
  
  // Détecter si on est en développement local (plus fiable que import.meta.env.DEV)
  // On vérifie si on est sur localhost dans le navigateur
  const isLocalDev = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname === '');
  
  // En développement local, toujours utiliser localhost
  if (isLocalDev) {
    return 'http://localhost:3001/api';
  }
  
  // Si VITE_API_URL est définie et n'est pas vide
  if (viteApiUrl) {
    // Si c'est une URL absolue avec un domaine différent, c'est une erreur de configuration
    // On la détecte et on utilise /api à la place
    if (viteApiUrl.startsWith('http://') || viteApiUrl.startsWith('https://')) {
      console.warn('⚠️ VITE_API_URL contient une URL absolue:', viteApiUrl);
      console.warn('⚠️ Sur Vercel, utilisez une URL relative (/api) ou laissez vide');
      console.warn('⚠️ Utilisation de /api à la place');
      return '/api';
    }
    // Si c'est une URL relative (/api), l'utiliser
    return viteApiUrl;
  }
  
  // Par défaut en production (Vercel), utiliser /api (URL relative)
  return '/api';
};

const API_BASE_URL = getApiClientBaseUrl();

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Ajouter les headers personnalisés
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        headers[key] = value as string;
      });
    }

    // Ajouter le token d'authentification si disponible et non déjà défini
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: response.statusText };
        }
        const error = new Error(errorData.error || `HTTP error! status: ${response.status}`);
        (error as any).response = { data: errorData, status: response.status };
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

/**
 * Obtient l'URL de base pour construire les URLs complètes des fichiers uploadés
 * - Si VITE_API_URL est une URL absolue (http://...), retourne l'URL sans /api
 * - Si VITE_API_URL est relative (/api) ou vide, retourne une chaîne vide pour utiliser des URLs relatives
 * - En développement, retourne http://localhost:3001
 */
export function getApiBaseUrl(): string {
  const viteApiUrl = import.meta.env.VITE_API_URL?.trim() || '';
  
  // Détecter si on est en développement local (plus fiable que import.meta.env.DEV)
  const isLocalDev = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname === '');
  
  // En développement local, utiliser localhost
  if (isLocalDev) {
    return 'http://localhost:3001';
  }
  
  // Si VITE_API_URL est définie et n'est pas vide
  if (viteApiUrl) {
    // Si c'est une URL absolue avec un domaine différent, c'est une erreur de configuration
    // On la détecte et on retourne une chaîne vide pour utiliser des URLs relatives
    if (viteApiUrl.startsWith('http://') || viteApiUrl.startsWith('https://')) {
      // Retirer /api à la fin si présent, mais comme c'est une erreur de config,
      // on retourne une chaîne vide pour utiliser des URLs relatives
      return '';
    }
    // Si c'est une URL relative (/api), retourner une chaîne vide
    // pour que les URLs soient relatives au domaine actuel
    return '';
  }
  
  // Par défaut en production (Vercel), retourner une chaîne vide pour utiliser des URLs relatives
  return '';
}

