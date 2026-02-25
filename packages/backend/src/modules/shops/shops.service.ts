import { prisma } from '../../shared/config/database';
import { NotFoundError } from '../../shared/utils/errors';

export class ShopsService {
  // Get public shop profile with active promotions
  static async getPublicShop(shopId: string) {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId, isActive: true },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        description: true,
        category: true,
        locations: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            latitude: true,
            longitude: true,
            phone: true,
          },
        },
        promotions: {
          where: {
            status: 'active',
            endDate: { gte: new Date() },
            startDate: { lte: new Date() },
          },
          select: {
            id: true,
            title: true,
            discountType: true,
            discountValue: true,
            endDate: true,
            isDiscoveryOffer: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!shop) throw new NotFoundError('Shop not found');

    return {
      ...shop,
      activePromotions: shop.promotions,
    };
  }
}
