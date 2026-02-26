import { z } from 'zod';

export const redeemPromotionSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const verifyCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

export type RedeemPromotionInput = z.infer<typeof redeemPromotionSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
