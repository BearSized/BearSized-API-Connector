# Google API Manager

This project provides a basic setup to manage Google APIs (Gmail, Docs, Drive, Sheets) using Node.js and the `googleapis` library. It is designed to be deployed on Railway.

## Prerequisites

- Node.js and npm installed on your local machine.
- A Google Cloud Platform (GCP) project.
- A Railway account.

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory:
   ```bash
   cd google-api-manager
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

1. **Enable Google APIs:**
   - Go to the [Google Cloud Console API Library](https://console.cloud.google.com/apis/library).
   - Select your GCP project.
   - Search for and enable the following APIs:
     - Gmail API
     - Google Docs API
     - Google Drive API
     - Google Sheets API

2. **Create Credentials:**
   - Go to the [Google Cloud Console Credentials page](https://console.cloud.google.com/apis/credentials).
   - Click on "Create Credentials" and select "OAuth client ID".
   - Select "Web application" as the application type.
   - Add `http://localhost:3000/oauth2callback` to the "Authorized redirect URIs".
   - Click "Create". You will be given a client ID and client secret.
   - Download the JSON file and rename it to `credentials.json`. Place this file in the root of your project directory.

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## Deployment on Railway

1. Create a new project on Railway and connect it to your GitHub repository.
2. Railway will automatically detect the `package.json` and deploy your application.
3. You will need to configure the environment variables for your client ID, client secret, and redirect URI in the Railway project settings.
