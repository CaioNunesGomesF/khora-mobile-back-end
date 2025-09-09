import pool from '../utils/db.js';

const perfil = [];

//Salvar perfil de saúde do usuário
export const saveProfile = async (req, res) => {
    try {

        const {data_nascimento, altura, peso, fumante, bebe_alcool, historico_doenca} = req.body;
        const userId = req.user.id;

        // 1. Cria o novo perfil de saúde
        const newPerfil = {
            usuarioId: userId,
            data_nascimento: data_nascimento,
            altura: altura,
            peso: peso,
            fumante: fumante,
            bebe_alcool: bebe_alcool,
            historico_doenca: historico_doenca,
        };

        // 2. "Salva" o perfil de saúde
        perfil.push(newPerfil);
        console.log('Perfil de saúde cadastrado com sucesso:', perfil);
        res.status(201).json({
            message: "Perfil de saúde salvo com sucesso!",
            perfil: newPerfil,
        });

    } catch (error) {
        res.status(500).json({ message: 'Algo deu errado no servidor.', error: error.message });
    }
};