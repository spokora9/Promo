import { FastifyRequest, FastifyReply } from 'fastify';
import { DiscoveryService } from './discovery.service';

export class DiscoveryController {
  static async getFeed(request: FastifyRequest, reply: FastifyReply) {
    const { id: userId } = request.user as { id: string };
    const query = request.query as {
      latitude?: string;
      longitude?: string;
      radiusMeters?: string;
      mode?: string;
    };

    if (!query.latitude || !query.longitude) {
      return reply.status(400).send({ success: false, error: 'latitude and longitude are required' });
    }

    const data = await DiscoveryService.getDiscoveryFeed(
      userId,
      parseFloat(query.latitude),
      parseFloat(query.longitude),
      query.radiusMeters ? parseInt(query.radiusMeters) : 10000,
      query.mode || 'active'
    );

    return reply.send({ success: true, data });
  }

  static async dismissShop(request: FastifyRequest, reply: FastifyReply) {
    const { id: userId } = request.user as { id: string };
    const { shopId } = request.params as { shopId: string };
    const result = await DiscoveryService.dismissShop(userId, shopId);
    return reply.send({ success: true, data: result });
  }

  static async notInterested(request: FastifyRequest, reply: FastifyReply) {
    const { id: userId } = request.user as { id: string };
    const { shopId } = request.params as { shopId: string };
    const result = await DiscoveryService.notInterested(userId, shopId);
    return reply.send({ success: true, data: result });
  }
}
