import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';
import { authenticate, authenticateShop, authenticateUser } from '../../shared/middleware/auth.middleware';

// Strict rate limit for credential endpoints: 10 attempts per minute per IP
const credentialRateLimit = {
  max: 10,
  timeWindow: '1 minute',
  errorResponseBuilder: () => ({
    success: false,
    error: 'Too many attempts. Please wait a minute before trying again.',
  }),
};

// Loose rate limit for registration: 5 accounts per hour per IP
const registrationRateLimit = {
  max: 5,
  timeWindow: '1 hour',
  errorResponseBuilder: () => ({
    success: false,
    error: 'Too many registration attempts. Please try again later.',
  }),
};

export async function authRoutes(fastify: FastifyInstance) {
  // Shop authentication routes
  fastify.post('/shops/register', {
    config: { rateLimit: registrationRateLimit },
    handler: AuthController.registerShop,
  });
  fastify.post('/shops/login', {
    config: { rateLimit: credentialRateLimit },
    handler: AuthController.loginShop,
  });
  fastify.get('/shops/me', {
    preHandler: [authenticateShop],
    handler: AuthController.getCurrentShop,
  });

  // User authentication routes
  fastify.post('/users/register', {
    config: { rateLimit: registrationRateLimit },
    handler: AuthController.registerUser,
  });
  fastify.post('/users/login', {
    config: { rateLimit: credentialRateLimit },
    handler: AuthController.loginUser,
  });
  fastify.get('/users/me', {
    preHandler: [authenticateUser],
    handler: AuthController.getCurrentUser,
  });

  // Common routes
  fastify.post('/refresh', {
    config: { rateLimit: credentialRateLimit },
    handler: AuthController.refreshToken,
  });
  fastify.post('/logout', {
    preHandler: [authenticate],
    handler: AuthController.logout,
  });
}
