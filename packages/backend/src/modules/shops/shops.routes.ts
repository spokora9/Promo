import { FastifyInstance } from 'fastify';
import { ShopsService } from './shops.service';
import { NotFoundError } from '../../shared/utils/errors';

export async function shopsRoutes(fastify: FastifyInstance) {
  // Public shop detail
  fastify.get('/shops/:id/public', async (request, reply) => {
    const { id } = request.params as { id: string };
    const shop = await ShopsService.getPublicShop(id);
    return reply.send({ success: true, data: shop });
  });
}
