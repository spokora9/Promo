import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../../shared/config/database';
import { UnauthorizedError, BadRequestError } from '../../shared/utils/errors';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET environment variables are required');
}
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';
const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;
const SALT_ROUNDS = 10;

interface TokenPayload {
  id: string;
  email: string;
  type: 'shop' | 'user';
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Verify password
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate access token (no jti needed — short-lived, not stored)
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  // Generate refresh token with jti — store in DB for revocation support
  static async generateAndStoreRefreshToken(payload: TokenPayload): Promise<string> {
    const jti = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS);

    const token = jwt.sign({ ...payload, jti }, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    await prisma.refreshToken.create({
      data: {
        jti,
        subjectId: payload.id,
        subjectType: payload.type,
        expiresAt,
      },
    });

    return token;
  }

  // Generate both tokens
  static async generateTokens(payload: TokenPayload): Promise<AuthTokens> {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = await this.generateAndStoreRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  // Verify access token
  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  // Verify refresh token signature and return decoded payload + jti
  static verifyRefreshTokenSignature(token: string): TokenPayload & { jti: string } {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload & { jti: string };
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  // Register shop
  static async registerShop(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    // Check if shop already exists
    const existingShop = await prisma.shop.findUnique({
      where: { email: data.email },
    });

    if (existingShop) {
      throw new BadRequestError('Shop with this email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(data.password);

    // Create shop
    const shop = await prisma.shop.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        phone: data.phone,
        status: 'active',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens({
      id: shop.id,
      email: shop.email,
      type: 'shop',
    });

    return {
      shop,
      ...tokens,
    };
  }

  // Login shop
  static async loginShop(email: string, password: string) {
    // Find shop
    const shop = await prisma.shop.findUnique({
      where: { email },
    });

    if (!shop) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(password, shop.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if shop is active
    if (shop.status !== 'active') {
      throw new UnauthorizedError('Account is not active');
    }

    // Update last login
    await prisma.shop.update({
      where: { id: shop.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = await this.generateTokens({
      id: shop.id,
      email: shop.email,
      type: 'shop',
    });

    return {
      shop: {
        id: shop.id,
        name: shop.name,
        email: shop.email,
        phone: shop.phone,
        status: shop.status,
        logoUrl: shop.logoUrl,
      },
      ...tokens,
    };
  }

  // Register user (customer)
  static async registerUser(data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    password: string;
  }) {
    // Validate that either email or phone is provided
    if (!data.email && !data.phone) {
      throw new BadRequestError('Either email or phone is required');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          data.email ? { email: data.email } : {},
          data.phone ? { phone: data.phone } : {},
        ].filter(condition => Object.keys(condition).length > 0),
      },
    });

    if (existingUser) {
      throw new BadRequestError('User with this email or phone already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        passwordHash,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email || user.phone || '',
      type: 'user',
    });

    return {
      user,
      ...tokens,
    };
  }

  // Login user (customer)
  static async loginUser(emailOrPhone: string, password: string) {
    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhone },
          { phone: emailOrPhone },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(password, user.passwordHash!);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate tokens
    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email || user.phone || '',
      type: 'user',
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
      },
      ...tokens,
    };
  }

  // Refresh access token — validates DB record to support revocation
  static async refreshAccessToken(refreshToken: string) {
    const payload = this.verifyRefreshTokenSignature(refreshToken);

    // Check the DB record exists and hasn't been revoked
    const stored = await prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
    });

    if (!stored) {
      throw new UnauthorizedError('Refresh token not recognised');
    }

    if (stored.revokedAt) {
      throw new UnauthorizedError('Refresh token has been revoked');
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token has expired');
    }

    // Verify subject still exists and is active
    if (payload.type === 'shop') {
      const shop = await prisma.shop.findUnique({ where: { id: payload.id } });
      if (!shop || shop.status !== 'active') {
        throw new UnauthorizedError('Account is not active');
      }
    } else {
      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user) {
        throw new UnauthorizedError('User not found');
      }
    }

    // Rotate: revoke old token, issue new pair
    await prisma.refreshToken.update({
      where: { jti: payload.jti },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.generateTokens({
      id: payload.id,
      email: payload.email,
      type: payload.type,
    });

    return tokens;
  }

  // Revoke a specific refresh token (logout)
  static async revokeRefreshToken(refreshToken: string) {
    try {
      const payload = this.verifyRefreshTokenSignature(refreshToken);
      await prisma.refreshToken.updateMany({
        where: { jti: payload.jti, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } catch {
      // If token is already invalid/expired, silently succeed — logout should always work
    }
  }

  // Revoke all refresh tokens for a subject (force logout everywhere)
  static async revokeAllTokens(subjectId: string, subjectType: 'shop' | 'user') {
    await prisma.refreshToken.updateMany({
      where: { subjectId, subjectType, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
