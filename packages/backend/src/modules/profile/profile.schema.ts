import { z } from 'zod';

// Update shop profile schema
export const updateShopProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  description: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
});

export type UpdateShopProfileInput = z.infer<typeof updateShopProfileSchema>;

// Update user profile schema
export const updateUserProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  notificationPreferences: z
    .object({
      pushEnabled: z.boolean().optional(),
      emailEnabled: z.boolean().optional(),
      smsEnabled: z.boolean().optional(),
      discoveryMode: z.enum(['off', 'active', 'silent', 'smart']).optional(),
      maxDistance: z.number().min(100).max(50000).optional(),
    })
    .optional(),
});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
