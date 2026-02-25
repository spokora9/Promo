import { prisma } from '../../shared/config/database';
import { NotFoundError } from '../../shared/utils/errors';

export class UsersService {
  // Update (or create) the user's current location
  static async updateLocation(
    userId: string,
    latitude: number,
    longitude: number,
    accuracyMeters?: number
  ) {
    const location = await prisma.userLocation.upsert({
      where: { userId },
      create: { userId, latitude, longitude, accuracyMeters },
      update: { latitude, longitude, accuracyMeters },
    });

    return location;
  }

  // Get user profile
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        pushNotificationsEnabled: true,
        notificationRadiusMeters: true,
        locationSharingEnabled: true,
        discoveryModeEnabled: true,
        discoveryModeType: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  // Update user profile
  static async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      pushNotificationsEnabled?: boolean;
      notificationRadiusMeters?: number;
      locationSharingEnabled?: boolean;
      discoveryModeEnabled?: boolean;
      discoveryModeType?: string;
    }
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        pushNotificationsEnabled: true,
        notificationRadiusMeters: true,
        locationSharingEnabled: true,
        discoveryModeEnabled: true,
        discoveryModeType: true,
      },
    });

    return user;
  }

  // Get user's favourite promotions
  static async getFavouritePromotions(userId: string) {
    const preferences = await prisma.userShopPreference.findMany({
      where: { userId },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            category: true,
            promotions: {
              where: { status: 'active', endDate: { gte: new Date() } },
              take: 3,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return preferences;
  }

  // Follow a shop (add to preferences)
  static async followShop(userId: string, shopId: string, addedVia?: string) {
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundError('Shop not found');

    const preference = await prisma.userShopPreference.upsert({
      where: { userId_shopId: { userId, shopId } },
      create: { userId, shopId, addedVia: addedVia || 'manual' },
      update: { notificationsEnabled: true },
    });

    return preference;
  }

  // Unfollow a shop
  static async unfollowShop(userId: string, shopId: string) {
    await prisma.userShopPreference.deleteMany({
      where: { userId, shopId },
    });

    return { message: 'Shop unfollowed' };
  }
}
