# Final Fix Guide: Getting Data into Your Google Sheet

Based on our troubleshooting, there are two critical issues to fix. Follow this guide in order:

## 🔥 CRITICAL STEP 1: Fix Permissions (401 Error)

This is the main issue preventing data from reaching your Google Sheet.

### Action Required:
1. Go to [script.google.com](https://script.google.com)
2. Open your project
3. Click "Deploy" → "Manage deployments"
4. Click the pencil icon to edit your deployment
5. **Change "Who has access" to "Anyone"**
6. Click "Deploy" to save changes

This is the most important step - without it, nothing else will work!

## ✅ CRITICAL STEP 2: Verify Your Apps Script Code

Use this exact code in your Apps Script project:

```javascript
function doPost(e) {
  try {
    // Get the data from the request
    const data = e.parameter || JSON.parse(e.postData.contents);
    
    // IMPORTANT: Replace with your actual Spreadsheet ID
    const SPREADSHEET_ID = '1A6TXDihzmtmjoyZRFc8huOEssh7xyS3KOA9uPFweOlM';
    
    // Open the spreadsheet by ID
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // Append the data to the sheet using your exact column headers
    sheet.appendRow([
      data.timestamp,    // date
      data.callerNumber, // numero
      data.name,         // nom
      data.plate,        // plaquette
      data.service,      // service
      data.recordingUrl  // recordurl
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Log error for debugging
    console.error('Error in doPost:', error.toString());
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Google Apps Script Web App for Call Data Storage')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

## 📋 STEP 3: Verify Google Sheet Setup

Your Google Sheet must have these EXACT headers in row 1:
- **date** (not timestamp)
- **numero** (not callerNumber)
- **nom** (not name)
- **plaquette** (not plate)
- **service** (same)
- **recordurl** (not recordingUrl)

## 🧪 STEP 4: Test the Fix

After completing steps 1-3:

1. Run the debug script:
   ```bash
   node debug-apps-script.js
   ```

2. You should now see a 200 response with JSON data instead of the 401 error

3. Run a complete test:
   ```bash
   node complete-end-to-end-test.js
   ```

## 🚨 If You're Still Getting 401 Errors

Try creating a completely new deployment:

1. In "Manage deployments", click the trash can to delete the current deployment
2. Click the "+" button to create a new deployment
3. Set:
   - Description: Call Data Storage
   - Execute as: Me
   - Who has access: **Anyone**
4. Click "Deploy"
5. Copy the new URL to your [.env](file:///c%3A/Users/pc/Desktop/botcalls/.env) file

## 📊 Verification

Once everything is working:
1. Run a test with `node test-real-data.js`
2. Check your Google Sheet within 30 seconds
3. You should see a new row with test data

## 🛠️ Files Updated for Your Column Headers

I've updated all test files to use your exact column names:
- [server.js](file:///c%3A/Users/pc/Desktop/botcalls/server.js) - Sends data with correct field names
- [debug-apps-script.js](file:///c%3A/Users/pc/Desktop/botcalls/debug-apps-script.js) - Tests with correct field names
- [test-apps-script-data.js](file:///c%3A/Users/pc/Desktop/botcalls/test-apps-script-data.js) - Tests with correct field names
- [complete-end-to-end-test.js](file:///c%3A/Users/pc/Desktop/botcalls/complete-end-to-end-test.js) - Tests with correct field names
- [YOUR_APPS_SCRIPT_CODE.js](file:///c%3A/Users/pc/Desktop/botcalls/YOUR_APPS_SCRIPT_CODE.js) - Apps Script code with correct field mapping

The most important thing is fixing the permissions - everything else is already set up correctly for your column headers!