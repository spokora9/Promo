import { api } from './api';

export interface ShopRedemption {
  id: string;
  redemptionCode: string;
  redeemedAt: string;
  isVerified: boolean;
  verifiedAt?: string;
  promotion: {
    id: string;
    title: string;
    discountType?: string;
    discountValue?: number;
  };
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export interface VerifyResult {
  promotion: { id: string; title: string; discountLabel: string };
  customer: { firstName?: string; lastName?: string };
  redeemedAt: string;
  verifiedAt: string;
}

export const verifyRedemptionCode = (code: string): Promise<{ success: boolean; data: VerifyResult }> =>
  api.post('/shops/redemptions/verify', { code }).then((r) => r.data);

export const getShopRedemptions = (params?: {
  promotionId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ success: boolean; data: ShopRedemption[] }> =>
  api.get('/shops/redemptions', { params }).then((r) => r.data);
