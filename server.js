require('dotenv').config(); // .env load करने के लिए
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));

const PORT = process.env.PORT || 3000;

// Nodemailer config
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/report', async (req, res) => {
    const { userEmail, problem } = req.body;

    if (!problem) {
        return res.status(400).send({ message: 'Problem description is required' });
    }

    const mailOptions = {
        from: userEmail || 'noreply@meridharamshala.com',
        to: process.env.EMAIL_USER,
        subject: 'New Problem Report from Meri Dharamsala App',
        text: `User Email: ${userEmail || 'Not provided'}\n\nProblem:\n${problem}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Report sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to send report', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
