import { z } from 'zod';

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Shop registration schema
export const shopRegisterSchema = z.object({
  name: z.string().min(2, 'Shop name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  phone: z.string().optional(),
});

export type ShopRegisterInput = z.infer<typeof shopRegisterSchema>;

// Shop login schema
export const shopLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type ShopLoginInput = z.infer<typeof shopLoginSchema>;

// User registration schema
export const userRegisterSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
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
  emailOrPhone: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;

// Refresh token schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
