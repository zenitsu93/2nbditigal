import { apiClient } from './client';

export interface Article {
  id: number;
  title: string;
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

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const articlesApi = {
  getAll: async (published?: boolean, category?: string, limit?: number, offset?: number): Promise<Article[]> => {
    const params = new URLSearchParams();
    if (published !== undefined) params.append('published', published.toString());
    if (category) params.append('category', category);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    
    const response = await apiClient.get<Article[] | PaginatedResponse<Article>>(`/articles${query}`);
    
    // Compatibilité: si la réponse est paginée, extraire les données
    if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as PaginatedResponse<Article>).data)) {
      return (response as PaginatedResponse<Article>).data;
    }
    
    // Sinon, retourner directement (ancien format)
    return response as Article[];
  },

  getById: async (id: number): Promise<Article> => {
    return apiClient.get<Article>(`/articles/${id}`);
  },

  create: async (data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> => {
    return apiClient.post<Article>('/articles', data);
  },

  update: async (id: number, data: Partial<Article>): Promise<Article> => {
    return apiClient.put<Article>(`/articles/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/articles/${id}`);
  },
};

