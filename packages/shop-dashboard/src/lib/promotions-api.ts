import { api } from './api';

export interface Promotion {
  id: string;
  shopId: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'bogo' | 'freebie';
  discountValue: number;
  targetAllLocations: boolean;
  targetLocationIds: string[];
  radiusMeters: number;
  maxRedemptionsPerUser?: number | null;
  maxTotalRedemptions?: number | null;
  startDate: string;
  endDate: string;
  isDiscoveryOffer: boolean;
  terms?: string | null;
  status: 'draft' | 'active' | 'paused' | 'expired';
  createdAt: string;
  updatedAt: string;
  _count?: {
    redemptions: number;
  };
}

export interface CreatePromotionInput {
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'bogo' | 'freebie';
  discountValue: number;
  targetAllLocations: boolean;
  targetLocationIds?: string[];
  radiusMeters: number;
  maxRedemptionsPerUser?: number;
  maxTotalRedemptions?: number;
  startDate: string;
  endDate: string;
  isDiscoveryOffer?: boolean;
  terms?: string;
}

export interface UpdatePromotionInput extends Partial<CreatePromotionInput> {
  status?: 'draft' | 'active' | 'paused' | 'expired';
}

export const promotionsApi = {
  // Get all promotions for the shop
  getAll: async () => {
    const response = await api.get('/shops/promotions');
    return response.data;
  },

  // Get a single promotion by ID
  getById: async (id: string) => {
    const response = await api.get(`/shops/promotions/${id}`);
    return response.data;
  },

  // Create a new promotion
  create: async (data: CreatePromotionInput) => {
    const response = await api.post('/shops/promotions', data);
    return response.data;
  },

  // Update a promotion
  update: async (id: string, data: UpdatePromotionInput) => {
    const response = await api.put(`/shops/promotions/${id}`, data);
    return response.data;
  },

  // Delete a promotion
  delete: async (id: string) => {
    const response = await api.delete(`/shops/promotions/${id}`);
    return response.data;
  },

  // Activate a promotion
  activate: async (id: string) => {
    const response = await api.post(`/shops/promotions/${id}/activate`);
    return response.data;
  },

  // Pause a promotion
  pause: async (id: string) => {
    const response = await api.post(`/shops/promotions/${id}/pause`);
    return response.data;
  },

  // Get promotion statistics
  getStats: async (id: string) => {
    const response = await api.get(`/shops/promotions/${id}/stats`);
    return response.data;
  },
};
