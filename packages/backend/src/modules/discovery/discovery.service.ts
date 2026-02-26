import { prisma } from '../../shared/config/database';

export class DiscoveryService {

  // Get shops with discovery offers near a location that the user hasn't followed yet
  static async getDiscoveryFeed(
    userId: string,
    latitude: number,
    longitude: number,
    radiusMeters = 10000,
    mode = 'active'
  ) {
    if (mode === 'off') return [];

    const now = new Date();

    // Get shops the user already follows
    const followedShopIds = await prisma.userShopPreference.findMany({
      where: { userId },
      select: { shopId: true },
    });
    const followedIds = followedShopIds.map((p) => p.shopId);

    // Find shops with discovery offers nearby that user doesn't follow
    const shops = await prisma.$queryRaw<any[]>`
      SELECT DISTINCT
        s.id,
        s.name,
        s.logo_url AS "logoUrl",
        s.description,
        s.category,
        COUNT(DISTINCT p.id) AS "discoveryOfferCount",
        MIN(ST_Distance(
          ST_MakePoint(${longitude}, ${latitude})::geography,
          ST_MakePoint(sl.longitude, sl.latitude)::geography
        ))::int AS "distanceMeters"
      FROM shops s
      JOIN shop_locations sl ON sl.shop_id = s.id AND sl.is_active = true
      JOIN promotions p ON
        p.shop_id = s.id
        AND p.status = 'active'
        AND p.is_discovery_offer = true
        AND p.start_date <= ${now}
        AND p.end_date >= ${now}
      WHERE
        s.is_active = true
        AND s.id NOT IN (${followedIds.length > 0 ? followedIds.join(',') : 'null'})
        AND ST_DWithin(
          ST_MakePoint(${longitude}, ${latitude})::geography,
          ST_MakePoint(sl.longitude, sl.latitude)::geography,
          ${radiusMeters}
        )
      GROUP BY s.id, s.name, s.logo_url, s.description, s.category
      ORDER BY "distanceMeters" ASC
      LIMIT 20
    `;

    // Track discovery exposures for each shop returned
    for (const shop of shops) {
      await prisma.discoveryExposure.upsert({
        where: { userId_shopId: { userId, shopId: shop.id } },
        create: {
          userId,
          shopId: shop.id,
          exposureCount: 1,
          lastExposureAt: now,
        },
        update: {
          exposureCount: { increment: 1 },
          lastExposureAt: now,
        },
      }).catch(() => {}); // non-critical
    }

    return shops;
  }

  // User dismisses a discovery shop
  static async dismissShop(userId: string, shopId: string) {
    await prisma.discoveryExposure.upsert({
      where: { userId_shopId: { userId, shopId } },
      create: {
        userId,
        shopId,
        totalDismissals: 1,
        status: 'dismissed',
      },
      update: {
        totalDismissals: { increment: 1 },
        status: 'dismissed',
      },
    });
    return { dismissed: true };
  }

  // User marks not interested
  static async notInterested(userId: string, shopId: string) {
    await prisma.discoveryExposure.upsert({
      where: { userId_shopId: { userId, shopId } },
      create: {
        userId,
        shopId,
        totalNotInterested: 1,
        status: 'not_interested',
      },
      update: {
        totalNotInterested: { increment: 1 },
        status: 'not_interested',
      },
    });
    return { recorded: true };
  }
}
