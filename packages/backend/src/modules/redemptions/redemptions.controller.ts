import { FastifyRequest, FastifyReply } from 'fastify';
import { RedemptionsService } from './redemptions.service';
import {
  redeemPromotionSchema,
  verifyRedemptionSchema,
  getShopRedemptionsQuerySchema,
} from './redemptions.schema';

export class RedemptionsController {
  static redeemPromotion = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id: userId } = request.user as any;
    const { id: promotionId } = request.params as { id: string };
    const body = redeemPromotionSchema.parse(request.body || {});
    const result = await RedemptionsService.redeemPromotion(
      promotionId,
      userId,
      body.latitude,
      body.longitude
    );
    return reply.status(201).send({ success: true, data: result });
  };

  static verifyCode = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id: shopId } = request.user as any;
    const body = verifyRedemptionSchema.parse(request.body);
    const result = await RedemptionsService.verifyCode(body.code, shopId);
    return reply.status(200).send({ success: true, data: result });
  };

  static getShopRedemptions = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id: shopId } = request.user as any;
    const query = getShopRedemptionsQuerySchema.parse(request.query);
    const result = await RedemptionsService.getShopRedemptions(shopId, query);
    return reply.status(200).send({ success: true, data: result });
  };
}
