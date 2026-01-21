import { FastifyRequest, FastifyReply } from 'fastify';
import { PromotionsService } from './promotions.service';
import {
  createPromotionSchema,
  updatePromotionSchema,
  nearbyPromotionsQuerySchema,
} from './promotions.schema';

export class PromotionsController {
  // Get all promotions for the authenticated shop
  static async getShopPromotions(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const promotions = await PromotionsService.getShopPromotions(shopId);

    return reply.send({
      success: true,
      data: promotions,
    });
  }

  // Get a single promotion by ID
  static async getPromotionById(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const { id } = request.params as { id: string };

    const promotion = await PromotionsService.getPromotionById(id, shopId);

    return reply.send({
      success: true,
      data: promotion,
    });
  }

  // Create a new promotion
  static async createPromotion(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const validatedData = createPromotionSchema.parse(request.body);

    const promotion = await PromotionsService.createPromotion(shopId, validatedData);

    return reply.code(201).send({
      success: true,
      data: promotion,
    });
  }

  // Update a promotion
  static async updatePromotion(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const { id } = request.params as { id: string };
    const validatedData = updatePromotionSchema.parse(request.body);

    const promotion = await PromotionsService.updatePromotion(id, shopId, validatedData);

    return reply.send({
      success: true,
      data: promotion,
    });
  }

  // Delete a promotion
  static async deletePromotion(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const { id } = request.params as { id: string };

    const result = await PromotionsService.deletePromotion(id, shopId);

    return reply.send({
      success: true,
      ...result,
    });
  }

  // Activate a promotion
  static async activatePromotion(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const { id } = request.params as { id: string };

    const result = await PromotionsService.activatePromotion(id, shopId);

    return reply.send({
      success: true,
      ...result,
    });
  }

  // Pause a promotion
  static async pausePromotion(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const { id } = request.params as { id: string };

    const result = await PromotionsService.pausePromotion(id, shopId);

    return reply.send({
      success: true,
      ...result,
    });
  }

  // Get nearby promotions (for customers)
  static async getNearbyPromotions(request: FastifyRequest, reply: FastifyReply) {
    const { latitude, longitude, radius } = nearbyPromotionsQuerySchema.parse(request.query);

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const radiusMeters = radius ? parseInt(radius) : 5000;

    if (isNaN(lat) || isNaN(lon)) {
      return reply.code(400).send({
        success: false,
        error: 'Invalid latitude or longitude',
      });
    }

    const promotions = await PromotionsService.getNearbyPromotions(
      lat,
      lon,
      radiusMeters
    );

    return reply.send({
      success: true,
      data: promotions,
    });
  }

  // Get promotion statistics
  static async getPromotionStats(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const { id } = request.params as { id: string };

    const stats = await PromotionsService.getPromotionStats(id, shopId);

    return reply.send({
      success: true,
      data: stats,
    });
  }
}
