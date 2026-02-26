import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

const api = new ApiClient();

// Auth APIs
export const loginUser = async (emailOrPhone: string, password: string) => {
  return api.post<{ success: boolean; data: { user: any; accessToken: string; refreshToken: string; expiresIn: number } }>('/auth/users/login', { emailOrPhone, password });
};

export const registerUser = async (data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  password: string;
}) => {
  return api.post<{ success: boolean; data: { user: any; accessToken: string; refreshToken: string; expiresIn: number } }>('/auth/users/register', data);
};

export const refreshAccessToken = async (refreshToken: string) => {
  return api.post<{ success: boolean; data: { accessToken: string; refreshToken: string; expiresIn: number } }>('/auth/refresh', { refreshToken });
};

export const logoutUser = async () => {
  return api.post('/auth/logout');
};

// Location APIs
export const updateUserLocation = async (location: {
  latitude: number;
  longitude: number;
  accuracy?: number;
}) => {
  return api.post('/users/location', location);
};

// Promotion APIs
export const getNearbyPromotions = async (location: any, radiusMeters: number = 5000) => {
  return api.get<any[]>('/promotions/nearby', {
    latitude: location?.latitude,
    longitude: location?.longitude,
    radiusMeters,
  });
};

export const getPromotionById = async (id: string) => {
  return api.get<any>(`/promotions/${id}`);
};

// Shop APIs
export const getDiscoveryShops = async (location: any, mode: string) => {
  return api.get<any[]>('/shops/discovery', {
    latitude: location?.latitude,
    longitude: location?.longitude,
    mode,
  });
};

export const getShopById = async (id: string) => {
  return api.get<any>(`/shops/${id}`);
};

export const getFavoriteShops = async () => {
  return api.get<any[]>('/users/favorites/shops');
};

export const addFavoriteShop = async (shopId: string) => {
  return api.post(`/users/favorites/shops/${shopId}`);
};

export const removeFavoriteShop = async (shopId: string) => {
  return api.delete(`/users/favorites/shops/${shopId}`);
};

// Promotion favorites
export const getFavoritePromotions = async () => {
  return api.get<any[]>('/users/favorites/promotions');
};

export const addFavoritePromotion = async (promotionId: string) => {
  return api.post(`/users/favorites/promotions/${promotionId}`);
};

export const removeFavoritePromotion = async (promotionId: string) => {
  return api.delete(`/users/favorites/promotions/${promotionId}`);
};

// Notifications
export const registerPushToken = async (token: string) => {
  return api.post('/users/push-token', { token });
};

// Redemptions
export const redeemPromotion = async (
  promotionId: string,
  location?: { latitude: number; longitude: number }
) => {
  return api.post<{
    success: boolean;
    data: {
      redemptionId: string;
      code: string;
      qrCodeBase64: string;
      expiresAt: string;
      promotion: { id: string; title: string; discountType?: string; discountValue?: number; shopName: string };
    };
  }>(`/promotions/${promotionId}/redeem`, location ? location : {});
};

export const getUserRedemptions = async () => {
  return api.get<{
    success: boolean;
    data: Array<{
      id: string;
      code: string;
      redeemedAt: string;
      isVerified: boolean;
      promotion: {
        id: string;
        title: string;
        discountType?: string;
        discountValue?: number;
        shop: { id: string; name: string; logoUrl?: string };
      };
    }>;
  }>('/users/redemptions');
};

export const getNotifications = async () => {
  return api.get<{
    success: boolean;
    data: {
      notifications: any[];
      unreadCount: number;
    };
  }>('/notifications');
};

export const markNotificationRead = async (notificationId: string) => {
  return api.put(`/notifications/${notificationId}/read`, {});
};

export default api;
