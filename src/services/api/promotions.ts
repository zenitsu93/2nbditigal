import { apiClient } from './client';

export interface Promotion {
  id: number;
  title: string;
  description: string;
  image?: string;
  icon?: string;
  cta_text: string;
  cta_link: string;
  active: boolean;
  start_date?: string;
  end_date?: string;
  createdAt: string;
  updatedAt: string;
}

export const promotionsApi = {
  getActive: async (): Promise<Promotion | null> => {
    return apiClient.get<Promotion | null>('/promotions/active');
  },

  getAll: async (): Promise<Promotion[]> => {
    return apiClient.get<Promotion[]>('/promotions');
  },

  getById: async (id: number): Promise<Promotion> => {
    return apiClient.get<Promotion>(`/promotions/${id}`);
  },

  create: async (data: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>): Promise<Promotion> => {
    return apiClient.post<Promotion>('/promotions', data);
  },

  update: async (id: number, data: Partial<Promotion>): Promise<Promotion> => {
    return apiClient.put<Promotion>(`/promotions/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/promotions/${id}`);
  },
};
