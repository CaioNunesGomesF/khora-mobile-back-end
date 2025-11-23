import { buscarSaudeMasculina } from '../service/saude_masculina_service.js';

/**
 * Controller para Arsenal de Conhecimento e Pílula de Conhecimento - Saúde Masculina
 */
const saudeMasculinaController = {
  /**
   * Retorna informações sobre saúde masculina
   * @param {Request} req
   * @param {Response} res
   */
  async getInfo(req, res) {
    const query = req.query.q || "men's health";
    try {
      const resultado = await buscarSaudeMasculina(query);
      res.status(200).send(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default saudeMasculinaController;
