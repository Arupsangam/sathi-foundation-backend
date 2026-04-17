const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Reliable Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static('public/uploads'));

console.log("🔍 MONGO_URI:", process.env.MONGO_URI ? "✅ LOADED" : "❌ NOT LOADED");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// Routes
const memberRoutes = require('./routes/member');
const storyRoutes = require('./routes/story');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const donationRoutes = require('./routes/donation');

app.use('/api/members', memberRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/donations', donationRoutes);

app.get('/', (req, res) => res.send('✅ Sathi Backend Running - Multi Device Ready'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on http://10.21.21.59:${PORT}`);
  console.log(`📱 Phone pe bhi use kar sakte ho`);
});