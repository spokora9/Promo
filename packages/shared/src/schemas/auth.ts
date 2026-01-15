import { z } from 'zod';

// Auth schemas for validation

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const shopRegisterSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  category: z.string().optional(),
});

export const userRegisterSchema = z.object({
  email: emailSchema.optional(),
  phone: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type ShopRegisterInput = z.infer<typeof shopRegisterSchema>;
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
