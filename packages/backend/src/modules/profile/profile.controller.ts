import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ProfileService } from './profile.service';
import { updateShopProfileSchema, updateUserProfileSchema } from './profile.schema';

const updateLogoSchema = z.object({
  logoUrl: z.string().url().max(2048).refine(
    (url) => url.startsWith('https://'),
    { message: 'Logo URL must use HTTPS' }
  ),
});

const updateAvatarSchema = z.object({
  avatarUrl: z.string().url().max(2048).refine(
    (url) => url.startsWith('https://'),
    { message: 'Avatar URL must use HTTPS' }
  ),
});

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
    const { logoUrl } = updateLogoSchema.parse(request.body);

    const shop = await ProfileService.updateShopLogo(shopId, logoUrl);

    return reply.send({
      success: true,
      data: shop,
    });
  }

  // Update user avatar
  static async updateUserAvatar(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;
    const { avatarUrl } = updateAvatarSchema.parse(request.body);

    const user = await ProfileService.updateUserAvatar(userId, avatarUrl);

    return reply.send({
      success: true,
      data: user,
    });
  }
}
