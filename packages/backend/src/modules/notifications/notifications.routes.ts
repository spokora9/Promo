import { FastifyInstance } from 'fastify';
import { NotificationsController } from './notifications.controller';
import { authenticateUser } from '../../shared/middleware/auth.middleware';

export async function notificationsRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
    preHandler: [authenticateUser],
    handler: NotificationsController.getUserNotifications,
  });

  fastify.patch('/:id/read', {
    preHandler: [authenticateUser],
    handler: NotificationsController.markAsRead,
  });

  fastify.post('/mark-all-read', {
    preHandler: [authenticateUser],
    handler: NotificationsController.markAllAsRead,
  });
}
