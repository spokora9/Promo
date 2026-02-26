import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import {
  shopRegisterSchema,
  shopLoginSchema,
  userRegisterSchema,
  userLoginSchema,
  refreshTokenSchema,
} from './auth.schema';
import { BadRequestError } from '../../shared/utils/errors';

export class AuthController {
  // Shop registration
  static async registerShop(request: FastifyRequest, reply: FastifyReply) {
    const validatedData = shopRegisterSchema.parse(request.body);
    const result = await AuthService.registerShop(validatedData);

    return reply.code(201).send({
      success: true,
      data: result,
    });
  }

  // Shop login
  static async loginShop(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = shopLoginSchema.parse(request.body);
    const result = await AuthService.loginShop(email, password);

    return reply.send({
      success: true,
      data: result,
    });
  }

  // User registration
  static async registerUser(request: FastifyRequest, reply: FastifyReply) {
    const validatedData = userRegisterSchema.parse(request.body);
    const result = await AuthService.registerUser(validatedData);

    return reply.code(201).send({
      success: true,
      data: result,
    });
  }

  // User login
  static async loginUser(request: FastifyRequest, reply: FastifyReply) {
    const { emailOrPhone, password } = userLoginSchema.parse(request.body);
    const result = await AuthService.loginUser(emailOrPhone, password);

    return reply.send({
      success: true,
      data: result,
    });
  }

  // Refresh token
  static async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    const { refreshToken } = refreshTokenSchema.parse(request.body);
    const result = await AuthService.refreshAccessToken(refreshToken);

    return reply.send({
      success: true,
      data: result,
    });
  }

  // Logout — revokes the provided refresh token so it can't be reused
  static async logout(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    if (!body?.refreshToken) {
      throw new BadRequestError('refreshToken is required to logout');
    }
    await AuthService.revokeRefreshToken(body.refreshToken);
    return reply.send({
      success: true,
      message: 'Logged out successfully',
    });
  }

  // Get current shop
  static async getCurrentShop(request: FastifyRequest, reply: FastifyReply) {
    const shopId = (request as any).user.id;

    const shop = await request.server.prisma.shop.findUnique({
      where: { id: shopId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        logoUrl: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            locations: true,
            promotions: true,
          },
        },
      },
    });

    return reply.send({
      success: true,
      data: shop,
    });
  }

  // Get current user
  static async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;

    const user = await request.server.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return reply.send({
      success: true,
      data: user,
    });
  }
}
