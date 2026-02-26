import { prisma } from '../../shared/config/database';
import { NotFoundError } from '../../shared/utils/errors';
import { ExpoPushService } from '../../shared/services/expo-push.service';

export class NotificationsService {
  static async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      include: {
        promotion: {
          select: {
            id: true,
            title: true,
            discountType: true,
            discountValue: true,
            shop: { select: { id: true, name: true, logoUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  static async markAsRead(notificationId: string, userId: string) {
    // Compound where prevents IDOR — only matches if both id and userId match
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) throw new NotFoundError('Notification not found');

    return prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date(), status: 'read' },
    });
  }

  static async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date(), status: 'read' },
    });
    return { updated: true };
  }

  static async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, readAt: null },
    });
  }

  // Called by geofence worker — sends push notification and records it
  static async sendProximityNotification(userId: string, promotionId: string): Promise<void> {
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
      include: { shop: { select: { name: true } } },
    });

    if (!promotion) return;

    // Create notification record
    const notification = await prisma.notification.create({
      data: {
        userId,
        promotionId,
        notificationType: 'proximity',
        status: 'pending',
      },
    });

    try {
      const discountText = promotion.discountType === 'percentage'
        ? `${promotion.discountValue}% off`
        : promotion.discountType === 'fixed'
        ? `$${promotion.discountValue} off`
        : promotion.discountType === 'bogo'
        ? 'Buy 1 Get 1 Free'
        : 'Special deal';

      await ExpoPushService.sendToUser(
        userId,
        `${discountText} at ${promotion.shop.name}! 🎉`,
        promotion.title,
        { promotionId, shopId: promotion.shopId, type: 'proximity' },
        'promotions'
      );

      await prisma.notification.update({
        where: { id: notification.id },
        data: { status: 'sent', sentAt: new Date() },
      });
    } catch (error) {
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }

  // Check if a user was recently notified about a promotion (cooldown)
  static async wasRecentlyNotified(
    userId: string,
    promotionId: string,
    cooldownHours = 4
  ): Promise<boolean> {
    const cutoff = new Date(Date.now() - cooldownHours * 60 * 60 * 1000);
    const recent = await prisma.notification.findFirst({
      where: {
        userId,
        promotionId,
        createdAt: { gte: cutoff },
        notificationType: 'proximity',
      },
    });
    return !!recent;
  }
}
