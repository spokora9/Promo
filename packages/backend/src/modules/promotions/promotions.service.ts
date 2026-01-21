import { prisma } from '../../shared/config/database';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../shared/utils/errors';
import { CreatePromotionInput, UpdatePromotionInput } from './promotions.schema';

export class PromotionsService {
  // Get all promotions for a shop
  static async getShopPromotions(shopId: string) {
    const promotions = await prisma.promotion.findMany({
      where: { shopId },
      include: {
        _count: {
          select: {
            redemptions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return promotions;
  }

  // Get a single promotion by ID
  static async getPromotionById(promotionId: string, shopId: string) {
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
      include: {
        _count: {
          select: {
            redemptions: true,
          },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundError('Promotion not found');
    }

    // Verify ownership
    if (promotion.shopId !== shopId) {
      throw new ForbiddenError('You do not have permission to access this promotion');
    }

    return promotion;
  }

  // Create a new promotion
  static async createPromotion(shopId: string, data: CreatePromotionInput) {
    // Verify shop exists
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      throw new NotFoundError('Shop not found');
    }

    // Validate dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate <= startDate) {
      throw new BadRequestError('End date must be after start date');
    }

    // Validate location targeting
    if (!data.targetAllLocations && (!data.targetLocationIds || data.targetLocationIds.length === 0)) {
      throw new BadRequestError('Must target all locations or specify at least one location');
    }

    // If targeting specific locations, verify they belong to the shop
    if (data.targetLocationIds && data.targetLocationIds.length > 0) {
      const locations = await prisma.shopLocation.findMany({
        where: {
          id: { in: data.targetLocationIds },
          shopId,
        },
      });

      if (locations.length !== data.targetLocationIds.length) {
        throw new BadRequestError('One or more specified locations do not belong to your shop');
      }
    }

    // Determine initial status (active if start date is now or past, draft otherwise)
    const now = new Date();
    const status = startDate <= now ? 'active' : 'draft';

    // Create promotion
    const promotion = await prisma.promotion.create({
      data: {
        shopId,
        title: data.title,
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        targetAllLocations: data.targetAllLocations,
        targetLocationIds: data.targetLocationIds || [],
        radiusMeters: data.radiusMeters,
        maxRedemptionsPerUser: data.maxRedemptionsPerUser,
        maxTotalRedemptions: data.maxTotalRedemptions,
        startDate,
        endDate,
        isDiscoveryOffer: data.isDiscoveryOffer || false,
        terms: data.terms,
        status,
      },
    });

    return promotion;
  }

  // Update a promotion
  static async updatePromotion(
    promotionId: string,
    shopId: string,
    data: UpdatePromotionInput
  ) {
    // Verify promotion exists and belongs to shop
    await this.getPromotionById(promotionId, shopId);

    // Validate dates if both are provided
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (endDate <= startDate) {
        throw new BadRequestError('End date must be after start date');
      }
    }

    // Validate location targeting
    if (data.targetAllLocations === false && (!data.targetLocationIds || data.targetLocationIds.length === 0)) {
      throw new BadRequestError('Must target all locations or specify at least one location');
    }

    // If targeting specific locations, verify they belong to the shop
    if (data.targetLocationIds && data.targetLocationIds.length > 0) {
      const locations = await prisma.shopLocation.findMany({
        where: {
          id: { in: data.targetLocationIds },
          shopId,
        },
      });

      if (locations.length !== data.targetLocationIds.length) {
        throw new BadRequestError('One or more specified locations do not belong to your shop');
      }
    }

    // Update promotion
    const promotion = await prisma.promotion.update({
      where: { id: promotionId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.discountType && { discountType: data.discountType }),
        ...(data.discountValue !== undefined && { discountValue: data.discountValue }),
        ...(data.targetAllLocations !== undefined && { targetAllLocations: data.targetAllLocations }),
        ...(data.targetLocationIds && { targetLocationIds: data.targetLocationIds }),
        ...(data.radiusMeters !== undefined && { radiusMeters: data.radiusMeters }),
        ...(data.maxRedemptionsPerUser !== undefined && { maxRedemptionsPerUser: data.maxRedemptionsPerUser }),
        ...(data.maxTotalRedemptions !== undefined && { maxTotalRedemptions: data.maxTotalRedemptions }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.isDiscoveryOffer !== undefined && { isDiscoveryOffer: data.isDiscoveryOffer }),
        ...(data.terms !== undefined && { terms: data.terms }),
        ...(data.status && { status: data.status }),
      },
    });

    return promotion;
  }

  // Delete a promotion
  static async deletePromotion(promotionId: string, shopId: string) {
    // Verify promotion exists and belongs to shop
    await this.getPromotionById(promotionId, shopId);

    // Check if promotion has redemptions
    const redemptionCount = await prisma.redemption.count({
      where: { promotionId },
    });

    if (redemptionCount > 0) {
      throw new BadRequestError(
        'Cannot delete promotion with existing redemptions. Consider deactivating instead.'
      );
    }

    // Delete promotion
    await prisma.promotion.delete({
      where: { id: promotionId },
    });

    return { message: 'Promotion deleted successfully' };
  }

  // Activate a promotion
  static async activatePromotion(promotionId: string, shopId: string) {
    const promotion = await this.getPromotionById(promotionId, shopId);

    const now = new Date();
    if (promotion.endDate < now) {
      throw new BadRequestError('Cannot activate an expired promotion');
    }

    await prisma.promotion.update({
      where: { id: promotionId },
      data: { status: 'active' },
    });

    return { message: 'Promotion activated successfully' };
  }

  // Pause a promotion
  static async pausePromotion(promotionId: string, shopId: string) {
    await this.getPromotionById(promotionId, shopId);

    await prisma.promotion.update({
      where: { id: promotionId },
      data: { status: 'paused' },
    });

    return { message: 'Promotion paused successfully' };
  }

  // Get nearby promotions (for customers)
  static async getNearbyPromotions(
    latitude: number,
    longitude: number,
    radiusMeters: number = 5000
  ) {
    const now = new Date();

    // Get promotions using raw SQL with PostGIS
    const promotions = await prisma.$queryRaw<any[]>`
      SELECT
        p.*,
        s.name as "shopName",
        s."logoUrl" as "shopLogoUrl",
        sl.name as "locationName",
        sl.latitude as "locationLatitude",
        sl.longitude as "locationLongitude",
        ST_Distance(
          ST_MakePoint(${longitude}, ${latitude})::geography,
          ST_MakePoint(sl.longitude, sl.latitude)::geography
        ) as distance
      FROM "Promotion" p
      JOIN "Shop" s ON s.id = p."shopId"
      JOIN "ShopLocation" sl ON sl."shopId" = s.id
      WHERE
        p.status = 'active'
        AND p."startDate" <= ${now}
        AND p."endDate" >= ${now}
        AND s.status = 'active'
        AND sl."isActive" = true
        AND (
          p."targetAllLocations" = true
          OR sl.id = ANY(p."targetLocationIds")
        )
        AND ST_DWithin(
          ST_MakePoint(${longitude}, ${latitude})::geography,
          ST_MakePoint(sl.longitude, sl.latitude)::geography,
          LEAST(p."radiusMeters", ${radiusMeters})
        )
      ORDER BY distance ASC
      LIMIT 50
    `;

    return promotions;
  }

  // Get promotion statistics
  static async getPromotionStats(promotionId: string, shopId: string) {
    await this.getPromotionById(promotionId, shopId);

    const stats = await prisma.redemption.groupBy({
      by: ['status'],
      where: { promotionId },
      _count: {
        id: true,
      },
    });

    const totalRedemptions = await prisma.redemption.count({
      where: { promotionId },
    });

    const uniqueUsers = await prisma.redemption.groupBy({
      by: ['userId'],
      where: { promotionId },
    });

    return {
      totalRedemptions,
      uniqueUsers: uniqueUsers.length,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.id;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
