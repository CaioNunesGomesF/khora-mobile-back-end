import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

//Salvar perfil de saúde do usuário
export const saveProfile = async (req, res) => {
    try {

        const {data_nascimento, altura_cm, peso_kg, genero, } = req.body;
        const user_id = req.user.id;

        // 1. Cria o novo perfil de saúde
        const data = {
            id: crypto.randomUUID(),
            user_id: user_id,
            data_nascimento: data_nascimento,
            altura_cm: altura_cm,
            peso_kg: peso_kg,
            genero: genero
        };

        // 2. "Salva" o perfil de saúde
        const newPerfil = await prisma.perfil_usuario.create({ data });

        // 3. Responde com sucesso
        res.status(201).json({
            message: "Perfil de saúde salvo com sucesso!",
            newPerfil,
        });

    } catch (error) {
        res.status(500).json({ message: 'Algo deu errado no servidor.', error: error.message });
    }
};

//Obter perfil de saúde do usuário
export const getProfile = async (req, res) => {
    try {
        // Pega o ID do usuário logado.
        const userId = req.user.id;
        // Filtra e encontra usuário.
        const profile = await prisma.perfil_usuario.findUnique({ where: { user_id: userId } });
        // Envia os perfis encontrados como resposta.
        res.status(200).json(profile);

    } catch (error) {
        // Se algo falhar, retorna um erro de servidor.
        res.status(500).json({ message: 'Algo deu errado no servidor.', error: error.message });
    }
}
