require('dotenv').config(); // Load .env
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(bodyParser.json());

// Nodemailer transporter (TLS)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // TLS
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Helps with Render server SSL issues
  }
});

// Test route
app.get('/', (req, res) => {
  res.send({ message: 'API is live!' });
});

// Report endpoint
app.post('/report', async (req, res) => {
  const { userEmail, problem } = req.body;

  if (!problem) {
    return res.status(400).send({ message: 'Problem description is required' });
  }

  const mailOptions = {
    from: userEmail || process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'New Problem Report from Meri Dharamsala App',
    text: `User Email: ${userEmail || 'Not provided'}\n\nProblem:\n${problem}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Report sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ message: 'Failed to send report', error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
