import { PrismaClient } from '../generated/prisma/index.js';
// Precisa da integração com o Firebase para funcionar

const prisma = new PrismaClient();

class PushService {
  // placeholder: registro do token no banco
  async registerToken(userId, fcmToken) {
    const upsert = await prisma.reminder_setting.upsert({
      where: { user_id: userId },
      create: { user_id: userId, fcm_token: fcmToken },
      update: { fcm_token: fcmToken }
    });
    return upsert;
  }

  // placeholder: enviar notificação (simulado)
  async sendNotificationToUser(userId, payload) {
    const setting = await prisma.reminder_setting.findUnique({ where: { user_id: userId } });
    if (!setting || !setting.enabled || !setting.fcm_token) return { sent: false, reason: 'no_token_or_disabled' };

    // Aqui você chamaria Firebase Admin ou outro provider
    console.log('Enviando notificação para', userId, 'token:', setting.fcm_token, 'payload:', payload);

    // Simular sucesso
    return { sent: true };
  }
}

export default new PushService();
