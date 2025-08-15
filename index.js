const express = require('express');
const { google } = require('googleapis');
const { helloGmail, listEmails } = require('./gmail');

const app = express();
const port = process.env.PORT || 3000;

// Main route
app.get('/', (req, res) => {
  res.send('Hello from the Google API Manager!');
});

// Gmail: list latest messages
app.get('/gmail/list', async (req, res) => {
  try {
    const messages = await listEmails();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gmail: send a test message
app.post('/gmail/send', async (req, res) => {
  try {
    const gmail = await helloGmail();
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: Buffer.from(
          `From: ${process.env.GMAIL_FROM}\n` +
          `To: ${process.env.GMAIL_TO}\n` +
          `Subject: Test Email\n` +
          `Content-Type: text/plain; charset=utf-8\n\n` +
          `This is a test email sent via Railway\n`
        ).toString('base64url'),
      },
    });
    res.json({ status: 'sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

process.on('uncaughtException', () => {
  console.error('Uncaught exception occurred');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
