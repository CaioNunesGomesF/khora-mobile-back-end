
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