const { pool } = require("../config/pools");

const saveScraperData = async (portalUrl, nome, observacoes) => {
  let portalId;

  try {
    const portalCheckQuery = `SELECT id FROM portal WHERE url = $1`;
    const portalCheckResult = await pool.query(portalCheckQuery, [portalUrl]);

    if (portalCheckResult.rows.length > 0) {
      portalId = portalCheckResult.rows[0].id;
    } else {
      const portalInsertQuery = `
        INSERT INTO portal (url, nome, observacoes) 
        VALUES ($1, $2, $3) 
        RETURNING id
      `;
      const portalInsertResult = await pool.query(portalInsertQuery, [portalUrl, nome, observacoes]);
      portalId = portalInsertResult.rows[0].id;
    }

    console.log('Dados do portal salvos com sucesso.');
  } catch (err) {
    console.error('Erro ao salvar dados do portal:', err.message);
  }
};


module.exports = { saveScraperData };
