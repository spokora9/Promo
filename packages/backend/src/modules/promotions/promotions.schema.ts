import { z } from 'zod';

// Create promotion schema
export const createPromotionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be under 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be under 2000 characters'),
  discountType: z.enum(['percentage', 'fixed', 'bogo', 'freebie']),
  discountValue: z.number().min(0).max(100000),
  targetAllLocations: z.boolean(),
  targetLocationIds: z.array(z.string().uuid()).max(50).optional(),
  radiusMeters: z.number().min(100).max(50000),
  maxRedemptionsPerUser: z.number().min(1).max(100).optional(),
  maxTotalRedemptions: z.number().min(1).max(1000000).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isDiscoveryOffer: z.boolean().default(false),
  terms: z.string().max(1000, 'Terms must be under 1000 characters').optional(),
});

export type CreatePromotionInput = z.infer<typeof createPromotionSchema>;

// Update promotion schema
export const updatePromotionSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(2000).optional(),
  discountType: z.enum(['percentage', 'fixed', 'bogo', 'freebie']).optional(),
  discountValue: z.number().min(0).max(100000).optional(),
  targetAllLocations: z.boolean().optional(),
  targetLocationIds: z.array(z.string().uuid()).max(50).optional(),
  radiusMeters: z.number().min(100).max(50000).optional(),
  maxRedemptionsPerUser: z.number().min(1).max(100).optional(),
  maxTotalRedemptions: z.number().min(1).max(1000000).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isDiscoveryOffer: z.boolean().optional(),
  terms: z.string().max(1000).optional(),
  status: z.enum(['draft', 'active', 'paused', 'expired']).optional(),
});

export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>;

// Query nearby promotions schema
export const nearbyPromotionsQuerySchema = z.object({
  latitude: z.string(),
  longitude: z.string(),
  radius: z.string().optional(),
});

export type NearbyPromotionsQuery = z.infer<typeof nearbyPromotionsQuerySchema>;
