import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { prisma } from '../config/database';

const expo = new Expo();

export class ExpoPushService {
  // Send push notifications in batches of 100
  static async sendNotifications(messages: ExpoPushMessage[]): Promise<ExpoPushTicket[]> {
    const validMessages = messages.filter((msg) =>
      Expo.isExpoPushToken(msg.to as string)
    );

    if (validMessages.length === 0) return [];

    const chunks = expo.chunkPushNotifications(validMessages);
    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      try {
        const chunkTickets = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...chunkTickets);
      } catch (error) {
        console.error('Error sending push notification chunk:', error);
      }
    }

    return tickets;
  }

  // Send a single notification to a user
  static async sendToUser(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, any>,
    channelId = 'default'
  ): Promise<void> {
    const pushTokens = await prisma.pushToken.findMany({
      where: { userId },
    });

    if (pushTokens.length === 0) return;

    const messages: ExpoPushMessage[] = pushTokens.map((pt) => ({
      to: pt.token,
      title,
      body,
      data: data || {},
      channelId,
      sound: 'default',
      priority: 'high',
    }));

    const tickets = await this.sendNotifications(messages);

    // Handle DeviceNotRegistered errors — remove stale tokens
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      if (ticket.status === 'error') {
        const details = (ticket as any).details;
        if (details?.error === 'DeviceNotRegistered') {
          await prisma.pushToken.deleteMany({
            where: { token: pushTokens[i]?.token },
          }).catch(() => {});
        }
      }
    }
  }
}
