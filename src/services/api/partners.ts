import { apiClient } from './client';

export interface Partner {
  id: number;
  name: string;
  logo: string;
  website: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartnerData {
  name: string;
  logo: string;
  website?: string;
}

export interface UpdatePartnerData {
  name?: string;
  logo?: string;
  website?: string;
}

export const partnersApi = {
  getAll: async (): Promise<Partner[]> => {
    return apiClient.get<Partner[]>('/partners');
  },

  getById: async (id: number): Promise<Partner> => {
    return apiClient.get<Partner>(`/partners/${id}`);
  },

  create: async (data: CreatePartnerData): Promise<Partner> => {
    return apiClient.post<Partner>('/partners', data);
  },

  update: async (id: number, data: UpdatePartnerData): Promise<Partner> => {
    return apiClient.put<Partner>(`/partners/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/partners/${id}`);
  },
};

