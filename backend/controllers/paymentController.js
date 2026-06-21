const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Mock Deposit Funds
// @route   POST /api/payments/deposit
const depositFunds = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid user or amount.' });
    }

    // Create transaction record
    const transaction = new Transaction({
      user: userId,
      type: 'Deposit',
      amount,
      status: 'Completed',
      description: 'Mock Stripe/PayPal Deposit'
    });

    await transaction.save();
    res.status(200).json({ message: 'Deposit successful', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mock Withdraw Funds
// @route   POST /api/payments/withdraw
const withdrawFunds = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid user or amount.' });
    }

    // Create transaction record
    const transaction = new Transaction({
      user: userId,
      type: 'Withdraw',
      amount,
      status: 'Completed',
      description: 'Mock Withdrawal to bank'
    });

    await transaction.save();
    res.status(200).json({ message: 'Withdrawal successful', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mock Transfer Funds (e.g., Investment from Investor to Entrepreneur)
// @route   POST /api/payments/transfer
const transferFunds = async (req, res) => {
  try {
    const { senderId, recipientId, amount } = req.body;

    if (!senderId || !recipientId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid details for transfer.' });
    }

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found.' });
    }

    // Create debit/transfer transaction for sender
    const transaction = new Transaction({
      user: senderId,
      type: 'Transfer',
      amount,
      status: 'Completed',
      recipient: recipientId,
      description: `Investment/Transfer sent to ${recipient.name || 'User'}`
    });

    await transaction.save();
    res.status(200).json({ message: 'Transfer successful', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get Transaction History for a user
// @route   GET /api/payments/history/:userId
const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      $or: [
        { user: req.params.userId },
        { recipient: req.params.userId }
      ]
    }).populate('recipient', 'name email').sort({ createdAt: -1 });
    
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  depositFunds,
  withdrawFunds,
  transferFunds,
  getTransactionHistory
};