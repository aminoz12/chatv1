// Test script to check if Google Sheets API is enabled and accessible
const { google } = require('googleapis');
const fs = require('fs');

async function testGoogleApi() {
  console.log('=== Google Sheets API Test ===\n');
  
  try {
    // Try to read the key file
    const keyFilePath = './key.json';
    if (!fs.existsSync(keyFilePath)) {
      console.log('✗ key.json file not found');
      return;
    }
    
    console.log('✓ key.json file found');
    const keyData = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
    console.log('✓ key.json file parsed');
    
    // Create a JWT client
    console.log('\nCreating JWT client...');
    const jwtClient = new google.auth.JWT({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    // Try to authorize
    console.log('Attempting authorization...');
    const authResponse = await jwtClient.authorize();
    console.log('✓ Authorization successful');
    console.log('  Access token:', authResponse.access_token ? `${authResponse.access_token.substring(0, 20)}...` : 'None');
    console.log('  Token type:', authResponse.token_type);
    console.log('  Expiry date:', new Date(authResponse.expiry_date).toISOString());
    
    // Try to make a simple API call
    console.log('\nTesting Google Sheets API call...');
    const sheets = google.sheets({ version: 'v4', auth: jwtClient });
    
    // Try to get spreadsheet metadata (doesn't require access to specific cells)
    const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
    if (!SPREADSHEET_ID) {
      console.log('✗ SPREADSHEET_ID environment variable not set');
      return;
    }
    
    console.log(`Testing access to spreadsheet: ${SPREADSHEET_ID}`);
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });
    
    console.log('✓ Google Sheets API call successful');
    console.log('  Spreadsheet title:', metadata.data.properties.title);
    console.log('  Sheet count:', metadata.data.sheets.length);
    
    console.log('\n=== All tests passed! ===');
    console.log('Google Sheets integration is working correctly.');
    
  } catch (error) {
    console.log('✗ Test failed:', error.message);
    
    // Provide specific error handling
    if (error.message.includes('invalid_grant')) {
      console.log('\nThis is an authentication error. Possible causes:');
      console.log('1. Service account key is expired or invalid');
      console.log('2. Clock synchronization issues (but we checked that)');
      console.log('3. Service account has been disabled');
      console.log('4. Private key formatting issues');
    } else if (error.message.includes('accessNotConfigured')) {
      console.log('\nThe Google Sheets API is not enabled for your project.');
      console.log('Please enable it in the Google Cloud Console.');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.log('\nThe service account does not have access to the spreadsheet.');
      console.log('Please share your spreadsheet with the service account email.');
    }
    
    console.log('\nFull error:', error);
  }
}

testGoogleApi();