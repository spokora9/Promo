import { FastifyInstance } from 'fastify';
import { RedemptionsController } from './redemptions.controller';
import { authenticateShop, authenticateUser } from '../../shared/middleware/auth.middleware';

export async function redemptionsRoutes(fastify: FastifyInstance) {
  // Customer: redeem a promotion
  fastify.post('/promotions/:id/redeem', {
    preHandler: [authenticateUser],
    handler: RedemptionsController.redeemPromotion,
  });

  // Customer: get own redemption history
  fastify.get('/users/redemptions', {
    preHandler: [authenticateUser],
    handler: RedemptionsController.getUserRedemptions,
  });

  // Shop: verify a redemption code
  fastify.post('/shops/redemptions/verify', {
    preHandler: [authenticateShop],
    handler: RedemptionsController.verifyCode,
  });

  // Shop: list all redemptions
  fastify.get('/shops/redemptions', {
    preHandler: [authenticateShop],
    handler: RedemptionsController.getShopRedemptions,
  });
}
