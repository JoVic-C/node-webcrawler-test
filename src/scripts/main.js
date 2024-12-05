const { scrapeImoveis } = require('../crawler/imoveisScraper');
const { esClient } = require('../config/elasticsearch');
const { Pool } = require('pg');

const pool = new Pool({ user: 'docker', database: 'crawlertestdb', password: 'docker' });

const main = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM portal');
    const portal = rows[0];
    console.log(portal)

    console.log(`Iniciando captura do portal: ${portal.nome}`);

    const imoveis = await scrapeImoveis(portal.url);

    for (const imovel of imoveis) {
      await esClient.index({
        index: 'imoveis',
        body: { ...imovel, capturado_em: new Date(), atualizado_em: new Date() },
      });
    }
    

    console.log('Imóveis inseridos no Elasticsearch.');
  } catch (err) {
    console.error('Erro no processo:', err);
  } finally {
    pool.end();
  }
};

main();
