const { scrapeImoveis, saveToDatabase } = require('../crawler/imoveisScraper');
const { esClient } = require('../config/elasticsearch');
const { pool } = require('../config/pools');
const { saveScraperData } = require('./saveData');

const main = async () => {
  try {
  const portalUrl = 'https://www.imoveis-sc.com.br';
  const observacoes = 'WebCrawler apenas apartamento Imoveis - SC.'; 
  const nome = 'Apartamentos Imoveis - SC';
  const imoveis = await scrapeImoveis('https://www.imoveis-sc.com.br/todas-cidades/comprar/apartamento');
   
    for (const imovel of imoveis) {
      await esClient.index({
        index: 'imoveis',
        body: { ...imovel, capturado_em: new Date(), atualizado_em: new Date() },
      });
    }
    console.log('Imóveis inseridos no Elasticsearch.');
  if(imoveis) {
    await saveScraperData(portalUrl,nome, observacoes);
  }
   
  } catch (err) {
    console.error('Erro no processo:', err);
  } finally {
    pool.end();
  }
};

main();
