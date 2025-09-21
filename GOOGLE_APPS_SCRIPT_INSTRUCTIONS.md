# Google Apps Script Setup Instructions

Google Apps Script is now the primary method for data storage, replacing the Google Sheets API with service account authentication.

## Step 1: Create the Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the following:

```javascript
function doPost(e) {
  try {
    // Get the data from the request
    const data = e.parameter || JSON.parse(e.postData.contents);
    
    // Open the spreadsheet by ID
    const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getActiveSheet();
    
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

## Step 2: Configure Your Spreadsheet

1. Create a new Google Sheet or use an existing one
2. Get the Spreadsheet ID from the URL:
   - The URL looks like: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the part between `/d/` and `/edit`
3. Replace `YOUR_SPREADSHEET_ID` in the script with your actual Spreadsheet ID

## Step 3: Set Up Column Headers

In your Google Sheet, add these column headers in the first row:
- Timestamp
- Caller Number
- Name
- Plate
- Service
- Recording URL

## Step 4: Deploy the Web App

1. Click on the "Deploy" button (clock icon) in the toolbar
2. Select "New deployment"
3. Click the gear icon and select "Web app"
4. Set the following options:
   - Description: Call Data Storage
   - Execute as: Me
   - Who has access: Anyone (or "Anyone with Google" for more security)
5. Click "Deploy"
6. Copy the "Web app URL" - this is what you'll use in your environment variables

## Step 5: Update Your Environment Variables

Uncomment and update the APPS_SCRIPT_URL in your `.env` file:

```
APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace `YOUR_SCRIPT_ID` with the actual URL you copied from the deployment step.

## Benefits of Using Google Apps Script

1. **No Complex Authentication**: No need for service accounts or JSON key files
2. **Easier Deployment**: Works seamlessly with Google Sheets
3. **Less Error-Prone**: Eliminates JWT signature errors
4. **Built-in Google Services**: Direct access to SpreadsheetApp without additional setup
5. **Simpler Configuration**: Only requires a single URL in environment variables

## Troubleshooting

If you encounter issues:

1. Make sure the spreadsheet ID is correct
2. Verify that the Google account you're using has edit access to the spreadsheet
3. Check that the web app is deployed with the correct permissions
4. Ensure the Apps Script URL is correctly set in your environment variables and is uncommented