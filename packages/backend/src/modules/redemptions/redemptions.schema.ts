import { z } from 'zod';

export const redeemPromotionSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const verifyRedemptionSchema = z.object({
  code: z.string().min(1, 'Redemption code is required'),
});

export const getShopRedemptionsQuerySchema = z.object({
  promotionId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type RedeemPromotionInput = z.infer<typeof redeemPromotionSchema>;
export type VerifyRedemptionInput = z.infer<typeof verifyRedemptionSchema>;
export type GetShopRedemptionsQuery = z.infer<typeof getShopRedemptionsQuerySchema>;
