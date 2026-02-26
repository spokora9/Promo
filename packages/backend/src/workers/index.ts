import { startGeofenceWorker } from './geofence.worker';
import { startNotificationWorker } from './notification.worker';
import { startLifecycleWorker } from './promotion-lifecycle.worker';

export async function startWorkers(): Promise<void> {
  console.info('[Workers] Starting background workers...');

  const geofenceWorker = startGeofenceWorker();
  const notificationWorker = startNotificationWorker();
  const lifecycleWorker = startLifecycleWorker();

  console.info('[Workers] All workers started');
  console.info('[Workers]   - Geofence scanner (every 5 min)');
  console.info('[Workers]   - Notification worker (concurrent: 10)');
  console.info('[Workers]   - Promotion lifecycle (every 1 min)');

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.info('[Workers] SIGTERM received — shutting down workers');
    await Promise.all([
      geofenceWorker.close(),
      notificationWorker.close(),
      lifecycleWorker.close(),
    ]);
    process.exit(0);
  });
}
