import { FastifyInstance } from 'fastify';
import { DiscoveryController } from './discovery.controller';
import { authenticateUser } from '../../shared/middleware/auth.middleware';

export async function discoveryRoutes(fastify: FastifyInstance) {
  fastify.get('/feed', {
    preHandler: [authenticateUser],
    handler: DiscoveryController.getFeed,
  });

  fastify.post('/dismiss/:shopId', {
    preHandler: [authenticateUser],
    handler: DiscoveryController.dismissShop,
  });

  fastify.post('/not-interested/:shopId', {
    preHandler: [authenticateUser],
    handler: DiscoveryController.notInterested,
  });
}
