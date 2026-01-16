import { z } from 'zod';

// Create location schema
export const createLocationSchema = z.object({
  name: z.string().min(2, 'Location name must be at least 2 characters'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  postalCode: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>;

// Update location schema
export const updateLocationSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  state: z.string().optional(),
  country: z.string().min(2).optional(),
  postalCode: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;

// Geocode address schema
export const geocodeAddressSchema = z.object({
  address: z.string().min(5, 'Address is required'),
});

export type GeocodeAddressInput = z.infer<typeof geocodeAddressSchema>;
