import { prisma } from '../../shared/config/database';
import { NotFoundError } from '../../shared/utils/errors';
import { UpdateShopProfileInput, UpdateUserProfileInput } from './profile.schema';

export class ProfileService {
  // Get shop profile
  static async getShopProfile(shopId: string) {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        logoUrl: true,
        description: true,
        website: true,
        category: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            locations: true,
            promotions: true,
          },
        },
      },
    });

    if (!shop) {
      throw new NotFoundError('Shop not found');
    }

    return shop;
  }

  // Update shop profile
  static async updateShopProfile(shopId: string, data: UpdateShopProfileInput) {
    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.website !== undefined && { website: data.website }),
        ...(data.category !== undefined && { category: data.category }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        logoUrl: true,
        description: true,
        website: true,
        category: true,
        status: true,
        createdAt: true,
      },
    });

    return shop;
  }

  // Get user profile
  static async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        notificationPreferences: true,
        discoveryMode: true,
        maxDistanceMeters: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  // Update user profile
  static async updateUserProfile(userId: string, data: UpdateUserProfileInput) {
    const updateData: any = {};

    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;

    // Handle notification preferences
    if (data.notificationPreferences) {
      const prefs = data.notificationPreferences;

      if (prefs.pushEnabled !== undefined) {
        updateData.notificationPreferences = {
          ...(updateData.notificationPreferences || {}),
          pushEnabled: prefs.pushEnabled,
        };
      }
      if (prefs.emailEnabled !== undefined) {
        updateData.notificationPreferences = {
          ...(updateData.notificationPreferences || {}),
          emailEnabled: prefs.emailEnabled,
        };
      }
      if (prefs.smsEnabled !== undefined) {
        updateData.notificationPreferences = {
          ...(updateData.notificationPreferences || {}),
          smsEnabled: prefs.smsEnabled,
        };
      }
      if (prefs.discoveryMode) {
        updateData.discoveryMode = prefs.discoveryMode;
      }
      if (prefs.maxDistance) {
        updateData.maxDistanceMeters = prefs.maxDistance;
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        notificationPreferences: true,
        discoveryMode: true,
        maxDistanceMeters: true,
        createdAt: true,
      },
    });

    return user;
  }

  // Update shop logo URL
  static async updateShopLogo(shopId: string, logoUrl: string) {
    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: { logoUrl },
      select: {
        id: true,
        name: true,
        logoUrl: true,
      },
    });

    return shop;
  }

  // Update user avatar URL
  static async updateUserAvatar(userId: string, avatarUrl: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
    });

    return user;
  }
}
