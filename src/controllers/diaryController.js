
//Banco Fake
const registrosDiario = [];

export const createDiaryEntry = (req, res) => {
  try {

      const {peso, pressao, data} = req.body;
      const userId = req.user.id;

      //1. Adiciono um novo registro.
      const novoRegistroDiario = {
          usuarioId: userId,
          peso: peso,
          pressao: pressao,
          data: new Date(),
      };
      // 2. "Salvar" o registro diário
      registrosDiario.push(novoRegistroDiario);
      res.status(201).json({
          message: "Registro de saúde salvo com sucesso!",
          registrosDiario: novoRegistroDiario,
      });

  }catch (error){
      res.status(500).json({ message: 'Algo deu errado no servidor.', error: error.message });
  }
}

export const getDiaryEntries = (req, res) => {
    try {
        // Pega o ID do usuário logado.
        const userId = req.user.id;
        // Filtra e encontra todos os registros deste usuário.
        const userDiaryEntries = registrosDiario.filter(registro => registro.usuarioId === userId);
        // Envia os registros encontrados como resposta.
        res.status(200).json(userDiaryEntries);

    } catch (error) {
        // Se algo falhar, retorna um erro de servidor.
        res.status(500).json({ message: 'Algo deu errado no servidor.', error: error.message });
    }
}

export const updateDiaryEntry = (req, res) => {
    try {
        // Pega o ID do usuário e o ID do registro.
        const { id: userId } = req.user;
        const { id: entryId } = req.params;

        // Encontra o registro que será atualizado.
        const entryToUpdate = registrosDiario.find(registro => registro.id === entryId);

        // Se o registro não existe, retorna erro 404.
        if (!entryToUpdate) {
            return res.status(404).json({ message: "Registo do diário não encontrado." });
        }

        // Se o usuário não for o dono do registro, nega o acesso.
        if (entryToUpdate.usuarioId !== userId) {
            return res.status(403).json({ message: "Acesso negado. Você não pode editar este registo." });
        }

        // Pega os novos dados (peso, pressao) do corpo da requisição.
        const { peso, pressao} = req.body;
        // Atualiza os campos do registro com os novos dados.
        entryToUpdate.peso = peso || entryToUpdate.peso;
        entryToUpdate.pressao = pressao || entryToUpdate.pressao;

        // Retorna uma mensagem de sucesso e o registro atualizado.
        res.status(200).json({
            message: "Registo do diário atualizado com sucesso!",
            entry: entryToUpdate
        });

    }catch (e) {
        // Se algo falhar, retorna um erro de servidor.
        res.status(500).json({ message: 'Algo deu errado no servidor.', error: e.message });
    }
}



export const deleteDiaryEntry = (req, res) => {
    try {
        // Pega o ID do usuário e do registro.
        const { id: userId } = req.user;
        const { id: entryId } = req.params;

        // Encontra a posição (índice) do registro na lista.
        const entryIndex = registrosDiario.findIndex(registro => registro.id === entryId);

        // Se não encontrar o registro, retorna erro 404.
        if (entryIndex === -1) {
            return res.status(404).json({ message: "Registo do diário não encontrado." });
        }

        // Verifica se o usuário é o dono do registro antes de apagar.
        const entryToDelete = registrosDiario[entryIndex];
        if (entryToDelete.usuarioId !== userId) {
            return res.status(403).json({ message: "Acesso negado. Você não pode apagar este registo." });
        }

        // Remove o registro da lista.
        registrosDiario.splice(entryIndex, 1);

        // Envia uma mensagem de sucesso.
        res.status(200).json({
            message: "Registo do diário apagado com sucesso!"
        });

    } catch (error) {
        // Se algo falhar, retorna um erro de servidor.
        res.status(500).json({ message: 'Algo deu errado no servidor.', error: error.message });
    }
};