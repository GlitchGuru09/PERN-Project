const dotenv = require('dotenv');
dotenv.config();
const redis = require('./config/redisClient');
const { logError } = require('./services/errorLogger');

const express = require('express');
const cors = require('cors');
const transactionRoutes = require('./routes/transactionRoutes');
const accountRoutes = require('./routes/accountRoutes');
const registerRoutes = require('./routes/admin/registerAndLoginRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/transactions', transactionRoutes);
app.use('/accounts', accountRoutes);

//admin
app.use('/admin', registerRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
