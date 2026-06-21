const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple'); // or jsonwebtoken
const nodemailer = require('nodemailer');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.encode({ id }, process.env.JWT_SECRET || 'fallbackSecret');
};

// Nodemailer Transporter Mock (using ethereal or a real service like Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// @desc    Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Entrepreneur'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login User
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mock 2FA - Send OTP
const send2FAOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // In a real scenario, save OTP to user DB with expiry
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Nexus Platform - 2FA Login Code',
      text: `Your login verification code is: ${otp}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to your email successfully', mockOtp: otp }); 
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

module.exports = { registerUser, authUser, send2FAOtp };