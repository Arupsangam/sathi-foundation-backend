const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// Default Admin Credentials
const DEFAULT_ADMIN = {
  email: "pilusamal@gmail.com",
  password: "pilu754215"
};

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    res.json({
      success: true,
      message: "Login successful",
      admin: { email: DEFAULT_ADMIN.email }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: "Invalid email or password" 
    });
  }
});

// Get All Members (for Admin Dashboard)
router.get('/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ date: -1 });
    res.json({ 
      success: true, 
      members 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

module.exports = router;