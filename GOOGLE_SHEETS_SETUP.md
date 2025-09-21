# Easiest Google Sheets Setup Guide

This is the simplest way to set up Google Sheets integration for your voice call system.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" then "New Project"
3. Enter a project name (e.g., "VoiceCallSystem")
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In your new project, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on "Google Sheets API"
4. Click "Enable"

## Step 3: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Enter:
   - Service account name: "sheets-access"
   - Service account ID: (auto-filled)
   - Service account description: "Access for voice call system"
4. Click "Create and Continue"
5. For role, select "Basic" > "Editor"
6. Click "Continue" then "Done"

## Step 4: Create and Download Key

1. Find your new service account and click on it
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Click "Create"
6. Save the file as `service-account-key.json` in your project folder

## Step 5: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Give it a name (e.g., "Voice Call Records")
4. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
   ```

## Step 6: Share Sheet with Service Account

1. In your Google Sheet, click "Share"
2. Add the service account email (found in the JSON file)
3. Give it "Editor" access
4. Click "Send"

## Step 7: Update Environment Variables

Add these to your `.env` file:

```env
SPREADSHEET_ID=your_actual_spreadsheet_id_here
# The service-account-key.json file should be in your project root
```

## That's It!

Your Google Sheets integration should now work automatically. The system will:
- Store call data with timestamps
- Handle authentication automatically
- Work without complex OAuth flows

## Troubleshooting

If you get permission errors:
1. Double-check that you shared the sheet with the service account email
2. Verify the service account has "Editor" access
3. Make sure the `service-account-key.json` file is in the correct location