require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// MongoDB Connection
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected ✅'))
    .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema
const reportSchema = new mongoose.Schema({
    userEmail: { type: String, default: 'Anonymous' },
    problem: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);

// API endpoint to submit report
app.post('/report', async (req, res) => {
    const { userEmail, problem } = req.body;

    if (!problem) {
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});
