const { Client } = require('@elastic/elasticsearch');
const { client } = require('../config/elasticsearch');

const esClient = new Client({ node: 'http://localhost:9200' });


const createIndex = async () => {
  
  const exists = await esClient.indices.exists({ index: 'imoveis' });
  if (!exists.body) {
    await esClient.indices.create({
      index: 'imoveis',
      body: {
        mappings: {
          properties: {
            id: { type: 'keyword' },
            titulo: { type: 'text' },
            descricao: { type: 'text' },
            portal: { type: 'text' },
            url: { type: 'text' },
            tipoNegocio: { type: 'text' },
            endereco: { type: 'text' },
            preco: { type: 'float' },
            quartos: { type: 'integer' },
            banheiros: { type: 'integer' },
            vagas_garagem: { type: 'integer' },
            area_util: { type: 'float' },
            capturado_em: { type: 'date' },
            atualizado_em: { type: 'date' },
          },
        },
      },
    });
    //console.log('Índice imoveis criado.');
  } else {
    return console.log('Índice imoveis criado.');
  }
};


createIndex()

module.exports = { esClient, createIndex };
