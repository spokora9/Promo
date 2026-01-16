import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';
import { authenticate, authenticateShop, authenticateUser } from '../../shared/middleware/auth.middleware';

export async function authRoutes(fastify: FastifyInstance) {
  // Shop authentication routes
  fastify.post('/shops/register', AuthController.registerShop);
  fastify.post('/shops/login', AuthController.loginShop);
  fastify.get('/shops/me', {
    preHandler: [authenticateShop],
    handler: AuthController.getCurrentShop,
  });

  // User authentication routes
  fastify.post('/users/register', AuthController.registerUser);
  fastify.post('/users/login', AuthController.loginUser);
  fastify.get('/users/me', {
    preHandler: [authenticateUser],
    handler: AuthController.getCurrentUser,
  });

  // Common routes
  fastify.post('/refresh', AuthController.refreshToken);
  fastify.post('/logout', {
    preHandler: [authenticate],
    handler: AuthController.logout,
  });
}
