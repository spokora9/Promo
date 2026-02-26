import { FastifyInstance } from 'fastify';
import { PromotionsController } from './promotions.controller';
import { authenticateShop, authenticateUser } from '../../shared/middleware/auth.middleware';

export async function promotionsRoutes(fastify: FastifyInstance) {
  // Shop promotion management routes (protected - shop only)
  fastify.get('/shops/promotions', {
    preHandler: [authenticateShop],
    handler: PromotionsController.getShopPromotions,
  });

  fastify.get('/shops/promotions/:id', {
    preHandler: [authenticateShop],
    handler: PromotionsController.getPromotionById,
  });

  fastify.post('/shops/promotions', {
    preHandler: [authenticateShop],
    handler: PromotionsController.createPromotion,
  });

  fastify.put('/shops/promotions/:id', {
    preHandler: [authenticateShop],
    handler: PromotionsController.updatePromotion,
  });

  fastify.delete('/shops/promotions/:id', {
    preHandler: [authenticateShop],
    handler: PromotionsController.deletePromotion,
  });

  fastify.post('/shops/promotions/:id/activate', {
    preHandler: [authenticateShop],
    handler: PromotionsController.activatePromotion,
  });

  fastify.post('/shops/promotions/:id/pause', {
    preHandler: [authenticateShop],
    handler: PromotionsController.pausePromotion,
  });

  fastify.get('/shops/promotions/:id/stats', {
    preHandler: [authenticateShop],
    handler: PromotionsController.getPromotionStats,
  });

  // Public/customer routes — rate limited to prevent scraping
  fastify.get('/promotions/nearby', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } },
    handler: PromotionsController.getNearbyPromotions,
  });
  fastify.get('/promotions/:id', {
    config: { rateLimit: { max: 120, timeWindow: '1 minute' } },
    handler: PromotionsController.getPublicPromotion,
  });
  fastify.post('/promotions/:id/view', {
    config: { rateLimit: { max: 120, timeWindow: '1 minute' } },
    handler: PromotionsController.trackView,
  });
}
