const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const transactionRoutes = require('./routes/transactionRoutes');
const accountRoutes = require('./routes/accountRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/transactions', transactionRoutes);
app.use('/accounts', accountRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
