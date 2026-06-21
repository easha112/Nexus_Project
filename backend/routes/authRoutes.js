const express = require('express');
const { registerUser, authUser, send2FAOtp } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/send-otp', send2FAOtp); // <--- Yeh wali line add ki hai

module.exports = router;