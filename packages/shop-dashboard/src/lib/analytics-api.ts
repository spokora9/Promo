import { api } from './api';

export interface AnalyticsOverview {
  activePromotions: number;
  totalViews: { '24h': number; '7d': number; '30d': number };
  totalRedemptions: { '24h': number; '7d': number; '30d': number };
  conversionRate7d: string;
  topPromotion: {
    id: string;
    title: string;
    views: number;
    redemptions: number;
  } | null;
}

export interface PromotionAnalytics {
  promotion: {
    id: string;
    title: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  totalViews: number;
  uniqueViewers: number;
  totalRedemptions: number;
  conversionRate: string;
  avgDistanceMeters: number;
  viewsByDay: Array<{ date: string; count: number }>;
  redemptionsByDay: Array<{ date: string; count: number }>;
}

export const getAnalyticsOverview = (): Promise<{ success: boolean; data: AnalyticsOverview }> =>
  api.get('/analytics/shops/overview').then((r) => r.data);

export const getPromotionAnalytics = (promotionId: string): Promise<{ success: boolean; data: PromotionAnalytics }> =>
  api.get(`/analytics/shops/promotions/${promotionId}`).then((r) => r.data);
