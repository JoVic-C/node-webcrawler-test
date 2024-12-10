const { pool } = require("../config/pools");

const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS portal (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      observacoes TEXT,
      nome TEXT NOT NULL
    );
  `;

  try {
    await pool.query(query);
    console.log('Tabela criada.');
  } catch (err) {
    console.error('Erro ao criar tabela:', err);
  } finally {
    pool.end();
  }
};

createTable();
