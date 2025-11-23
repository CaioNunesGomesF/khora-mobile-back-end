import axios from 'axios';
import xml2js from 'xml2js';

/**
 * Busca artigos e informações sobre saúde masculina na MedlinePlus Connect
 * @param {string} query - Termo de busca (ex: "men's health", "sexual health", etc)
 * @returns {Promise<Object[]>} Lista de artigos e informações
 */
export async function buscarSaudeMasculina(query = "men's health") {
  const url = `https://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term=${encodeURIComponent(query)}`;
  try {
    const response = await axios.get(url);
    // Converte XML para JSON
    const result = await xml2js.parseStringPromise(response.data, { explicitArray: false });
    // Extrai e estrutura os dados
    const records = result?.nlmSearchResult?.list?.record || [];
    // Garante array
    const artigos = Array.isArray(records) ? records : [records];
    // Mapeia para formato frontend
    return artigos.map((item) => ({
      titulo: item.title || 'Artigo de Saúde Masculina',
      descricao: item.content || 'Conteúdo sobre saúde masculina.',
      imagem: '/assets/placeholder-prostata.png', // Pode ser ajustado conforme categoria
      tipo: 'ARTIGO',
      categoria: query,
      url: item.url || '',
    }));
  } catch (error) {
    throw new Error('Erro ao buscar informações de saúde masculina: ' + error.message);
  }
}