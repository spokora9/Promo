import { FastifyInstance } from 'fastify';
import { AnalyticsController } from './analytics.controller';
import { authenticateShop } from '../../shared/middleware/auth.middleware';

export async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.get('/shops/overview', {
    preHandler: [authenticateShop],
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } },
    handler: AnalyticsController.getOverview,
  });

  fastify.get('/shops/promotions/:promotionId', {
    preHandler: [authenticateShop],
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } },
    handler: AnalyticsController.getPromotionAnalytics,
  });
}
