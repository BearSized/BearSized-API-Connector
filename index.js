const express = require('express');
const { google } = require('googleapis');

const app = express();
const port = process.env.PORT || 3000;

// TODO: Add Google API authentication logic here

app.get('/', (req, res) => {
  res.send('Hello from the Google API Manager!');
});

// TODO: Add routes for your Google API interactions here

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
