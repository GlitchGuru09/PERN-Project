const pool = require('../config/db');
const { logError, logSuccess } = require('../services/errorLogger');

const getAccounts = async (req, res) => {
  try {
    const allAccounts = await pool.query('SELECT * FROM accounts');
    res.json(allAccounts.rows);
    await logSuccess('Accounts fetched successfully', req);
  }catch (error) {
  await logError(error, req);
  res.status(500).json({ error: 'Unable to fetch accounts' });
}
};

module.exports = {
  getAccounts,
};
