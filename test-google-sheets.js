// Test script to verify Google Sheets integration
require('dotenv').config();
const { google } = require('googleapis');

async function testGoogleSheets() {
  try {
    console.log('=== Testing Google Sheets Integration ===\n');
    
    // Check if we have the required environment variables
    const requiredVars = [
      'GOOGLE_CLIENT_EMAIL',
      'GOOGLE_PRIVATE_KEY',
      'SPREADSHEET_ID'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.log('❌ Missing required environment variables:', missingVars);
      return;
    }
    
    console.log('✅ All required environment variables are present');
    
    // Get values from environment variables
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.SPREADSHEET_ID;
    
    console.log('Client email:', clientEmail);
    console.log('Spreadsheet ID:', spreadsheetId);
    
    // Process private key - handle different newline formats
    if (privateKey.includes('\\n') && !privateKey.includes('\n')) {
      console.log('Converting escaped newlines to actual newlines...');
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    
    // Create JWT client
    console.log('\nCreating JWT client...');
    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    // Test authentication
    console.log('Testing authentication...');
    const authResponse = await jwtClient.authorize();
    console.log('✅ Google Sheets authentication successful');
    console.log('Token expires:', new Date(authResponse.expiry_date).toISOString());
    
    // Test accessing the spreadsheet
    console.log('\nTesting spreadsheet access...');
    const sheets = google.sheets({ version: 'v4', auth: jwtClient });
    
    // Try to read spreadsheet metadata
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId
    });
    
    console.log('✅ Successfully accessed spreadsheet');
    console.log('Spreadsheet title:', spreadsheet.data.properties.title);
    console.log('Number of sheets:', spreadsheet.data.sheets.length);
    
    // Test appending data
    console.log('\nTesting data append operation...');
    const testRow = [
      new Date().toISOString(),
      'Test Number',
      'Test Name',
      'Test Plate',
      'Test Service',
      'Test Recording URL'
    ];
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [testRow]
      }
    });
    
    console.log('✅ Data appended successfully');
    console.log('Updated range:', response.data.updates.updatedRange);
    
    console.log('\n🎉 All Google Sheets tests passed!');
    console.log('Your Google Sheets integration is working correctly.');
    
  } catch (error) {
    console.error('❌ Error testing Google Sheets integration:', error.message);
    console.error('Full error:', error);
    
    if (error.code === 403) {
      console.log('\n🔐 Permission Issue:');
      console.log('   - Make sure the service account has edit access to the spreadsheet');
      console.log('   - Verify the spreadsheet ID is correct');
      console.log('   - Check that the Google Sheets API is enabled in the Google Cloud Console');
    } else if (error.code === 404) {
      console.log('\n🔍 Not Found Issue:');
      console.log('   - Verify the spreadsheet ID is correct');
      console.log('   - Make sure the spreadsheet exists');
    } else if (error.message.includes('invalid_grant')) {
      console.log('\n🔑 Authentication Issue:');
      console.log('   - Check that the private key is correctly formatted');
      console.log('   - Verify the client email is correct');
      console.log('   - Make sure there are no extra characters in the environment variables');
    }
  }
}

testGoogleSheets();