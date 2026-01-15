import { apiClient } from './client';

export interface Admin {
  id: number;
  username: string;
  email?: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface VerifyResponse {
  valid: boolean;
  admin: Admin;
}

export interface RegisterResponse {
  token: string;
  admin: Admin;
}

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', { username, password });
  },

  register: async (username: string, password: string, email?: string): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>('/auth/register', { username, password, email });
  },

  verify: async (token: string): Promise<VerifyResponse> => {
    // Créer une requête manuelle pour éviter la double inclusion du token
    const getApiBaseUrl = () => {
      const viteApiUrl = import.meta.env.VITE_API_URL?.trim() || '';
      // Détecter si on est en développement local
      const isLocalDev = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '');
      
      if (isLocalDev) {
        return 'http://localhost:3001/api';
      }
      if (viteApiUrl) {
        // Détecter et corriger les URLs absolues incorrectes
        if (viteApiUrl.startsWith('http://') || viteApiUrl.startsWith('https://')) {
          return '/api';
        }
        return viteApiUrl;
      }
      return '/api';
    };
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token invalide');
    }

    return response.json();
  },

  logout: async (): Promise<void> => {
    return apiClient.post<void>('/auth/logout');
  },
};
