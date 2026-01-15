// Types
export * from './types/index.js';

// Schemas
export * from './schemas/auth.js';

// Constants
export const APP_NAME = 'LoCo';
export const APP_DESCRIPTION = 'Location Commerce Platform';
export const API_VERSION = 'v1';

// Distance utils
export const METERS_PER_KM = 1000;
export const MIN_RADIUS_METERS = 100;
export const MAX_RADIUS_METERS = 50000;
export const DEFAULT_NOTIFICATION_RADIUS_METERS = 5000;

// Discovery Mode constants
export const DEFAULT_MAX_DISCOVERY_EXPOSURES = 5;
export const DISCOVERY_MODE_TYPES = ['off', 'active', 'silent', 'smart'] as const;
export const EXPOSURE_STATUSES = ['active', 'grace_period', 'exhausted', 'converted'] as const;
