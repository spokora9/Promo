import { FastifyRequest, FastifyReply } from 'fastify';
import { NotificationsService } from './notifications.service';

export class NotificationsController {
  static async getUserNotifications(request: FastifyRequest, reply: FastifyReply) {
    const { id: userId } = request.user as { id: string };
    const notifications = await NotificationsService.getUserNotifications(userId);
    const unreadCount = await NotificationsService.getUnreadCount(userId);
    return reply.send({ success: true, data: { notifications, unreadCount } });
  }

  static async markAsRead(request: FastifyRequest, reply: FastifyReply) {
    const { id: userId } = request.user as { id: string };
    const { id: notificationId } = request.params as { id: string };
    const result = await NotificationsService.markAsRead(notificationId, userId);
    return reply.send({ success: true, data: result });
  }

  static async markAllAsRead(request: FastifyRequest, reply: FastifyReply) {
    const { id: userId } = request.user as { id: string };
    const result = await NotificationsService.markAllAsRead(userId);
    return reply.send({ success: true, data: result });
  }
}
