const { google } = require('googleapis');

const oauth2Client = new google.auth2.OAuth2Client(
   {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI
   }
 );

// If we are using a refresh token, add it to our client
// This way we can use the API without interactive login
 if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
}

// Helper to initialize and keep an authorized Gmail service
async function helloGmail() {
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

// List the latest 10 inbox messages
async function listEmails() {
  const gmail = await helloGmail();
  const res = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });
  return res.data.messages || [];
}

module.exports = { helloGmail, listEmails };