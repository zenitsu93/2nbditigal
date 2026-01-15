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

export const articlesApi = {
  getAll: async (published?: boolean, category?: string): Promise<Article[]> => {
    const params = new URLSearchParams();
    if (published !== undefined) params.append('published', published.toString());
    if (category) params.append('category', category);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<Article[]>(`/articles${query}`);
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

