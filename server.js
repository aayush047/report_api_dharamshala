const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/report', async (req, res) => {
    const { userEmail, problem } = req.body;

    if (!problem) {
        return res.status(400).send({ message: 'Problem description is required' });
    }

    const msg = {
        to: 'aayushpatidar047@gmail.com',
        from: 'noreply@meridharamshala.com',
        subject: 'New Problem Report from Meri Dharamsala App',
        text: `User Email: ${userEmail || 'Not provided'}\n\nProblem:\n${problem}`,
    };

    try {
        await sgMail.send(msg);
        res.status(200).send({ message: 'Report sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Failed to send report', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
