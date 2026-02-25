import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { UsersService } from './users.service';

const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracyMeters: z.number().optional(),
});

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  pushNotificationsEnabled: z.boolean().optional(),
  notificationRadiusMeters: z.number().min(500).max(50000).optional(),
  locationSharingEnabled: z.boolean().optional(),
  discoveryModeEnabled: z.boolean().optional(),
  discoveryModeType: z.enum(['off', 'active', 'silent', 'smart']).optional(),
});

export class UsersController {
  static async updateLocation(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;
    const { latitude, longitude, accuracyMeters } = updateLocationSchema.parse(request.body);
    const location = await UsersService.updateLocation(userId, latitude, longitude, accuracyMeters);
    return reply.send({ success: true, data: location });
  }

  static async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;
    const user = await UsersService.getProfile(userId);
    return reply.send({ success: true, data: user });
  }

  static async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;
    const data = updateProfileSchema.parse(request.body);
    const user = await UsersService.updateProfile(userId, data);
    return reply.send({ success: true, data: user });
  }

  static async getFavouriteShops(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;
    const data = await UsersService.getFavouritePromotions(userId);
    return reply.send({ success: true, data });
  }

  static async followShop(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;
    const { shopId } = request.params as { shopId: string };
    const result = await UsersService.followShop(userId, shopId);
    return reply.code(201).send({ success: true, data: result });
  }

  static async unfollowShop(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;
    const { shopId } = request.params as { shopId: string };
    const result = await UsersService.unfollowShop(userId, shopId);
    return reply.send({ success: true, data: result });
  }
}
