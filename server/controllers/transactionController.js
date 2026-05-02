const pool = require('../db');

const createTransaction = async (req, res) => {
  const { from_account, to_account, amount, description } = req.body;

  if (!from_account || !to_account || !amount || !description) {
    return res.status(400).json({ error: 'Please fill all the fields' });
  }
  if (from_account === to_account) {
    return res.status(400).json({ error: 'From and To accounts must be different' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const transactionResult = await client.query(
      'INSERT INTO transactions (from_ac_id, to_ac_id, amount, description, status) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [from_account, to_account, amount, description, 'PENDING']
    );

    await client.query('SELECT balance FROM accounts WHERE ac_id = $1 FOR UPDATE', [from_account]);
    await client.query('SELECT balance FROM accounts WHERE ac_id = $1 FOR UPDATE', [to_account]);

    await client.query('UPDATE accounts SET balance = balance - $1 WHERE ac_id = $2', [amount, from_account]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE ac_id = $2', [amount, to_account]);

    const fromBalanceResult = await client.query('SELECT balance FROM accounts WHERE ac_id = $1', [from_account]);
    const toBalanceResult = await client.query('SELECT balance FROM accounts WHERE ac_id = $1', [to_account]);

    await client.query(
      'INSERT INTO ledger (tid, ac_id, entry_type, amount, balance_after, currency) VALUES ($1, $2, $3, $4, $5, $6)',
      [transactionResult.rows[0].tid, from_account, 'debit', amount, fromBalanceResult.rows[0].balance, 'INR']
    );
    await client.query(
      'INSERT INTO ledger (tid, ac_id, entry_type, amount, balance_after, currency) VALUES ($1, $2, $3, $4, $5, $6)',
      [transactionResult.rows[0].tid, to_account, 'credit', amount, toBalanceResult.rows[0].balance, 'INR']
    );

    await client.query('COMMIT');
    res.json(transactionResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error.message);
    res.status(500).json({ error: 'Transaction failed' });
  } finally {
    client.release();
  }
};

const getTransactions = async (req, res) => {
  try {
    const allTransactions = await pool.query(
      'SELECT tid, amount, status, a.account_name AS from_account_name, b.account_name AS to_account_name FROM transactions t JOIN accounts a ON t.from_ac_id = a.ac_id JOIN accounts b ON t.to_ac_id = b.ac_id'
    );
    res.json(allTransactions.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Unable to fetch transactions' });
  }
};

const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await pool.query('SELECT * FROM transactions WHERE tid = $1', [id]);
    if (!transaction.rows.length) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Unable to fetch transaction' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, status, description } = req.body;
    await pool.query(
      'UPDATE transactions SET amount = $1, status = $2, description = $3 WHERE tid = $4',
      [amount, status, description, id]
    );
    res.json({ message: 'Transaction was updated!' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Unable to update transaction' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM transactions WHERE tid = $1', [id]);
    res.json({ message: 'Transaction was deleted!' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Unable to delete transaction' });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
