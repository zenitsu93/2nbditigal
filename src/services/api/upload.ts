import { apiClient } from './client';

export interface UploadResponse {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
}

export const uploadApi = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    // Récupérer le token d'authentification
    const token = localStorage.getItem('auth_token');
    
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const getApiUrl = () => {
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
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  deleteFile: async (filename: string): Promise<void> => {
    return apiClient.delete<void>(`/upload/${filename}`);
  },
};

