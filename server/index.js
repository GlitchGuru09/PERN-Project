const dotenv = require('dotenv');
dotenv.config();  //need to load environment variables before using them in db.js
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const pool = require('./db');



//middleware
app.use(cors());
app.use(express.json());

//routes
//create a transaction
app.post('/transaction', async (req, res) => {
  try {
    const { from_account, to_account, amount, description } = req.body;
    const transaction = await pool.query(
      'INSERT INTO transactions (from_ac_id, to_ac_id, amount, description, status) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [from_account, to_account, amount, description, 'PENDING']
    );
    if (transaction){
      //update balance of from account
      await pool.query('UPDATE accounts SET balance = balance - $1 WHERE ac_id = $2', [amount, from_account]);
      //update balance of to account
      await pool.query('UPDATE accounts SET balance = balance + $1 WHERE ac_id = $2', [amount, to_account]);
    }

    //fetch updated balance of from account
      const fromAccountBalance = await pool.query('SELECT balance FROM accounts WHERE ac_id = $1', [from_account]);
      //fetch updated balance of to account
      const toAccountBalance = await pool.query('SELECT balance FROM accounts WHERE ac_id = $1', [to_account]);

    //Update ledger table
    await pool.query('INSERT INTO ledger (tid, ac_id, entry_type, amount, balance_after, currency) VALUES ($1, $2, $3, $4, $5, $6)', [transaction.rows[0].tid, from_account, 'debit', amount, fromAccountBalance.rows[0].balance, 'INR']);
    await pool.query('INSERT INTO ledger (tid, ac_id, entry_type, amount, balance_after, currency) VALUES ($1, $2, $3, $4, $5, $6)', [transaction.rows[0].tid, to_account, 'credit', amount, toAccountBalance.rows[0].balance, 'INR']);
    if(!from_account || !to_account || !amount ||  !description) {
      return res.status(400).json({ error: 'Please fill all the fields' });
    }
    res.json(transaction.rows[0]);
    
  } catch (error) {
    console.error(error.message);
  }
});


//get all   transactions
app.get('/transactions', async (req, res) => {
  try {
    const allTransactions = await pool.query('SELECT tid, amount, status, a.account_name AS from_account_name, b.account_name AS to_account_name FROM transactions t JOIN accounts a ON t.from_ac_id = a.ac_id JOIN accounts b ON t.to_ac_id = b.ac_id');
    res.json(allTransactions.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//get all   accounts
app.get('/accounts', async (req, res) => {
  try {
    const allAccounts = await pool.query('SELECT * FROM accounts');
    res.json(allAccounts.rows);
  } catch (error) {
    console.error(error.message);
  }
});


//get a transaction
app.get('/transaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await pool.query('SELECT * FROM transactions WHERE tid = $1', [id]);
    res.json(transaction.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});


//update a transaction
app.put('/transaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, status, description } = req.body;
    await pool.query('UPDATE transactions SET amount = $1, status = $2, description = $3 WHERE tid = $4', [amount, status, description, id]);
    res.json('Transaction was updated!');
  } catch (error) {
    console.error(error.message);
    
  }
});


//delete a transaction
app.delete('/transaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM transactions WHERE tid = $1', [id]);
    res.json('Transaction was deleted!');
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});