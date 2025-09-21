# Google Sheets API Authentication Troubleshooting Guide

You're experiencing the "Invalid JWT Signature" error when trying to authenticate with the Google Sheets API. This is a common issue with several possible causes. Let's troubleshoot step by step.

## Common Causes and Solutions

### 1. Private Key Formatting Issues

The most common cause is improper formatting of the private key in your environment variables.

**Problem**: The private key contains newline characters that need to be properly escaped.

**Solution**: 
1. Make sure your GOOGLE_PRIVATE_KEY in the .env file is formatted correctly:
   ```
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----"
   ```

2. The key should:
   - Be enclosed in double quotes
   - Have `\n` characters instead of actual newlines
   - Start with `-----BEGIN PRIVATE KEY-----`
   - End with `-----END PRIVATE KEY-----`

### 2. Extra Characters in Environment Variables

**Problem**: Extra spaces, quotes, or characters in the environment variables.

**Solution**:
1. Check that there are no extra spaces around the `=` sign
2. Ensure the private key doesn't have extra quotes
3. Verify the client email format is correct

### 3. Service Account Permissions

**Problem**: The service account doesn't have proper permissions.

**Solution**:
1. Go to your Google Sheet
2. Click "Share" 
3. Add the service account email (`sheet-access@just-fire-472702-q8.iam.gserviceaccount.com`)
4. Give it "Editor" permissions

### 4. Google Sheets API Not Enabled

**Problem**: The Google Sheets API is not enabled in your Google Cloud project.

**Solution**:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (`just-fire-472702-q8`)
3. Go to "APIs & Services" > "Library"
4. Search for "Google Sheets API"
5. Click on it and press "Enable"

### 5. Clock Skew

**Problem**: Your system clock is not synchronized.

**Solution**:
1. Make sure your system time is correct
2. Synchronize your clock with an NTP server

## Debugging Steps

### Step 1: Verify Environment Variables

Create a simple test script to verify your environment variables:

```javascript
require('dotenv').config();

console.log('GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL);
console.log('GOOGLE_PRIVATE_KEY length:', process.env.GOOGLE_PRIVATE_KEY?.length);
console.log('SPREADSHEET_ID:', process.env.SPREADSHEET_ID);
console.log('GOOGLE_PRIVATE_KEY starts with:', process.env.GOOGLE_PRIVATE_KEY?.substring(0, 30));
```

### Step 2: Test with a Minimal Example

Try this minimal authentication test:

```javascript
const { google } = require('googleapis');
require('dotenv').config();

async function testAuth() {
  try {
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    
    // Process private key
    if (privateKey.includes('\\n') && !privateKey.includes('\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    
    const jwtClient = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    const authResponse = await jwtClient.authorize();
    console.log('Authentication successful!');
    console.log('Access token:', authResponse.access_token.substring(0, 20) + '...');
  } catch (error) {
    console.error('Authentication failed:', error.message);
  }
}

testAuth();
```

### Step 3: Check Service Account Details

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "IAM & Admin" > "Service Accounts"
3. Find your service account (`sheet-access@just-fire-472702-q8.iam.gserviceaccount.com`)
4. Verify it exists and is active

## Alternative Solutions

### Solution 1: Use a Key File

Instead of environment variables, use a key file:

1. Download the JSON key file from your service account
2. Save it as `key.json` in your project directory
3. Modify your server.js to read from the file:

```javascript
const keyFile = require('./key.json');

jwtClient = new google.auth.JWT({
  email: keyFile.client_email,
  key: keyFile.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
```

### Solution 2: Regenerate Service Account Key

1. In Google Cloud Console, go to "IAM & Admin" > "Service Accounts"
2. Click on your service account
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Select "JSON" format
6. Download the key file
7. Either use the file directly or extract the values to update your environment variables

## Verification Checklist

Before testing again, verify:

- [ ] GOOGLE_CLIENT_EMAIL is exactly `sheet-access@just-fire-472702-q8.iam.gserviceaccount.com`
- [ ] GOOGLE_PRIVATE_KEY starts with `-----BEGIN PRIVATE KEY-----` and ends with `-----END PRIVATE KEY-----`
- [ ] GOOGLE_PRIVATE_KEY has `\n` characters instead of actual newlines
- [ ] SPREADSHEET_ID is correct (copy it from your Google Sheet URL)
- [ ] Service account has "Editor" access to the Google Sheet
- [ ] Google Sheets API is enabled in your Google Cloud project
- [ ] Your system clock is synchronized

If you've tried all these solutions and are still having issues, please share:
1. The exact error message you're getting
2. Your Google Sheet URL (or at least confirm the SPREADSHEET_ID is correct)
3. Whether you can access the Google Cloud Console for your project