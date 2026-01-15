import { getApiBaseUrl } from './client';

const API_BASE_URL = getApiBaseUrl();

export interface SiteConfig {
  [key: string]: string | null;
}

export const configApi = {
  getAll: async (): Promise<SiteConfig> => {
    const response = await fetch(`${API_BASE_URL}/api/config`);
    if (!response.ok) {
      throw new Error('Failed to fetch config');
    }
    return response.json();
  },

  get: async (key: string): Promise<{ key: string; value: string | null }> => {
    const response = await fetch(`${API_BASE_URL}/api/config/${key}`);
    if (!response.ok) {
      throw new Error('Failed to fetch config');
    }
    return response.json();
  },

  update: async (key: string, value: string): Promise<{ key: string; value: string | null }> => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/config/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ value }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update config');
    }

    return response.json();
  },
};
