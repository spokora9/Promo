import { Worker, Queue } from 'bullmq';
import { redis } from '../shared/config/redis';
import { prisma } from '../shared/config/database';

async function runLifecycleScan(): Promise<void> {
  const now = new Date();

  // Auto-activate promotions that should now be active
  const activated = await prisma.promotion.updateMany({
    where: {
      status: 'draft',
      startDate: { lte: now },
      endDate: { gte: now },
    },
    data: { status: 'active' },
  });

  // Auto-expire promotions that have passed their end date
  const expired = await prisma.promotion.updateMany({
    where: {
      status: { in: ['active', 'draft'] },
      endDate: { lt: now },
    },
    data: { status: 'expired' },
  });

  if (activated.count > 0) {
    console.info(`[Lifecycle] Auto-activated ${activated.count} promotions`);
  }
  if (expired.count > 0) {
    console.info(`[Lifecycle] Auto-expired ${expired.count} promotions`);
  }

  // Purge expired refresh tokens older than 24 hours to keep the table clean
  const purged = await prisma.refreshToken.deleteMany({
    where: { expiresAt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) } },
  });
  if (purged.count > 0) {
    console.info(`[Lifecycle] Purged ${purged.count} expired refresh tokens`);
  }
}

export function startLifecycleWorker(): Worker {
  const lifecycleQueue = new Queue('promotion-lifecycle', { connection: redis });

  lifecycleQueue.add(
    'scan',
    {},
    { repeat: { every: 60 * 1000 }, jobId: 'lifecycle-scan' }
  ).catch(console.error);

  const worker = new Worker(
    'promotion-lifecycle',
    async () => {
      await runLifecycleScan();
    },
    { connection: redis, concurrency: 1 }
  );

  worker.on('failed', (job, err) => {
    console.error(`[Lifecycle] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
