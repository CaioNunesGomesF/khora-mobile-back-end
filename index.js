//Importa o modulo express
import express from 'express';
import bcrypt from 'bcryptjs'; // Importando a biblioteca de criptografa a senha.
import pool from './src/utils/db.js'; //Importando o Banco de dados
const app = express(); // criando a instância express
app.use(express.json()); //Para express entender o formato json
const port = 8081;


app.post('/cadastro', async (req, res) => {
    const {nome, email, senha} = req.body;

    try {

        //Hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        //Insere o novo usuário no banco de dados e retorna os dados inseridos.
        const novoUsuario = await pool.query(
            "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING *",
            [nome, email, senhaHash]
        );

        // Resposta de sucesso.
        res.status(201).json(novoUsuario.rows[0]);
    }catch (error) {
        console.error(error);
        res.status(500).send("Erro ao registrar usuário.")
    }
});



//Iniciar o servidor.
app.listen(port, () => {
    console.log(`Servidor rodando http://localhost:${port}/cadastro `)
});