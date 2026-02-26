import { FastifyRequest, FastifyReply } from 'fastify';
import { RedemptionsService } from './redemptions.service';
import { redeemPromotionSchema, verifyCodeSchema } from './redemptions.schema';

export class RedemptionsController {
  static async redeemPromotion(request: FastifyRequest, reply: FastifyReply) {
    const { id: userId } = request.user as { id: string };
    const { id: promotionId } = request.params as { id: string };
    const body = redeemPromotionSchema.parse(request.body || {});

    const result = await RedemptionsService.redeemPromotion(
      promotionId,
      userId,
      body.latitude,
      body.longitude
    );

    return reply.status(201).send({ success: true, data: result });
  }

  static async verifyCode(request: FastifyRequest, reply: FastifyReply) {
    const { id: shopId } = request.user as { id: string };
    const { code } = verifyCodeSchema.parse(request.body);

    const result = await RedemptionsService.verifyCode(code, shopId);
    return reply.send({ success: true, data: result });
  }

  static async getUserRedemptions(request: FastifyRequest, reply: FastifyReply) {
    const { id: userId } = request.user as { id: string };
    const redemptions = await RedemptionsService.getUserRedemptions(userId);
    return reply.send({ success: true, data: redemptions });
  }

  static async getShopRedemptions(request: FastifyRequest, reply: FastifyReply) {
    const { id: shopId } = request.user as { id: string };
    const query = request.query as { promotionId?: string; startDate?: string; endDate?: string };

    const result = await RedemptionsService.getShopRedemptions(shopId, {
      promotionId: query.promotionId,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });

    return reply.send({ success: true, data: result });
  }
}
