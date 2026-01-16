import { FastifyInstance } from 'fastify';
import { ProfileController } from './profile.controller';
import { authenticateShop, authenticateUser } from '../../shared/middleware/auth.middleware';

export async function profileRoutes(fastify: FastifyInstance) {
  // Shop profile routes
  fastify.get('/shops/profile', {
    preHandler: [authenticateShop],
    handler: ProfileController.getShopProfile,
  });

  fastify.put('/shops/profile', {
    preHandler: [authenticateShop],
    handler: ProfileController.updateShopProfile,
  });

  fastify.patch('/shops/profile/logo', {
    preHandler: [authenticateShop],
    handler: ProfileController.updateShopLogo,
  });

  // User profile routes
  fastify.get('/users/profile', {
    preHandler: [authenticateUser],
    handler: ProfileController.getUserProfile,
  });

  fastify.put('/users/profile', {
    preHandler: [authenticateUser],
    handler: ProfileController.updateUserProfile,
  });

  fastify.patch('/users/profile/avatar', {
    preHandler: [authenticateUser],
    handler: ProfileController.updateUserAvatar,
  });
}
