import { FastifyRequest, FastifyReply } from 'fastify';
import { ProfileService } from './profile.service';
import { updateShopProfileSchema, updateUserProfileSchema } from './profile.schema';

export class ProfileController {
  // Get shop profile
  static async getShopProfile(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const profile = await ProfileService.getShopProfile(shopId);

    return reply.send({
      success: true,
      data: profile,
    });
  }

  // Update shop profile
  static async updateShopProfile(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const validatedData = updateShopProfileSchema.parse(request.body);

    const profile = await ProfileService.updateShopProfile(shopId, validatedData);

    return reply.send({
      success: true,
      data: profile,
    });
  }

  // Get user profile
  static async getUserProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;
    const profile = await ProfileService.getUserProfile(userId);

    return reply.send({
      success: true,
      data: profile,
    });
  }

  // Update user profile
  static async updateUserProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;
    const validatedData = updateUserProfileSchema.parse(request.body);

    const profile = await ProfileService.updateUserProfile(userId, validatedData);

    return reply.send({
      success: true,
      data: profile,
    });
  }

  // Update shop logo
  static async updateShopLogo(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;
    const { logoUrl } = request.body as { logoUrl: string };

    if (!logoUrl) {
      return reply.code(400).send({
        success: false,
        error: 'Logo URL is required',
      });
    }

    const shop = await ProfileService.updateShopLogo(shopId, logoUrl);

    return reply.send({
      success: true,
      data: shop,
    });
  }

  // Update user avatar
  static async updateUserAvatar(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;
    const { avatarUrl } = request.body as { avatarUrl: string };

    if (!avatarUrl) {
      return reply.code(400).send({
        success: false,
        error: 'Avatar URL is required',
      });
    }

    const user = await ProfileService.updateUserAvatar(userId, avatarUrl);

    return reply.send({
      success: true,
      data: user,
    });
  }
}
