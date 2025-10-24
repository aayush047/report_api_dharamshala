require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // use express.json() instead of bodyParser

// Environment variables
const PORT = process.env.PORT || 3000;
const {
  MONGO_USER,
  MONGO_PASS,
  MONGO_CLUSTER,
  MONGO_DB
} = process.env;

// MongoDB connection
const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema & Model
const reportSchema = new mongoose.Schema({
  userEmail: { type: String, default: 'Anonymous' },
  problem: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);

// Test route to confirm server is live
app.get('/', (req, res) => {
  res.send('Server is running ✅');
});

// POST /report route
app.post('/report', async (req, res) => {
  const { userEmail, problem } = req.body;

  if (!problem || problem.trim() === '') {
    return res.status(400).json({ message: 'Problem description is required' });
  }

  try {
    const newReport = new Report({ userEmail, problem });
    await newReport.save();
    res.status(200).json({ message: 'Report saved successfully ✅', report: newReport });
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ message: 'Failed to save report', error });
  }
});

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found ❌' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
