const { google } = require('googleapis');

// Use google.auth.OAuth2 in Node.js
const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// If we have a refresh token in env, set it immediately
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
}

// Helper to initialize and return Gmail service
async function helloGmail() {
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

// List the latest 10 inbox messages
async function listEmails() {
  const gmail = await helloGmail();
  const res = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 10,
  });
  return res.data.messages || [];
}

module.exports = { helloGmail, listEmails };
