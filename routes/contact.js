const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST - Save Contact Form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      message
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "✅ Thank you! Your message has been sent successfully."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again."
    });
  }
});

// GET - All Contacts (for Admin Dashboard)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.json({
      success: true,
      contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts"
    });
  }
});

// DELETE - Delete a contact (for Admin)
router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Contact deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
});

module.exports = router;