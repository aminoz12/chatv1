// Google Apps Script code that matches your Google Sheet headers
// Your headers are: date, numero, nom, plaquette, service, recordurl

function doPost(e) {
  try {
    // Get the data from the request
    const data = e.parameter || JSON.parse(e.postData.contents);
    
    // IMPORTANT: Replace this with your actual Spreadsheet ID
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