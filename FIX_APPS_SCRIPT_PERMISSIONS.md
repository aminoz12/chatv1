# How to Fix Google Apps Script 401 Unauthorized Error

You're getting a 401 Unauthorized error when trying to send data to your Google Apps Script. This is a common issue related to deployment permissions. Follow these steps to fix it:

## Step 1: Check Your Current Deployment

1. Go to [script.google.com](https://script.google.com)
2. Open your existing project
3. Click on "Deploy" → "Manage deployments"
4. Look for your current deployment

## Step 2: Redeploy with Correct Permissions

1. In the "Manage deployments" window, click the pencil icon (edit) next to your deployment
2. Click "Deploy"
3. In the deployment settings, make sure:
   - **Description**: Call Data Storage (or any descriptive name)
   - **Execute as**: Me (your Google account)
   - **Who has access**: **Select "Anyone"** (this is crucial!)

## Step 3: Verify Your Apps Script Code

Make sure your code looks exactly like this:

```javascript
function doPost(e) {
  try {
    // Get the data from the request
    const data = e.parameter || JSON.parse(e.postData.contents);
    
    // IMPORTANT: Replace this with your actual Spreadsheet ID
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
    // Log error for debugging (visible in Apps Script editor Execution Log)
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

## Step 4: Verify Your Google Sheet

1. Make sure your Google Sheet exists and you can access it
2. Verify the Spreadsheet ID is correct (it's in the URL)
3. Check that row 1 has these column headers:
   - Timestamp
   - Caller Number
   - Name
   - Plate
   - Service
   - Recording URL

## Step 5: Test the Fix

After redeploying with "Anyone" access:

1. Run the debug script again:
   ```bash
   node debug-apps-script.js
   ```

2. You should now see a 200 response with JSON data instead of the 401 error

## Common Issues and Solutions

### Issue 1: Still getting 401 error
- Make sure you clicked "Deploy" after changing permissions
- Try creating a new deployment instead of editing the existing one

### Issue 2: Getting 500 error after fixing 401
- Check that your Spreadsheet ID is correct
- Verify the Google account that owns the script has edit access to the spreadsheet
- Make sure column headers are in row 1 of your spreadsheet

### Issue 3: Data not appearing in spreadsheet
- Check the Apps Script Execution Log for errors
- In the Apps Script editor, go to "Executions" to see detailed logs
- Make sure the SPREADSHEET_ID in your code matches your actual spreadsheet

## Need More Help?

If you're still having issues:

1. Check the Apps Script Execution Log:
   - In the Apps Script editor, click "Executions" in the left sidebar
   - Look for failed executions and their error messages

2. Verify spreadsheet permissions:
   - Make sure your Google account can edit the spreadsheet
   - Try manually adding a row to confirm access

3. Double-check the Spreadsheet ID:
   - The URL should look like: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the part between `/d/` and `/edit`