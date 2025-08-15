const express = require("express");
const axios = require("axios");
const { google } = require("googleapis");

const app = express();
app.use(express.json());

// ===== CONFIG =====
const SCOPES = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/spreadsheets"
];

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // Must match your OAuth redirect in Google Console
);

// ===== ROOT =====
app.get("/", (req, res) => {
  res.send("Hello from the Google API Manager!");
});

// ===== AUTH LOGIN =====
app.get("/auth/login", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES
  });
  res.json({ url });
});

// ===== AUTH CALLBACK =====
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "Missing code" });

  try {
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.refresh_token) {
      return res.status(400).json({ error: "No refresh token received" });
    }

    // Save refresh token into Railway project variables
    await axios.post(
      "https://backboard.railway.app/graphql/v2",
      {
        query: `
          mutation {
            variableUpsert(
              input: {
                projectId: "${process.env.RAILWAY_PROJECT_ID}",
                environmentId: null,
                key: "GOOGLE_REFRESH_TOKEN",
                value: "${tokens.refresh_token}"
              }
            ) {
              id
              key
            }
          }
        `
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.RAILWAY_API_KEY}`
        }
      }
    );

    res.json({ message: "Google account linked successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OAuth exchange failed" });
  }
});

// ===== GMAIL LIST =====
app.get("/gmail/list", async (req, res) => {
  try {
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const result = await gmail.users.messages.list({ userId: "me", maxResults: 5 });
    res.json(result.data.messages || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list Gmail messages" });
  }
});

// ===== GMAIL SEND =====
app.post("/gmail/send", async (req, res) => {
  try {
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const raw = Buffer.from(
      "To: you@example.com\r\n" +
      "Subject: Test Email from Railway\r\n\r\n" +
      "This is a test email."
    ).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw }
    });

    res.json({ status: "sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
