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
          select: { redemptions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return promotions;
  }

  // Get a single promotion by ID (shop-owned)
  static async getPromotionById(promotionId: string, shopId: string) {
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
      include: {
        _count: {
          select: { redemptions: true },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundError('Promotion not found');
    }

    if (promotion.shopId !== shopId) {
      throw new ForbiddenError('You do not have permission to access this promotion');
    }

    return promotion;
  }

  // Create a new promotion
  static async createPromotion(shopId: string, data: CreatePromotionInput) {
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });

    if (!shop) {
      throw new NotFoundError('Shop not found');
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate <= startDate) {
      throw new BadRequestError('End date must be after start date');
    }

    if (!data.targetAllLocations && (!data.targetLocationIds || data.targetLocationIds.length === 0)) {
      throw new BadRequestError('Must target all locations or specify at least one location');
    }

    if (data.targetLocationIds && data.targetLocationIds.length > 0) {
      const locations = await prisma.shopLocation.findMany({
        where: { id: { in: data.targetLocationIds }, shopId },
      });

      if (locations.length !== data.targetLocationIds.length) {
        throw new BadRequestError('One or more specified locations do not belong to your shop');
      }
    }

    const now = new Date();
    const status = startDate <= now ? 'active' : 'draft';

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
  static async updatePromotion(promotionId: string, shopId: string, data: UpdatePromotionInput) {
    await this.getPromotionById(promotionId, shopId);

    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      if (endDate <= startDate) {
        throw new BadRequestError('End date must be after start date');
      }
    }

    if (data.targetAllLocations === false && (!data.targetLocationIds || data.targetLocationIds.length === 0)) {
      throw new BadRequestError('Must target all locations or specify at least one location');
    }

    if (data.targetLocationIds && data.targetLocationIds.length > 0) {
      const locations = await prisma.shopLocation.findMany({
        where: { id: { in: data.targetLocationIds }, shopId },
      });

      if (locations.length !== data.targetLocationIds.length) {
        throw new BadRequestError('One or more specified locations do not belong to your shop');
      }
    }

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
    await this.getPromotionById(promotionId, shopId);

    const redemptionCount = await prisma.promotionRedemption.count({
      where: { promotionId },
    });

    if (redemptionCount > 0) {
      throw new BadRequestError(
        'Cannot delete promotion with existing redemptions. Consider deactivating instead.'
      );
    }

    await prisma.promotion.delete({ where: { id: promotionId } });

    return { message: 'Promotion deleted successfully' };
  }

  // Activate a promotion
  static async activatePromotion(promotionId: string, shopId: string) {
    const promotion = await this.getPromotionById(promotionId, shopId);

    if (promotion.endDate < new Date()) {
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

  // Get nearby promotions (for customers) - uses PostGIS
  static async getNearbyPromotions(
    latitude: number,
    longitude: number,
    radiusMeters: number = 5000
  ) {
    const now = new Date();

    // Raw SQL with correct snake_case column/table names matching Prisma @map() values
    const promotions = await prisma.$queryRaw<any[]>`
      SELECT
        p.id,
        p.title,
        p.description,
        p.terms,
        p.discount_type AS "discountType",
        p.discount_value AS "discountValue",
        p.image_url AS "imageUrl",
        p.radius_meters AS "radiusMeters",
        p.start_date AS "startDate",
        p.end_date AS "endDate",
        p.status,
        p.max_redemptions_per_user AS "maxRedemptionsPerUser",
        p.max_total_redemptions AS "maxTotalRedemptions",
        p.current_redemptions AS "currentRedemptions",
        p.is_discovery_offer AS "isDiscoveryOffer",
        s.id AS "shopId",
        s.name AS "shopName",
        s.logo_url AS "shopLogoUrl",
        s.category AS "shopCategory",
        sl.id AS "locationId",
        sl.name AS "locationName",
        sl.address AS "locationAddress",
        sl.city AS "locationCity",
        sl.latitude AS "locationLatitude",
        sl.longitude AS "locationLongitude",
        ST_Distance(
          ST_MakePoint(${longitude}, ${latitude})::geography,
          ST_MakePoint(sl.longitude, sl.latitude)::geography
        )::int AS "distanceMeters"
      FROM promotions p
      JOIN shops s ON s.id = p.shop_id
      JOIN shop_locations sl ON sl.shop_id = s.id
      WHERE
        p.status = 'active'
        AND p.start_date <= ${now}
        AND p.end_date >= ${now}
        AND s.is_active = true
        AND sl.is_active = true
        AND (
          p.target_all_locations = true
          OR sl.id = ANY(p.target_location_ids)
        )
        AND ST_DWithin(
          ST_MakePoint(${longitude}, ${latitude})::geography,
          ST_MakePoint(sl.longitude, sl.latitude)::geography,
          LEAST(p.radius_meters, ${radiusMeters})
        )
      ORDER BY "distanceMeters" ASC
      LIMIT 50
    `;

    return promotions;
  }

  // Get a single promotion publicly (for customers, with distance)
  static async getPublicPromotion(
    promotionId: string,
    latitude?: number,
    longitude?: number
  ) {
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
      include: {
        shop: {
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
          },
        },
        _count: {
          select: { redemptions: true },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundError('Promotion not found');
    }

    // Calculate distance if coordinates provided
    let distanceMeters: number | null = null;
    if (latitude !== undefined && longitude !== undefined && promotion.shop.locations.length > 0) {
      const loc = promotion.shop.locations[0];
      const R = 6371000;
      const φ1 = (latitude * Math.PI) / 180;
      const φ2 = (loc.latitude * Math.PI) / 180;
      const Δφ = ((loc.latitude - latitude) * Math.PI) / 180;
      const Δλ = ((loc.longitude - longitude) * Math.PI) / 180;
      const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
      distanceMeters = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }

    return { ...promotion, distanceMeters };
  }

  // Track a promotion view
  static async trackView(
    promotionId: string,
    userId?: string,
    distanceMeters?: number
  ) {
    const promotion = await prisma.promotion.findUnique({ where: { id: promotionId } });
    if (!promotion) {
      throw new NotFoundError('Promotion not found');
    }

    await prisma.promotionView.create({
      data: {
        promotionId,
        userId: userId || null,
        userDistanceMeters: distanceMeters || null,
      },
    });

    return { message: 'View tracked' };
  }

  // Get promotion statistics (for shop owners)
  static async getPromotionStats(promotionId: string, shopId: string) {
    await this.getPromotionById(promotionId, shopId);

    const totalRedemptions = await prisma.promotionRedemption.count({
      where: { promotionId },
    });

    const uniqueUsers = await prisma.promotionRedemption.groupBy({
      by: ['userId'],
      where: { promotionId },
    });

    const totalViews = await prisma.promotionView.count({
      where: { promotionId },
    });

    return {
      totalViews,
      totalRedemptions,
      uniqueUsers: uniqueUsers.length,
      conversionRate: totalViews > 0 ? ((totalRedemptions / totalViews) * 100).toFixed(1) : '0',
    };
  }
}
