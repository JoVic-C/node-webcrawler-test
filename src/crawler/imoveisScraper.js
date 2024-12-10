const axios = require('axios');
const cheerio = require('cheerio');
const { esClient } = require('../config/elasticsearch');

const scrapeImoveis = async (urlBase) => {
  let imoveis = [];
  let currentPage = 1;
  let hasNextPage = true;
  const maxImoveis = 100;

  try {
    while (hasNextPage && imoveis.length < maxImoveis) {
      const url = `${urlBase}?pagina=${currentPage}`;
      console.log(`Capturando dados da página ${currentPage}: ${url}`);

      const response = await axios.get(urlBase);
      const $ = cheerio.load(response.data);

      $('.imovel').each((_, element) => {
        const titulo = $(element).find('.imovel-titulo').text().trim();
        const endereco = $(element).find('.imovel-extra strong').text().trim();
        const urlDoImovel = $(element).find('.imovel-titulo a').attr('href');
        const preco = parseFloat(
          $(element).find('.imovel-preco small').text().replace(/[^\d,]/g, '').replace(',', '.')
        );
        const quartos = parseInt($(element).find('.imovel-info li span:contains("quar")').text(), 10) || 0;
        const banheiros = parseInt($(element).find('.imovel-info li span:contains("su")').text(), 10) || 0;
        const vagas_garagem = parseInt($(element).find('.imovel-info li span:contains("vag")').text(), 10) || 0;
        const area_util = parseFloat($(element).find('.imovel-info li span:contains("m²")').text()) || 0;

        imoveis.push({
          id: `${Date.now()}-${Math.random()}`,
          titulo,
          descricao: titulo,
          portal: 'Imoveis - SC',
          urlDoImovel,
          tipoNegocio: 'Venda',
          endereco,
          preco,
          quartos,
          banheiros,
          vagas_garagem,
          area_util,
        });

        if (imoveis.length >= maxImoveis) {
          hasNextPage = false;
        }
      });

      hasNextPage = $('.next').length > 0 && imoveis.length < maxImoveis;  
      currentPage++;

      console.log(`Foram capturados ${imoveis.length} imóveis até agora.`);
    }

    console.log(`Foram capturados ${imoveis.length} imóveis no total.`);
    return imoveis;
  } catch (err) {
    console.error('Erro ao capturar dados:', err.message);
  }
};


const saveToElasticsearch = async (imoveis) => {
  try {
    for (const imovel of imoveis) {
      await esClient.index({
        index: 'imoveis',
        document: imovel,
      });
    }
    console.log('Dados salvos no Elasticsearch.');
  } catch (err) {
    console.error('Erro ao salvar no Elasticsearch:', err.message);
  }

};

module.exports = { scrapeImoveis, saveToElasticsearch };
