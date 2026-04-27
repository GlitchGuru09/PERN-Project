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
    const { account, amount, description, transaction_type, status } = req.body;
    const transaction = await pool.query(
      'INSERT INTO transactions (ac_id,amount,description, transaction_type, status) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [account, amount, description, transaction_type, status]
    );
    if(!account || !amount || !description || !transaction_type || !status) {
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
    const allTransactions = await pool.query('SELECT * FROM transactions join accounts a on transactions.ac_id = a.ac_id');
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