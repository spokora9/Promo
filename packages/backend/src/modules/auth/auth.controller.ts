import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import {
  shopRegisterSchema,
  shopLoginSchema,
  userRegisterSchema,
  userLoginSchema,
  refreshTokenSchema,
} from './auth.schema';

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

  // Logout (client-side token removal, but we can blacklist tokens in future)
  static async logout(request: FastifyRequest, reply: FastifyReply) {
    // For now, logout is handled client-side by removing tokens
    // In production, you might want to implement token blacklisting with Redis
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
