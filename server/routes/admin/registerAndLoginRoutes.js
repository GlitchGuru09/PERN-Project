const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/admin/registerAndLoginController');

router.post('/register', registerController.createAdminUser);
router.post('/login', registerController.loginAdminUser);

module.exports = router;
