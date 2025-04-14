const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { deposit, withdraw, transactionHistory, getBalance } = require('../controllers/userController');


router.post('/deposit', authMiddleware, deposit);
router.post('/withdraw', authMiddleware, withdraw);
router.get('/transactions', authMiddleware, transactionHistory);
router.get('/balance', authMiddleware, getBalance);
  
module.exports = router;
