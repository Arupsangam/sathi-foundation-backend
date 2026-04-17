const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Donation = require('../models/Donation');

// Multer setup for screenshot upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET all donations
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ date: -1 });
    res.json({ success: true, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch donations" });
  }
});

// POST new donation (with screenshot)
router.post('/', upload.single('screenshot'), async (req, res) => {
  try {
    const { name, amount, phone, address } = req.body;
    const screenshot = req.file ? `/uploads/${req.file.filename}` : null;

    const newDonation = new Donation({
      name,
      amount,
      phone,
      address,
      screenshot,
      date: new Date()
    });

    await newDonation.save();
    res.status(201).json({ success: true, message: "Donation recorded", donation: newDonation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to save donation" });
  }
});

// DELETE donation by ID  ← Yeh important hai
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Donation.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    res.json({ success: true, message: "Donation deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

module.exports = router;