const cron = require('node-cron');
const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();
const pushService = require('../service/push_service');

// Cron job para notificação diária de check-in de humor
cron.schedule('0 8 * * *', async () => {
  try {
    // Buscar todos usuários
    const users = await prisma.user.findMany();
    for (const user of users) {
      // Enviar notificação push (ajuste pushService conforme sua implementação)
      await pushService.sendPush({
        userId: user.id,
        title: 'Check-in Diário',
        message: 'Como você está se sentindo hoje? Faça seu registro de humor.'
      });
    }
    console.log('Notificações de check-in de humor enviadas.');
  } catch (error) {
    console.error('Erro ao enviar notificações de humor:', error.message);
  }
});
