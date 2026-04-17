const express = require('express');
const router = express.Router();
const multer = require('multer');
const Story = require('../models/Story');

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// GET all stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().sort({ date: -1 });
    res.json({ success: true, stories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stories" });
  }
});

// POST - Upload new story
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const story = new Story({
      subject: req.body.subject,
      totalMoney: Number(req.body.totalMoney),
      description: req.body.description,
      image: `/uploads/${req.file.filename}`
    });

    await story.save();
    res.json({ success: true, message: "Story uploaded successfully", story });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// PUT - Edit / Update story
router.put('/:id', async (req, res) => {
  try {
    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      {
        subject: req.body.subject,
        totalMoney: Number(req.body.totalMoney),
        description: req.body.description
      },
      { new: true }   // return updated document
    );

    if (!updatedStory) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }

    res.json({ 
      success: true, 
      message: "Story updated successfully", 
      story: updatedStory 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

// DELETE - Delete story
router.delete('/:id', async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndDelete(req.params.id);

    if (!deletedStory) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }

    res.json({ 
      success: true, 
      message: "Story deleted successfully" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

module.exports = router;