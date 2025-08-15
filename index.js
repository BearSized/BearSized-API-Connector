// index.js
const express = require('express');
const { listMessages, sendMessage } = require('./gmail');

const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('Gmail API connected via refresh token'));

// List recent messages
app.get('/gmail', async (req, res) => {
  try {
    const messages = await listMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a message
app.post('/gmail', async (req, res) => {
  const { to, subject, body } = req.body;
  try {
    const result = await sendMessage(to, subject, body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
