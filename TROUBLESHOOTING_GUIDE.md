# Comprehensive Troubleshooting Guide for Google Apps Script Integration

If you're not seeing new data in your Google Sheet, follow this step-by-step troubleshooting guide.

## Quick Check - Most Common Issues

1. **Permissions Issue (Most Common)**
   - In your Apps Script, go to Deploy → Manage deployments
   - Edit your deployment and set "Who has access" to "Anyone"
   - Click "Deploy" to save changes

2. **Spreadsheet ID Mismatch**
   - Verify the SPREADSHEET_ID in your Apps Script matches your actual Google Sheet
   - The URL should be: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`

3. **Missing Column Headers**
   - Your Google Sheet must have these headers in row 1:
     - Timestamp
     - Caller Number
     - Name
     - Plate
     - Service
     - Recording URL

## Detailed Troubleshooting Steps

### Step 1: Verify Apps Script Deployment

1. Go to [script.google.com](https://script.google.com)
2. Open your project
3. Click "Deploy" → "Manage deployments"
4. Click the pencil icon to edit your deployment
5. Check these settings:
   - Description: Call Data Storage (or similar)
   - Execute as: Me
   - Who has access: **Anyone** (critical!)
6. Click "Deploy"

### Step 2: Verify Apps Script Code

Your Apps Script code should look exactly like this:

```javascript
function doPost(e) {
  try {
    // Get the data from the request
    const data = e.parameter || JSON.parse(e.postData.contents);
    
    // IMPORTANT: Replace with your actual Spreadsheet ID
    const SPREADSHEET_ID = '1A6TXDihzmtmjoyZRFc8huOEssh7xyS3KOA9uPFweOlM';
    
    // Open the spreadsheet by ID
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // Append the data to the sheet
    sheet.appendRow([
      data.timestamp,
      data.callerNumber,
      data.name,
      data.plate,
      data.service,
      data.recordingUrl
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

### Step 3: Test with cURL

Test your Apps Script URL directly with cURL:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2023-01-01T10:00:00Z",
    "callerNumber": "+1234567890",
    "name": "Test User",
    "plate": "TEST-123",
    "service": "Test Service",
    "recordingUrl": "https://example.com/recording.mp3"
  }' \
  "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
```

### Step 4: Check Execution Logs

1. In the Apps Script editor, click "Executions" in the left sidebar
2. Look for recent executions
3. Click on any failed executions to see detailed error messages

### Step 5: Verify Google Sheet Access

1. Open your Google Sheet in a browser
2. Check that row 1 contains the required headers
3. Try manually adding a row to confirm you have edit access
4. Verify the Spreadsheet ID in the URL matches your Apps Script code

## Testing Your Setup

### Run the Debug Script

```bash
node debug-apps-script.js
```

Look for:
- ✅ 200 status with JSON response = Working correctly
- ❌ 401 status = Permissions issue
- ❌ 404 status = Incorrect URL
- ❌ 500 status = Server-side error in Apps Script

### Run a Complete End-to-End Test

```bash
node complete-end-to-end-test.js
```

This simulates real calls and shows what data would be sent.

## Common Error Solutions

### Error: 401 Unauthorized
**Solution**: Set "Who has access" to "Anyone" in your Apps Script deployment

### Error: 404 Not Found
**Solution**: 
1. Verify your Apps Script URL is correct
2. Check that the script is deployed

### Error: 500 Internal Server Error
**Solution**:
1. Check Apps Script Execution Logs
2. Verify Spreadsheet ID is correct
3. Ensure the Google account has edit access to the spreadsheet

### Error: Data not appearing in sheet
**Solution**:
1. Check that column headers are in row 1
2. Verify the Spreadsheet ID in your code
3. Confirm the Google account can edit the sheet

## Additional Debugging

### Enable Detailed Logging

The updated server.js now provides detailed logging when sending data to Apps Script:
- Shows the exact data being sent
- Displays response status and body
- Logs any errors with full details

### Manual Test with Real Data

You can manually trigger your system with:

```bash
node test-real-data.js
```

This sends test data to your server endpoints, which should then forward to your Apps Script.

## Still Having Issues?

1. **Create a new Apps Script project**:
   - Sometimes redeploying doesn't work properly
   - Create a fresh script with the correct code and deployment settings

2. **Check Google Account Permissions**:
   - Ensure the Google account owns both the Apps Script and the Google Sheet
   - Try sharing the sheet with the Apps Script account explicitly

3. **Verify Spreadsheet ID Format**:
   - The ID should be a long string of characters
   - It should NOT include the full URL, just the ID part

4. **Check for Special Characters**:
   - Some special characters in data might cause parsing issues
   - The system handles French characters correctly, but verify any unusual input

If none of these solutions work, please share:
1. The exact error message from the server logs
2. The Apps Script execution log
3. Your Apps Script code (without sensitive information)