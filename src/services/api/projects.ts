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

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const projectsApi = {
  getAll: async (category?: string, limit?: number, offset?: number): Promise<Project[]> => {
    const params = new URLSearchParams();
    if (category && category !== 'Tous') params.append('category', category);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    
    const response = await apiClient.get<Project[] | PaginatedResponse<Project>>(`/projects${query}`);
    
    // Compatibilité: si la réponse est paginée, extraire les données
    if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as PaginatedResponse<Project>).data)) {
      return (response as PaginatedResponse<Project>).data;
    }
    
    // Sinon, retourner directement (ancien format)
    return response as Project[];
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

