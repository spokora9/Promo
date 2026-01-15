// Common types shared across frontend and backend

export interface Shop {
  id: string;
  name: string;
  email: string;
  logoUrl?: string;
  description?: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShopLocation {
  id: string;
  shopId: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  id: string;
  shopId: string;
  title: string;
  description: string;
  termsConditions?: string;
  discountType?: string;
  discountValue?: number;
  imageUrl?: string;
  targetType: string;
  radiusMeters: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  maxRedemptionsPerUser?: number;
  maxTotalRedemptions?: number;
  currentRedemptions: number;
  isDiscoveryOffer: boolean;
  discoveryBoost?: number;
  maxDiscoveryExposures?: number;
  autoConvertAfterExposures: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  notificationRadiusMeters: number;
  locationSharingEnabled: boolean;
  discoveryModeEnabled: boolean;
  discoveryModeType: 'off' | 'active' | 'silent' | 'smart';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface PromotionRedemption {
  id: string;
  promotionId: string;
  userId: string;
  shopLocationId?: string;
  redeemedAt: string;
  redemptionCode: string;
  isVerified: boolean;
  verifiedAt?: string;
}

export interface DiscoveryExposure {
  id: string;
  userId: string;
  shopId: string;
  promotionId?: string;
  exposureCount: number;
  firstExposureAt: string;
  lastExposureAt: string;
  totalViews: number;
  totalDismissals: number;
  totalNotInterested: number;
  status: 'active' | 'grace_period' | 'exhausted' | 'converted';
  gracePeriodStartedAt?: string;
  exhaustedAt?: string;
  convertedAt?: string;
  redeemedDuringDiscovery: boolean;
  redemptionAt?: string;
  createdAt: string;
  updatedAt: string;
}
