const pool = require('../db');

const getAccounts = async (req, res) => {
  try {
    const allAccounts = await pool.query('SELECT * FROM accounts');
    res.json(allAccounts.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Unable to fetch accounts' });
  }
};

module.exports = {
  getAccounts,
};
