import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new IORedis(redisUrl, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

redis.on('connect', () => {
  console.info('Redis connected');
});

export const CACHE_TTL = {
  NEARBY_PROMOTIONS: 60 * 5, // 5 minutes
  PROMOTION_DETAIL: 60 * 10, // 10 minutes
  SHOP_DETAIL: 60 * 10,      // 10 minutes
};
