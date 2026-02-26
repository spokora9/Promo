import { FastifyRequest, FastifyReply } from 'fastify';
import { AnalyticsService } from './analytics.service';

export class AnalyticsController {
  static async getOverview(request: FastifyRequest, reply: FastifyReply) {
    const { id: shopId } = request.user as { id: string };
    const data = await AnalyticsService.getOverview(shopId);
    return reply.send({ success: true, data });
  }

  static async getPromotionAnalytics(request: FastifyRequest, reply: FastifyReply) {
    const { id: shopId } = request.user as { id: string };
    const { promotionId } = request.params as { promotionId: string };
    const data = await AnalyticsService.getPromotionAnalytics(promotionId, shopId);
    return reply.send({ success: true, data });
  }
}
