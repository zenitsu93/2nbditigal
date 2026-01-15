import { apiClient } from './client';

export interface Service {
  id: number;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    return apiClient.get<Service[]>('/services');
  },

  getById: async (id: number): Promise<Service> => {
    return apiClient.get<Service>(`/services/${id}`);
  },

  create: async (data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> => {
    return apiClient.post<Service>('/services', data);
  },

  update: async (id: number, data: Partial<Service>): Promise<Service> => {
    return apiClient.put<Service>(`/services/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/services/${id}`);
  },
};

