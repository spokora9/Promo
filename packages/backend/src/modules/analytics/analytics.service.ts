import { prisma } from '../../shared/config/database';
import { redis, CACHE_TTL } from '../../shared/config/redis';

type Period = '24h' | '7d' | '30d';

function getPeriodStart(period: Period): Date {
  const now = new Date();
  switch (period) {
    case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d':  return new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
    case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

export class AnalyticsService {

  // Dashboard overview — aggregated stats for a shop
  static async getOverview(shopId: string) {
    const cacheKey = `analytics:overview:${shopId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const now = new Date();

    // Active promotions count
    const activePromotions = await prisma.promotion.count({
      where: { shopId, status: 'active', endDate: { gte: now } },
    });

    // Views by period
    const [views24h, views7d, views30d] = await Promise.all([
      prisma.promotionView.count({
        where: { promotion: { shopId }, viewedAt: { gte: getPeriodStart('24h') } },
      }),
      prisma.promotionView.count({
        where: { promotion: { shopId }, viewedAt: { gte: getPeriodStart('7d') } },
      }),
      prisma.promotionView.count({
        where: { promotion: { shopId }, viewedAt: { gte: getPeriodStart('30d') } },
      }),
    ]);

    // Redemptions by period
    const [redemptions24h, redemptions7d, redemptions30d] = await Promise.all([
      prisma.promotionRedemption.count({
        where: { promotion: { shopId }, redeemedAt: { gte: getPeriodStart('24h') } },
      }),
      prisma.promotionRedemption.count({
        where: { promotion: { shopId }, redeemedAt: { gte: getPeriodStart('7d') } },
      }),
      prisma.promotionRedemption.count({
        where: { promotion: { shopId }, redeemedAt: { gte: getPeriodStart('30d') } },
      }),
    ]);

    // Conversion rate (7d)
    const conversionRate7d = views7d > 0
      ? ((redemptions7d / views7d) * 100).toFixed(1) + '%'
      : '0%';

    // Top promotion by views (7d)
    const topPromos = await prisma.promotionView.groupBy({
      by: ['promotionId'],
      where: {
        promotion: { shopId },
        viewedAt: { gte: getPeriodStart('7d') },
      },
      _count: { promotionId: true },
      orderBy: { _count: { promotionId: 'desc' } },
      take: 1,
    });

    let topPromotion = null;
    if (topPromos.length > 0) {
      const promo = await prisma.promotion.findUnique({
        where: { id: topPromos[0].promotionId },
        select: { id: true, title: true },
      });
      const redemptionCount = await prisma.promotionRedemption.count({
        where: { promotionId: topPromos[0].promotionId, redeemedAt: { gte: getPeriodStart('7d') } },
      });
      if (promo) {
        topPromotion = {
          id: promo.id,
          title: promo.title,
          views: topPromos[0]._count.promotionId,
          redemptions: redemptionCount,
        };
      }
    }

    const result = {
      activePromotions,
      totalViews: { '24h': views24h, '7d': views7d, '30d': views30d },
      totalRedemptions: { '24h': redemptions24h, '7d': redemptions7d, '30d': redemptions30d },
      conversionRate7d,
      topPromotion,
    };

    await redis.setex(cacheKey, CACHE_TTL.NEARBY_PROMOTIONS, JSON.stringify(result));
    return result;
  }

  // Per-promotion analytics
  static async getPromotionAnalytics(promotionId: string, shopId: string) {
    // Verify ownership
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
      select: { id: true, shopId: true, title: true, status: true, startDate: true, endDate: true },
    });

    if (!promotion || promotion.shopId !== shopId) {
      throw new Error('Promotion not found');
    }

    const [totalViews, totalRedemptions, uniqueViewers] = await Promise.all([
      prisma.promotionView.count({ where: { promotionId } }),
      prisma.promotionRedemption.count({ where: { promotionId } }),
      prisma.promotionView.groupBy({
        by: ['userId'],
        where: { promotionId, userId: { not: null } },
      }),
    ]);

    const conversionRate = totalViews > 0
      ? ((totalRedemptions / totalViews) * 100).toFixed(1) + '%'
      : '0%';

    // Average distance
    const distanceAgg = await prisma.promotionView.aggregate({
      where: { promotionId, userDistanceMeters: { not: null } },
      _avg: { userDistanceMeters: true },
    });
    const avgDistanceMeters = Math.round(distanceAgg._avg.userDistanceMeters ?? 0);

    // Views by day (last 30 days)
    const thirtyDaysAgo = getPeriodStart('30d');
    const viewsByDay = await prisma.$queryRaw<Array<{ date: string; count: number }>>`
      SELECT
        DATE(viewed_at) as date,
        COUNT(*)::int as count
      FROM promotion_views
      WHERE promotion_id = ${promotionId}
        AND viewed_at >= ${thirtyDaysAgo}
      GROUP BY DATE(viewed_at)
      ORDER BY date ASC
    `;

    const redemptionsByDay = await prisma.$queryRaw<Array<{ date: string; count: number }>>`
      SELECT
        DATE(redeemed_at) as date,
        COUNT(*)::int as count
      FROM promotion_redemptions
      WHERE promotion_id = ${promotionId}
        AND redeemed_at >= ${thirtyDaysAgo}
      GROUP BY DATE(redeemed_at)
      ORDER BY date ASC
    `;

    return {
      promotion,
      totalViews,
      uniqueViewers: uniqueViewers.length,
      totalRedemptions,
      conversionRate,
      avgDistanceMeters,
      viewsByDay,
      redemptionsByDay,
    };
  }
}
