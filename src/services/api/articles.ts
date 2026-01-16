import { apiClient } from './client';

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  video?: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateArticleInput = Omit<Article, 'id' | 'slug' | 'createdAt' | 'updatedAt'> & { slug?: string };

export const articlesApi = {
  getAll: async (published?: boolean, category?: string, limit?: number, offset?: number): Promise<Article[]> => {
    const params = new URLSearchParams();
    if (published !== undefined) params.append('published', published.toString());
    if (category) params.append('category', category);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    
    const response = await apiClient.get<any>(`/articles${query}`);
    
    // Compatibilité: si la réponse est paginée, extraire les données
    if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
      return response.data;
    }
    
    // Si c'est déjà un tableau, le retourner directement
    if (Array.isArray(response)) {
      return response;
    }
    
    // Sinon, retourner un tableau vide en cas d'erreur
    console.warn('Unexpected response format from articles API:', response);
    return [];
  },

  getById: async (id: number): Promise<Article> => {
    return apiClient.get<Article>(`/articles/${id}`);
  },

  getBySlug: async (slug: string): Promise<Article> => {
    return apiClient.get<Article>(`/articles/${slug}`);
  },

  create: async (data: CreateArticleInput): Promise<Article> => {
    return apiClient.post<Article>('/articles', data);
  },

  update: async (id: number, data: Partial<Article>): Promise<Article> => {
    return apiClient.put<Article>(`/articles/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/articles/${id}`);
  },
};

