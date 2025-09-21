// Test script to verify Google Sheets authentication with environment variables only
require('dotenv').config();
const { google } = require('googleapis');

async function testEnvAuth() {
  console.log('=== Testing Google Sheets Authentication with Environment Variables ===\n');
  
  try {
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
    
    // Get values from environment variables
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.SPREADSHEET_ID;
    
    console.log('✅ All required environment variables are present');
    console.log('Client email:', clientEmail);
    console.log('Spreadsheet ID:', spreadsheetId);
    console.log('Private key length:', privateKey.length);
    
    // Process private key - handle different newline formats
    console.log('\nProcessing private key...');
    
    // Remove surrounding quotes if present
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      console.log('Removing surrounding quotes...');
      privateKey = privateKey.slice(1, -1);
    }
    
    // Handle different newline formats - convert escaped newlines to actual newlines
    if (privateKey.includes('\\n')) {
      console.log('Converting escaped newlines to actual newlines...');
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    
    console.log('Processed key length:', privateKey.length);
    
    // Verify key format
    if (privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
      console.log('✅ Private key has correct header');
    } else {
      console.log('❌ Private key missing correct header');
      console.log('Key starts with:', privateKey.substring(0, 30));
    }
    
    if (privateKey.endsWith('-----END PRIVATE KEY-----')) {
      console.log('✅ Private key has correct footer');
    } else {
      console.log('❌ Private key missing correct footer');
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
    console.log('Access token:', authResponse.access_token.substring(0, 20) + '...');
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
    
    console.log('\n🎉 All tests passed! Google Sheets authentication is working correctly.');
    
  } catch (error) {
    console.error('❌ Error testing Google Sheets authentication:', error.message);
    console.error('Full error:', error);
    
    if (error.code === 403) {
      console.log('\n🔐 Permission Issue:');
      console.log('   - Make sure the service account has edit access to the spreadsheet');
      console.log('   - Verify the spreadsheet ID is correct');
    } else if (error.message.includes('invalid_grant') || error.message.includes('JWT')) {
      console.log('\n🔑 Authentication Issue:');
      console.log('   - Check that the private key is correctly formatted');
      console.log('   - Verify the client email is correct');
      console.log('   - Make sure there are no extra characters in the environment variables');
      console.log('   - Ensure the Google Sheets API is enabled in your Google Cloud project');
    }
  }
}

testEnvAuth();