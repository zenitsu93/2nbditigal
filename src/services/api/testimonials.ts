import { apiClient } from './client';

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image?: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export const testimonialsApi = {
  getAll: async (): Promise<Testimonial[]> => {
    return apiClient.get<Testimonial[]>('/testimonials');
  },

  getById: async (id: number): Promise<Testimonial> => {
    return apiClient.get<Testimonial>(`/testimonials/${id}`);
  },

  create: async (data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<Testimonial> => {
    return apiClient.post<Testimonial>('/testimonials', data);
  },

  update: async (id: number, data: Partial<Testimonial>): Promise<Testimonial> => {
    return apiClient.put<Testimonial>(`/testimonials/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/testimonials/${id}`);
  },
};
