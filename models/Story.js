const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  subject: { type: String, required: true },
  totalMoney: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },   // We will store image URL/path
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', storySchema);