import Fastify from 'fastify';
import cors from '@fastify/cors';
import { ZodError } from 'zod';
import { authRoutes } from './modules/auth/auth.routes';
import { locationsRoutes } from './modules/locations/locations.routes';
import { profileRoutes } from './modules/profile/profile.routes';
import { promotionsRoutes } from './modules/promotions/promotions.routes';
import { usersRoutes } from './modules/users/users.routes';
import { shopsRoutes } from './modules/shops/shops.routes';
import { prisma } from './shared/config/database';
import { AppError } from './shared/utils/errors';
import { redemptionsRoutes } from './modules/redemptions/redemptions.routes';
import { notificationsRoutes } from './modules/notifications/notifications.routes';
import { discoveryRoutes } from './modules/discovery/discovery.routes';
import { analyticsRoutes } from './modules/analytics/analytics.routes';

// Extend Fastify instance to include prisma
declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}

export async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport:
        process.env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
  });

  // Register CORS
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
    credentials: true,
  });

  // Register rate limiting
  await fastify.register(import('@fastify/rate-limit'), {
    global: false,
    keyGenerator: (request) => request.ip,
  });

  // Add prisma to fastify instance
  fastify.decorate('prisma', prisma);

  // Health check route
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API routes
  fastify.register(
    async (instance) => {
      // Register auth routes
      instance.register(authRoutes, { prefix: '/auth' });

      // Register locations routes
      instance.register(locationsRoutes);

      // Register profile routes
      instance.register(profileRoutes);

      // Register promotions routes
      instance.register(promotionsRoutes);

      // Register users routes
      instance.register(usersRoutes);

      // Register public shops routes
      instance.register(shopsRoutes);

      // Register redemptions routes
      instance.register(redemptionsRoutes);

      // Register notifications routes
      instance.register(notificationsRoutes);

      // Register discovery routes
      instance.register(discoveryRoutes);

      // Register analytics routes
      instance.register(analyticsRoutes);
    },
    { prefix: '/api/v1' }
  );

  // Global error handler
  fastify.setErrorHandler((error, request, reply) => {
    // Log error
    request.log.error(error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return reply.status(400).send({
        success: false,
        error: 'Validation Error',
        details: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    // Handle custom app errors
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: error.message,
      });
    }

    // Handle Fastify errors
    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        success: false,
        error: error.message,
      });
    }

    // Default to 500 server error
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  });

  // 404 handler
  fastify.setNotFoundHandler((request, reply) => {
    return reply.status(404).send({
      success: false,
      error: 'Route not found',
      path: request.url,
    });
  });

  return fastify;
}
