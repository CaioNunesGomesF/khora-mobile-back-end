import crypto from 'crypto';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const parseDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const parseNumber = (value) => {
    if (value === undefined || value === null || value === '') return null;
    const numeric = typeof value === 'number' ? value : Number(value);
    return Number.isNaN(numeric) ? null : numeric;
};

const baseProfileResponse = (userId, user) => ({
    id: null,
    user_id: userId,
    data_nascimento: null,
    altura_cm: null,
    peso_kg: null,
    genero: null,
    user,
});

//Salvar ou atualizar perfil de saúde do usuário
export const saveProfile = async (req, res) => {
    try {
        const { data_nascimento, altura_cm, peso_kg, genero } = req.body;
        const userId = req.user.id;

        const normalizedData = {
            data_nascimento: parseDate(data_nascimento),
            altura_cm: parseNumber(altura_cm),
            peso_kg: parseNumber(peso_kg),
            genero: genero ?? null,
        };

        const existingProfile = await prisma.perfil_usuario.findUnique({
            where: { user_id: userId },
        });

        const profile = await prisma.perfil_usuario.upsert({
            where: { user_id: userId },
            update: normalizedData,
            create: {
                id: crypto.randomUUID(),
                user_id: userId,
                ...normalizedData,
            },
            include: {
                user: { select: { name: true, email: true } },
            },
        });

        const isUpdate = Boolean(existingProfile);

        res.status(isUpdate ? 200 : 201).json({
            message: isUpdate
                ? 'Perfil de saúde atualizado com sucesso!'
                : 'Perfil de saúde criado com sucesso!',
            profile,
        });
    } catch (error) {
        res.status(500).json({ message: 'Algo deu errado no servidor.', error: error.message });
    }
};

//Obter perfil de saúde do usuário
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await prisma.perfil_usuario.findFirst({
            where: { user_id: userId },
            include: {
                user: { select: { name: true, email: true } },
            },
        });

        if (!profile) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { name: true, email: true },
            });

            return res.status(200).json(baseProfileResponse(userId, user));
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Algo deu errado no servidor.', error: error.message });
    }
};
