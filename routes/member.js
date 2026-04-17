const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// POST - Register new member
router.post('/register', async (req, res) => {
  try {
    const { name, age, aadhaar, address, phone, email } = req.body;

    // Basic validation
    if (!name || !age || !aadhaar || !address || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required (Name, Age, Aadhaar, Address, Phone)" 
      });
    }

    const newMember = new Member({
      name,
      age,
      aadhaar,
      address,
      phone,
      email: email || ""   // email optional
    });

    await newMember.save();

    res.status(201).json({
      success: true,
      message: "✅ Membership application submitted successfully!",
      member: newMember
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again." 
    });
  }
});

// GET - All members (for Admin)
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ date: -1 });
    res.json({ 
      success: true, 
      members 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch members" 
    });
  }
});

// DELETE - Delete member by ID (for Admin)
router.delete('/:id', async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    
    if (!deletedMember) {
      return res.status(404).json({ 
        success: false, 
        message: "Member not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Member deleted successfully" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Delete failed" 
    });
  }
});

module.exports = router;