// gmail.js
const { google } = require('googleapis');
const axios = require('axios');

async function getAccessToken() {
  const { data } = await axios.post('https://oauth2.googleapis.com/token', {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    grant_type: 'refresh_token'
  });
  return data.access_token;
}

async function listMessages() {
  const accessToken = await getAccessToken();
  const gmail = google.gmail({ version: 'v1', auth: accessToken });

  const res = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });
  return res.data.messages || [];
}

async function sendMessage(to, subject, body) {
  const accessToken = await getAccessToken();
  const gmail = google.gmail({ version: 'v1', auth: accessToken });

  const encodedMessage = Buffer.from(
    `To: ${to}\r\nSubject: ${subject}\r\n\r\n${body}`
  )
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedMessage }
  });

  return res.data;
}

module.exports = { listMessages, sendMessage };
