import { api } from './api';

export interface Location {
  id: string;
  shopId: string;
  name: string;
  address: string;
  city: string;
  state?: string | null;
  country: string;
  postalCode?: string | null;
  latitude: number;
  longitude: number;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocationInput {
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  isActive?: boolean;
}

export interface UpdateLocationInput {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  isActive?: boolean;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export const locationsApi = {
  // Get all locations for the shop
  getAll: async () => {
    const response = await api.get('/shops/locations');
    return response.data;
  },

  // Get a single location by ID
  getById: async (id: string) => {
    const response = await api.get(`/shops/locations/${id}`);
    return response.data;
  },

  // Create a new location
  create: async (data: CreateLocationInput) => {
    const response = await api.post('/shops/locations', data);
    return response.data;
  },

  // Update a location
  update: async (id: string, data: UpdateLocationInput) => {
    const response = await api.put(`/shops/locations/${id}`, data);
    return response.data;
  },

  // Delete a location
  delete: async (id: string) => {
    const response = await api.delete(`/shops/locations/${id}`);
    return response.data;
  },

  // Geocode an address
  geocode: async (address: string) => {
    const response = await api.post('/geocode', { address });
    return response.data;
  },
};
