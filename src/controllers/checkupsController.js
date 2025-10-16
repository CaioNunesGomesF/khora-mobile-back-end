import checkupService from '../service/checkup_service.js';
import pushService from '../service/push_service.js';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export const getTimeline = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await checkupService.getTimelineForUser(userId);
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao gerar timeline de checkups:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Observação: `fcm_token` é o token de dispositivo do Firebase (opcional para testes)
export const setReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { enabled, frequency_days, fcm_token } = req.body;

    const updated = await prisma.reminder_setting.upsert({
      where: { user_id: userId },
      create: { user_id: userId, enabled: enabled ?? true, frequency_days, fcm_token },
      update: { enabled: enabled ?? true, frequency_days, fcm_token }
    });

    // registra token no serviço de push (placeholder)
    if (fcm_token) await pushService.registerToken(userId, fcm_token);

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Erro ao salvar lembrete:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const setting = await prisma.reminder_setting.findUnique({ where: { user_id: userId } });
    if (!setting) return res.status(404).json({ success: false, message: 'Configuração de lembrete não encontrada' });

    const updated = await prisma.reminder_setting.update({
      where: { user_id: userId },
      data: { enabled: !setting.enabled }
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Erro ao alternar lembrete:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Envia uma notificação de teste para o usuário (envio simulado pelo pushService)
// Útil para validar que o `fcm_token` foi salvo corretamente.
export const triggerTestNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pushService.sendNotificationToUser(userId, { title: 'Teste de lembrete', body: 'Este é um lembrete de teste.' });
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('Erro ao enviar notificação de teste:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/checkups - lista checkups do usuário
export const listUserCheckups = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await checkupService.listUserCheckups(userId);
    return res.json({ success: true, data: items });
  } catch (error) {
    console.error('Erro ao listar checkups:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/checkups - cria checkup para o usuário
export const createUserCheckup = async (req, res) => {
  try {
    const userId = req.user.id;
    const payload = req.body; // { nome, descricao, data_prevista, lembrete_ativo }
    const created = await checkupService.addUserCheckup(userId, payload);
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error('Erro ao criar checkup:', error);
    if (error.code === 'USER_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado ao criar checkup' });
    }
    if (error.code === 'INVALID_PAYLOAD') {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ success: false, message: 'Violated foreign key constraint ao criar checkup' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/checkups/:id - atualiza checkup do usuário
export const updateUserCheckup = async (req, res) => {
  try {
    const userId = req.user.id;
    const checkupId = req.params.id;
    const payload = req.body;
    const updated = await checkupService.updateUserCheckup(userId, checkupId, payload);
    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Erro ao atualizar checkup:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/checkups/:id - deleta checkup do usuário
export const deleteUserCheckup = async (req, res) => {
  try {
    const userId = req.user.id;
    const checkupId = req.params.id;
    const deleted = await checkupService.deleteUserCheckup(userId, checkupId);
    return res.json({ success: true, data: deleted });
  } catch (error) {
    console.error('Erro ao deletar checkup:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
