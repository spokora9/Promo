import { FastifyInstance } from 'fastify';
import { UsersController } from './users.controller';
import { authenticateUser } from '../../shared/middleware/auth.middleware';

export async function usersRoutes(fastify: FastifyInstance) {
  // Location
  fastify.post('/users/location', { preHandler: [authenticateUser], handler: UsersController.updateLocation });

  // Profile
  fastify.get('/users/profile', { preHandler: [authenticateUser], handler: UsersController.getProfile });
  fastify.put('/users/profile', { preHandler: [authenticateUser], handler: UsersController.updateProfile });

  // Shop follows / favourites
  fastify.get('/users/shops/following', { preHandler: [authenticateUser], handler: UsersController.getFavouriteShops });
  fastify.post('/users/shops/:shopId/follow', { preHandler: [authenticateUser], handler: UsersController.followShop });
  fastify.delete('/users/shops/:shopId/follow', { preHandler: [authenticateUser], handler: UsersController.unfollowShop });

  // Push token registration
  fastify.post('/users/push-token', { preHandler: [authenticateUser], handler: UsersController.registerPushToken });

  // Redemption history
  fastify.get('/users/redemptions', { preHandler: [authenticateUser], handler: UsersController.getRedemptions });

  // Favorite promotions
  fastify.get('/users/favorites/promotions', { preHandler: [authenticateUser], handler: UsersController.getFavoritePromotions });
  fastify.post('/users/favorites/promotions/:promotionId', { preHandler: [authenticateUser], handler: UsersController.addFavoritePromotion });
  fastify.delete('/users/favorites/promotions/:promotionId', { preHandler: [authenticateUser], handler: UsersController.removeFavoritePromotion });

  // Favorite shops (aliases for follow system)
  fastify.get('/users/favorites/shops', { preHandler: [authenticateUser], handler: UsersController.getFavouriteShops });
}
