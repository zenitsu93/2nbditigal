import { apiClient } from './client';

export interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
  video?: string;
  category: string;
  tags: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

export const projectsApi = {
  getAll: async (category?: string): Promise<Project[]> => {
    const query = category && category !== 'Tous' ? `?category=${encodeURIComponent(category)}` : '';
    return apiClient.get<Project[]>(`/projects${query}`);
  },

  getById: async (id: number): Promise<Project> => {
    return apiClient.get<Project>(`/projects/${id}`);
  },

  create: async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    return apiClient.post<Project>('/projects', data);
  },

  update: async (id: number, data: Partial<Project>): Promise<Project> => {
    return apiClient.put<Project>(`/projects/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/projects/${id}`);
  },
};

