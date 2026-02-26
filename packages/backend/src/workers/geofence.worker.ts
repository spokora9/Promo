import { Worker, Queue } from 'bullmq';
import { redis } from '../shared/config/redis';
import { prisma } from '../shared/config/database';
import { NotificationsService } from '../modules/notifications/notifications.service';

const COOLDOWN_HOURS = Number(process.env.NOTIFICATION_COOLDOWN_HOURS) || 4;
const LOCATION_STALENESS_MINUTES = 10;

export interface GeofenceJob {
  triggeredAt: string;
}

export interface NotificationJob {
  userId: string;
  promotionId: string;
}

export const notificationQueue = new Queue<NotificationJob>('notifications', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
  },
});

async function runGeofenceScan(): Promise<void> {
  const now = new Date();
  const locationCutoff = new Date(now.getTime() - LOCATION_STALENESS_MINUTES * 60 * 1000);

  // Find all users+promotions where user is within promotion radius
  const matches = await prisma.$queryRaw<Array<{ userId: string; promotionId: string }>>`
    SELECT DISTINCT
      ul.user_id AS "userId",
      p.id AS "promotionId"
    FROM user_locations ul
    JOIN users u ON u.id = ul.user_id
    JOIN promotions p ON
      p.status = 'active'
      AND p.start_date <= ${now}
      AND p.end_date >= ${now}
    JOIN shops s ON s.id = p.shop_id AND s.is_active = true
    JOIN shop_locations sl ON
      sl.shop_id = s.id
      AND sl.is_active = true
      AND (p.target_all_locations = true OR sl.id = ANY(p.target_location_ids))
    WHERE
      u.push_notifications_enabled = true
      AND u.location_sharing_enabled = true
      AND ul.updated_at >= ${locationCutoff}
      AND ST_DWithin(
        ST_MakePoint(ul.longitude, ul.latitude)::geography,
        ST_MakePoint(sl.longitude, sl.latitude)::geography,
        p.radius_meters
      )
    LIMIT 500
  `;

  if (matches.length === 0) return;

  console.info(`[Geofence] Found ${matches.length} user-promotion matches`);

  for (const match of matches) {
    // Check cooldown before queuing
    const recentlyNotified = await NotificationsService.wasRecentlyNotified(
      match.userId,
      match.promotionId,
      COOLDOWN_HOURS
    );

    if (!recentlyNotified) {
      await notificationQueue.add('send-proximity-notification', {
        userId: match.userId,
        promotionId: match.promotionId,
      });
    }
  }
}

export function startGeofenceWorker(): Worker {
  const geofenceQueue = new Queue<GeofenceJob>('geofence', { connection: redis });

  // Schedule repeating geofence scan every 5 minutes
  const INTERVAL_MS = Number(process.env.GEOFENCE_INTERVAL_MS) || 5 * 60 * 1000;
  geofenceQueue.add(
    'scan',
    { triggeredAt: new Date().toISOString() },
    { repeat: { every: INTERVAL_MS }, jobId: 'geofence-scan' }
  ).catch(console.error);

  const worker = new Worker<GeofenceJob>(
    'geofence',
    async (job) => {
      console.info(`[Geofence] Running scan — triggered at ${job.data.triggeredAt}`);
      await runGeofenceScan();
    },
    { connection: redis, concurrency: 1 }
  );

  worker.on('failed', (job, err) => {
    console.error(`[Geofence] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
