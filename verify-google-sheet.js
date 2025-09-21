// Script to verify Google Sheet configuration
require('dotenv').config();

function verifyGoogleSheet() {
  console.log('=== Verifying Google Sheet Configuration ===\n');
  
  // Check if we have the required environment variables
  const spreadsheetId = process.env.SPREADSHEET_ID;
  
  if (!spreadsheetId) {
    console.log('⚠️  SPREADSHEET_ID not found in .env file');
    console.log('   Note: This is not required for Apps Script method, but useful for verification\n');
  } else {
    console.log('✅ SPREADSHEET_ID found:', spreadsheetId);
    console.log('   Google Sheet URL: https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/edit\n');
  }
  
  console.log('📋 Required Google Sheet Setup:');
  console.log('   1. First row should contain these column headers:');
  console.log('      - Timestamp');
  console.log('      - Caller Number');
  console.log('      - Name');
  console.log('      - Plate');
  console.log('      - Service');
  console.log('      - Recording URL');
  console.log('');
  console.log('   2. The Google account that owns your Apps Script must have edit access');
  console.log('   3. The Spreadsheet ID must match in your Apps Script code\n');
  
  console.log('🔧 To verify your Google Sheet:');
  console.log('   1. Open the Google Sheet in your browser');
  console.log('   2. Check that the first row contains the headers listed above');
  console.log('   3. Make sure you can manually add a row of data');
  console.log('   4. Verify the Spreadsheet ID in the URL matches your Apps Script code\n');
  
  console.log('📝 Note: The Apps Script method does not require the SPREADSHEET_ID in your .env file');
  console.log('   It only needs to be in the Apps Script code itself.');
}

verifyGoogleSheet();