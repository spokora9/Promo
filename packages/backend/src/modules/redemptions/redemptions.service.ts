import { prisma } from '../../shared/config/database';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../shared/utils/errors';
import { QRCodeService } from '../../shared/services/qrcode.service';
import crypto from 'crypto';

const REDEMPTION_EXPIRY_MINUTES = 10;
const DASHBOARD_BASE_URL = process.env.DASHBOARD_URL || 'https://dashboard.loco.app';

export class RedemptionsService {

  // Generate a unique redemption code in format LOCO-XXXXXXXXXX (10 chars = ~52 bits entropy)
  private static generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    const bytes = crypto.randomBytes(10);
    for (const byte of bytes) {
      code += chars[byte % chars.length];
    }
    return `LOCO-${code}`;
  }

  // Customer redeems a promotion — generates a code and QR
  static async redeemPromotion(promotionId: string, userId: string, latitude?: number, longitude?: number) {
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
      include: {
        shop: { select: { id: true, name: true } },
      },
    });

    if (!promotion) throw new NotFoundError('Promotion not found');
    if (promotion.status !== 'active') throw new BadRequestError('Promotion is not active');

    const now = new Date();
    if (promotion.startDate > now) throw new BadRequestError('Promotion has not started yet');
    if (promotion.endDate < now) throw new BadRequestError('Promotion has expired');

    // If coordinates provided, verify user is within radius
    if (latitude !== undefined && longitude !== undefined) {
      const locations = await prisma.shopLocation.findMany({
        where: {
          shopId: promotion.shopId,
          isActive: true,
          ...(promotion.targetAllLocations ? {} : { id: { in: promotion.targetLocationIds } }),
        },
      });

      const withinRadius = locations.some((loc) => {
        const R = 6371000;
        const phi1 = (latitude * Math.PI) / 180;
        const phi2 = (loc.latitude * Math.PI) / 180;
        const dPhi = ((loc.latitude - latitude) * Math.PI) / 180;
        const dLambda = ((loc.longitude - longitude) * Math.PI) / 180;
        const a = Math.sin(dPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
        const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return distance <= promotion.radiusMeters;
      });

      if (!withinRadius) {
        throw new BadRequestError('You must be near the store to redeem this promotion');
      }
    }

    // Generate unique code outside transaction (crypto is safe to retry)
    let code: string;
    let attempts = 0;
    do {
      code = this.generateCode();
      attempts++;
      if (attempts > 10) throw new BadRequestError('Failed to generate unique code, please try again');
    } while (await prisma.promotionRedemption.findUnique({ where: { redemptionCode: code } }));

    // Serializable transaction: re-check limits atomically + create record
    // Prevents race condition where concurrent requests both pass the limit check
    const redemption = await prisma.$transaction(async (tx) => {
      // Re-read promotion inside transaction for accurate count
      const current = await tx.promotion.findUnique({ where: { id: promotionId } });
      if (!current) throw new NotFoundError('Promotion not found');

      // Atomic max total redemptions check (count actual records, not just counter)
      if (current.maxTotalRedemptions !== null) {
        const totalCount = await tx.promotionRedemption.count({ where: { promotionId } });
        if (totalCount >= current.maxTotalRedemptions) {
          throw new BadRequestError('This promotion has reached its maximum redemptions');
        }
      }

      // Atomic per-user limit check
      if (current.maxRedemptionsPerUser !== null) {
        const userCount = await tx.promotionRedemption.count({ where: { promotionId, userId } });
        if (userCount >= (current.maxRedemptionsPerUser ?? 1)) {
          throw new BadRequestError('You have already redeemed this promotion the maximum number of times');
        }
      }

      return tx.promotionRedemption.create({
        data: {
          promotionId,
          userId,
          redemptionCode: code,
          isVerified: false,
        },
      });
    }, { isolationLevel: 'Serializable' });

    const expiresAt = new Date(now.getTime() + REDEMPTION_EXPIRY_MINUTES * 60 * 1000);

    // Generate QR code pointing to dashboard verify URL
    const verifyUrl = `${DASHBOARD_BASE_URL}/verify?code=${code}`;
    const qrCodeBase64 = await QRCodeService.generateBase64(verifyUrl);

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
        shopName: promotion.shop.name,
      },
    };
  }

  // Shop verifies a redemption code
  static async verifyCode(code: string, shopId: string) {
    const redemption = await prisma.promotionRedemption.findUnique({
      where: { redemptionCode: code },
      include: {
        promotion: {
          select: {
            id: true,
            title: true,
            shopId: true,
            discountType: true,
            discountValue: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!redemption) throw new NotFoundError('Redemption code not found');

    // Security: ensure code belongs to this shop
    if (redemption.promotion.shopId !== shopId) {
      throw new ForbiddenError('This code does not belong to your shop');
    }

    // Check already verified
    if (redemption.isVerified) {
      throw new BadRequestError('This code has already been used');
    }

    // Check expiry (10 minutes)
    const expiresAt = new Date(redemption.redeemedAt.getTime() + REDEMPTION_EXPIRY_MINUTES * 60 * 1000);
    if (new Date() > expiresAt) {
      throw new BadRequestError('This redemption code has expired');
    }

    // Mark as verified + increment counter
    await prisma.$transaction([
      prisma.promotionRedemption.update({
        where: { id: redemption.id },
        data: { isVerified: true, verifiedAt: new Date() },
      }),
      prisma.promotion.update({
        where: { id: redemption.promotion.id },
        data: { currentRedemptions: { increment: 1 } },
      }),
    ]);

    let discountLabel = 'Special Offer';
    if (redemption.promotion.discountType === 'percentage') {
      discountLabel = `${redemption.promotion.discountValue}% OFF`;
    } else if (redemption.promotion.discountType === 'fixed') {
      discountLabel = `$${redemption.promotion.discountValue} OFF`;
    } else if (redemption.promotion.discountType === 'bogo') {
      discountLabel = 'Buy 1 Get 1 Free';
    } else if (redemption.promotion.discountType === 'freebie') {
      discountLabel = 'Free Item';
    }

    return {
      promotion: {
        id: redemption.promotion.id,
        title: redemption.promotion.title,
        discountLabel,
      },
      customer: {
        firstName: redemption.user.firstName,
        lastName: redemption.user.lastName ? `${redemption.user.lastName.charAt(0)}.` : '',
      },
      redeemedAt: redemption.redeemedAt.toISOString(),
      verifiedAt: new Date().toISOString(),
    };
  }

  // Get redemption history for a user
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
      take: 200,
    });
  }

  // Get redemption history for a shop
  static async getShopRedemptions(shopId: string, filters?: { promotionId?: string; startDate?: Date; endDate?: Date }) {
    return prisma.promotionRedemption.findMany({
      where: {
        promotion: { shopId },
        ...(filters?.promotionId && { promotionId: filters.promotionId }),
        ...(filters?.startDate && { redeemedAt: { gte: filters.startDate } }),
        ...(filters?.endDate && { redeemedAt: { lte: filters.endDate } }),
      },
      include: {
        promotion: { select: { id: true, title: true, discountType: true, discountValue: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { redeemedAt: 'desc' },
      take: 100,
    });
  }
}
