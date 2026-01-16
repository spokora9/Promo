import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../../modules/auth/auth.service';
import { UnauthorizedError } from '../utils/errors';

// Extend FastifyRequest to include user property
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      type: 'shop' | 'user';
    };
  }
}

// Extract token from Authorization header
function extractToken(request: FastifyRequest): string {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('No authorization header provided');
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedError('Invalid authorization header format');
  }

  return parts[1];
}

// General authentication middleware (for both shops and users)
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const token = extractToken(request);
    const payload = AuthService.verifyAccessToken(token);
    request.user = payload;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

// Shop-specific authentication middleware
export async function authenticateShop(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await authenticate(request, reply);

  if (request.user?.type !== 'shop') {
    throw new UnauthorizedError('Shop authentication required');
  }
}

// User-specific authentication middleware
export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await authenticate(request, reply);

  if (request.user?.type !== 'user') {
    throw new UnauthorizedError('User authentication required');
  }
}
