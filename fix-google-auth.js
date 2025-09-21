// Script to fix Google Sheets authentication issues
require('dotenv').config();
const fs = require('fs');
const { google } = require('googleapis');

async function fixGoogleAuth() {
  console.log('=== Fixing Google Sheets Authentication ===\n');
  
  try {
    // Method 1: Try with environment variables as-is
    console.log('Method 1: Using environment variables directly...');
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    
    console.log('Original private key length:', privateKey.length);
    console.log('Contains actual newlines:', privateKey.includes('\n'));
    console.log('Contains escaped newlines:', privateKey.includes('\\n'));
    
    // Try different processing approaches
    let processedKey = privateKey;
    
    // Approach 1: Convert escaped newlines
    if (processedKey.includes('\\n') && !processedKey.includes('\n')) {
      console.log('Converting escaped newlines to actual newlines...');
      processedKey = processedKey.replace(/\\n/g, '\n');
    }
    
    // Approach 2: Remove surrounding quotes
    if (processedKey.startsWith('"') && processedKey.endsWith('"')) {
      console.log('Removing surrounding quotes...');
      processedKey = processedKey.slice(1, -1);
    }
    
    console.log('Processed key length:', processedKey.length);
    
    // Create JWT client
    console.log('Creating JWT client...');
    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: processedKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    // Test authentication
    console.log('Testing authentication...');
    const authResponse = await jwtClient.authorize();
    console.log('✅ Authentication successful with environment variables!');
    console.log('Token expires:', new Date(authResponse.expiry_date).toISOString());
    
  } catch (error) {
    console.log('Method 1 failed:', error.message);
    
    // Method 2: Try creating a key file
    try {
      console.log('\nMethod 2: Creating key file from environment variables...');
      
      // Create key file content
      const keyFileContent = {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: process.env.GOOGLE_TOKEN_URI || "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_CLIENT_EMAIL)}`
      };
      
      // Write to key.json
      fs.writeFileSync('./key.json', JSON.stringify(keyFileContent, null, 2));
      console.log('✅ Key file created successfully');
      
      // Try authenticating with key file
      console.log('Testing authentication with key file...');
      const jwtClient = new google.auth.JWT({
        keyFile: './key.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
      
      const authResponse = await jwtClient.authorize();
      console.log('✅ Authentication successful with key file!');
      console.log('Token expires:', new Date(authResponse.expiry_date).toISOString());
      
    } catch (keyFileError) {
      console.log('Method 2 failed:', keyFileError.message);
      
      // Method 3: Manual key file creation instructions
      console.log('\nMethod 3: Manual approach needed');
      console.log('Please follow these steps:');
      console.log('1. Go to Google Cloud Console');
      console.log('2. Navigate to IAM & Admin > Service Accounts');
      console.log('3. Find your service account');
      console.log('4. Go to Keys tab');
      console.log('5. Click "Add Key" > "Create new key"');
      console.log('6. Select JSON format and download');
      console.log('7. Save as "key.json" in your project directory');
      console.log('8. Update your server.js to use the key file method');
    }
  }
}

fixGoogleAuth();