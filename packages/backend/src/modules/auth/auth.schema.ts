import { z } from 'zod';

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be under 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Shop registration schema
export const shopRegisterSchema = z.object({
  name: z.string().min(2, 'Shop name must be at least 2 characters').max(100, 'Shop name must be under 100 characters'),
  email: z.string().email('Invalid email address').max(254),
  password: passwordSchema,
  phone: z.string().min(7).max(20).optional(),
});

export type ShopRegisterInput = z.infer<typeof shopRegisterSchema>;

// Shop login schema
export const shopLoginSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
  password: z.string().min(1, 'Password is required').max(128),
});

export type ShopLoginInput = z.infer<typeof shopLoginSchema>;

// User registration schema
export const userRegisterSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address').max(254).optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20).optional(),
  password: passwordSchema,
}).refine(
  (data) => data.email || data.phone,
  {
    message: 'Either email or phone number is required',
    path: ['email'],
  }
);

export type UserRegisterInput = z.infer<typeof userRegisterSchema>;

// User login schema
export const userLoginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone is required').max(254),
  password: z.string().min(1, 'Password is required').max(128),
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;

// Refresh token schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').max(2048),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
