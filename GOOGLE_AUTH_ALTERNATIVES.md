# Google Sheets Authentication Alternatives

Since you're experiencing persistent "Invalid JWT Signature" errors with environment variables, here are several alternative approaches to get your Google Sheets integration working:

## Alternative 1: Use a Physical Key File (Recommended)

Even though you prefer not to use key.json, this is the most reliable approach:

1. Download the JSON key file from your Google Cloud service account
2. Save it as `key.json` in your project root
3. Update your server.js to use the key file method:

```javascript
const jwtClient = new google.auth.JWT({
  keyFile: './key.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
```

## Alternative 2: Regenerate and Properly Format Your Private Key

The issue might be with how the private key is formatted in your environment variables:

1. Go to Google Cloud Console → IAM & Admin → Service Accounts
2. Select your service account
3. Go to Keys tab
4. Delete the current key
5. Click "Add Key" → "Create new key" → Select JSON
6. Download the new key file
7. Extract the values and properly format them:

For the private key, ensure it's formatted as:
```
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----"
```

## Alternative 3: Use Google Application Default Credentials

If you're deploying to Google Cloud Platform:

1. Don't set explicit credentials
2. Let Google handle authentication automatically
3. Ensure your service is running with the correct service account

## Alternative 4: Use OAuth2 Flow (More Complex)

Implement a manual OAuth2 flow:

1. Create OAuth2 credentials in Google Cloud Console
2. Implement the OAuth2 flow in your application
3. Store and refresh tokens as needed

## Alternative 5: Switch to Google Apps Script (Already Implemented)

Since you already have the Google Apps Script integration working:

1. Keep the Apps Script URL in your environment variables
2. Remove the Google Sheets API code
3. Use only the Apps Script method for data storage

This is actually the simplest and most reliable approach for your use case.

## Alternative 6: Debug the Current Environment Variable Approach

If you want to continue with environment variables, try these debugging steps:

1. **Verify the private key integrity**:
   ```bash
   # Check if the key can be parsed correctly
   node -e "console.log(process.env.GOOGLE_PRIVATE_KEY.replace(/\\\\n/g, '\n'))"
   ```

2. **Test with a minimal script**:
   ```javascript
   const { google } = require('googleapis');
   require('dotenv').config();
   
   async function test() {
     try {
       let key = process.env.GOOGLE_PRIVATE_KEY;
       // Try different processing
       key = key.replace(/\\\\n/g, '\n');
       if (key.startsWith('"') && key.endsWith('"')) {
         key = key.slice(1, -1);
       }
       
       const client = new google.auth.JWT({
         email: process.env.GOOGLE_CLIENT_EMAIL,
         key: key,
         scopes: ['https://www.googleapis.com/auth/spreadsheets']
       });
       
       const auth = await client.authorize();
       console.log('Success:', auth);
     } catch (error) {
       console.error('Error:', error);
     }
   }
   
   test();
   ```

## Recommendation

Given the persistent authentication issues with environment variables, I recommend:

1. **Short term**: Use the Google Apps Script integration you've already implemented
2. **Long term**: If you need direct Google Sheets API access, use a physical key file

The Apps Script approach is actually better for your use case because:
- It's simpler to set up
- It's more reliable
- It doesn't require complex authentication
- It works consistently across different environments
- It's easier to troubleshoot

Would you like me to help you fully switch to the Apps Script approach and remove the Google Sheets API code entirely?