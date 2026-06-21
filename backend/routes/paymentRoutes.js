const express = require('express');
const { 
  depositFunds, 
  withdrawFunds, 
  transferFunds, 
  getTransactionHistory 
} = require('../controllers/paymentController');

const router = express.Router();

router.post('/deposit', depositFunds);
router.post('/withdraw', withdrawFunds);
router.post('/transfer', transferFunds);
router.get('/history/:userId', getTransactionHistory);

module.exports = router;