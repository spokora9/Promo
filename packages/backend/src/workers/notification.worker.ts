import { Worker } from 'bullmq';
import { redis } from '../shared/config/redis';
import { NotificationsService } from '../modules/notifications/notifications.service';
import { NotificationJob } from './geofence.worker';

export function startNotificationWorker(): Worker {
  const worker = new Worker<NotificationJob>(
    'notifications',
    async (job) => {
      const { userId, promotionId } = job.data;
      console.info(`[Notifications] Sending proximity notification — user: ${userId}, promo: ${promotionId}`);
      await NotificationsService.sendProximityNotification(userId, promotionId);
    },
    {
      connection: redis,
      concurrency: 10,
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`[Notifications] Job ${job?.id} failed:`, err.message);
  });

  worker.on('completed', (job) => {
    console.info(`[Notifications] Job ${job.id} completed`);
  });

  return worker;
}
