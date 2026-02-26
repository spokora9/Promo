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

  static async registerPushToken(userId: string, token: string, platform: string) {
    const pushToken = await prisma.pushToken.upsert({
      where: { token },
      create: { userId, token, platform },
      update: { userId, platform },
    });
    return { registered: true, id: pushToken.id };
  }

  static async getUserRedemptions(userId: string) {
    return prisma.promotionRedemption.findMany({
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
      orderBy: { redeemedAt: 'desc' },
    });
  }

  static async getFavoritePromotions(userId: string) {
    return prisma.userFavoritePromotion.findMany({
      where: { userId },
      include: {
        promotion: {
          select: {
            id: true,
            title: true,
            discountType: true,
            discountValue: true,
            endDate: true,
            status: true,
            shop: { select: { id: true, name: true, logoUrl: true, category: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async addFavoritePromotion(userId: string, promotionId: string) {
    const promotion = await prisma.promotion.findUnique({ where: { id: promotionId } });
    if (!promotion) throw new NotFoundError('Promotion not found');
    return prisma.userFavoritePromotion.upsert({
      where: { userId_promotionId: { userId, promotionId } },
      create: { userId, promotionId },
      update: {},
    });
  }

  static async removeFavoritePromotion(userId: string, promotionId: string) {
    await prisma.userFavoritePromotion.deleteMany({ where: { userId, promotionId } });
    return { removed: true };
  }
}
