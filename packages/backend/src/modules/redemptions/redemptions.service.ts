import crypto from 'crypto';
import { prisma } from '../../shared/config/database';
import { QRCodeService } from '../../shared/services/qrcode.service';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  AppError,
} from '../../shared/utils/errors';

const REDEMPTION_EXPIRY_MINUTES = 10;
const REDEMPTION_CODE_PREFIX = 'LOCO';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars (0,O,1,I)
  let code = '';
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `${REDEMPTION_CODE_PREFIX}-${code}`;
}

export class RedemptionsService {

  static async redeemPromotion(
    promotionId: string,
    userId: string,
    latitude?: number,
    longitude?: number
  ) {
    // 1. Fetch promotion with shop locations
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            isActive: true,
            locations: { where: { isActive: true }, select: { id: true, latitude: true, longitude: true } },
          },
        },
      },
    });

    if (!promotion) throw new NotFoundError('Promotion not found');
    if (promotion.status !== 'active') throw new BadRequestError('This promotion is not currently active');
    if (new Date(promotion.endDate) < new Date()) throw new BadRequestError('This promotion has expired');
    if (!promotion.shop.isActive) throw new BadRequestError('This shop is no longer active');

    // 2. Location check — if user coordinates provided, verify within radius
    if (latitude !== undefined && longitude !== undefined && promotion.shop.locations.length > 0) {
      const R = 6371000;
      const withinRadius = promotion.shop.locations.some((loc) => {
        const φ1 = (latitude * Math.PI) / 180;
        const φ2 = (loc.latitude * Math.PI) / 180;
        const Δφ = ((loc.latitude - latitude) * Math.PI) / 180;
        const Δλ = ((loc.longitude - longitude) * Math.PI) / 180;
        const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
        const distanceMeters = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return distanceMeters <= promotion.radiusMeters;
      });

      if (!withinRadius) {
        throw new ForbiddenError(`You must be within ${promotion.radiusMeters}m of the store to redeem this offer`);
      }
    }

    // 3. Check per-user redemption limit
    if (promotion.maxRedemptionsPerUser) {
      const userRedemptionCount = await prisma.promotionRedemption.count({
        where: { promotionId, userId },
      });
      if (userRedemptionCount >= promotion.maxRedemptionsPerUser) {
        throw new BadRequestError(
          `You have already redeemed this offer the maximum number of times (${promotion.maxRedemptionsPerUser})`
        );
      }
    }

    // 4. Check total redemption limit
    if (promotion.maxTotalRedemptions && promotion.currentRedemptions >= promotion.maxTotalRedemptions) {
      throw new BadRequestError('This offer has reached its maximum number of redemptions');
    }

    // 5. Generate unique code with retry (extremely unlikely to collide but safe)
    let code: string;
    let attempts = 0;
    do {
      code = generateCode();
      attempts++;
      if (attempts > 10) throw new AppError('Failed to generate unique redemption code', 500);
    } while (await prisma.promotionRedemption.findUnique({ where: { redemptionCode: code } }));

    // 6. Create redemption record
    const expiresAt = new Date(Date.now() + REDEMPTION_EXPIRY_MINUTES * 60 * 1000);

    const redemption = await prisma.promotionRedemption.create({
      data: {
        promotionId,
        userId,
        redemptionCode: code,
        isVerified: false,
      },
    });

    // 7. Increment counter on promotion
    await prisma.promotion.update({
      where: { id: promotionId },
      data: { currentRedemptions: { increment: 1 } },
    });

    // 8. Generate QR code
    const qrCodeBase64 = await QRCodeService.generateRedemptionQR(code);

    return {
      redemptionId: redemption.id,
      code,
      qrCodeBase64,
      expiresAt: expiresAt.toISOString(),
      promotion: {
        id: promotion.id,
        title: promotion.title,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue,
      },
      shop: {
        id: promotion.shop.id,
        name: promotion.shop.name,
      },
    };
  }

  static async verifyCode(code: string, shopId: string) {
    // 1. Find the redemption record
    const redemption = await prisma.promotionRedemption.findUnique({
      where: { redemptionCode: code },
      include: {
        promotion: {
          include: {
            shop: { select: { id: true, name: true } },
          },
        },
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!redemption) throw new NotFoundError('Redemption code not found');

    // 2. Security: verify code belongs to this shop
    if (redemption.promotion.shopId !== shopId) {
      throw new ForbiddenError('This code does not belong to your shop');
    }

    // 3. Check not already used
    if (redemption.isVerified) {
      throw new BadRequestError(
        `Code already verified on ${redemption.verifiedAt?.toISOString()}`
      );
    }

    // 4. Check expiry (10 minutes from creation)
    const expiryTime = new Date(redemption.redeemedAt.getTime() + REDEMPTION_EXPIRY_MINUTES * 60 * 1000);
    if (new Date() > expiryTime) {
      throw new BadRequestError('This redemption code has expired (codes are valid for 10 minutes)');
    }

    // 5. Mark as verified
    await prisma.promotionRedemption.update({
      where: { id: redemption.id },
      data: { isVerified: true, verifiedAt: new Date() },
    });

    // 6. Format discount label
    const { discountType, discountValue } = redemption.promotion;
    let discountLabel = 'Special Offer';
    if (discountType === 'percentage') discountLabel = `${discountValue}% OFF`;
    else if (discountType === 'fixed') discountLabel = `$${discountValue} OFF`;
    else if (discountType === 'bogo') discountLabel = 'Buy 1 Get 1 Free';
    else if (discountType === 'freebie') discountLabel = 'Free Item';

    return {
      success: true,
      promotion: {
        id: redemption.promotion.id,
        title: redemption.promotion.title,
        discountLabel,
      },
      user: {
        firstName: redemption.user.firstName,
        lastInitial: redemption.user.lastName ? redemption.user.lastName.charAt(0) + '.' : '',
      },
      redeemedAt: redemption.redeemedAt.toISOString(),
      verifiedAt: new Date().toISOString(),
    };
  }

  static async getShopRedemptions(
    shopId: string,
    filters: { promotionId?: string; startDate?: string; endDate?: string; page?: number; limit?: number }
  ) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      promotion: { shopId },
    };
    if (filters.promotionId) where.promotionId = filters.promotionId;
    if (filters.startDate) where.redeemedAt = { ...(where.redeemedAt || {}), gte: new Date(filters.startDate) };
    if (filters.endDate) where.redeemedAt = { ...(where.redeemedAt || {}), lte: new Date(filters.endDate) };

    const [redemptions, total] = await Promise.all([
      prisma.promotionRedemption.findMany({
        where,
        include: {
          promotion: { select: { id: true, title: true, discountType: true, discountValue: true } },
          user: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { redeemedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.promotionRedemption.count({ where }),
    ]);

    return { redemptions, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
