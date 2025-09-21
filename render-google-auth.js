// Special authentication script for Render deployment
const { google } = require('googleapis');
const fs = require('fs');

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function initGoogleSheetsForRender() {
  console.log('=== Render Google Sheets Authentication ===');
  
  try {
    // Method 1: Try environment variable (Render's preferred method)
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      console.log('✓ GOOGLE_SERVICE_ACCOUNT_KEY environment variable found');
      
      // Parse the service account key
      let keyData;
      try {
        keyData = JSON.parse(serviceAccountKey);
        console.log('✓ Service account key parsed successfully');
      } catch (parseError) {
        console.error('✗ Failed to parse service account key:', parseError.message);
        return null;
      }
      
      // Process the private key
      let privateKey = keyData.private_key;
      console.log('Processing private key...');
      
      // Handle escaped newlines (common issue with environment variables)
      if (privateKey.includes('\\n')) {
        console.log('Converting escaped newlines to actual newlines...');
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
      
      // Verify key format
      if (privateKey.startsWith('-----BEGIN PRIVATE KEY-----') && 
          privateKey.endsWith('-----END PRIVATE KEY-----\n')) {
        console.log('✓ Private key format looks correct');
      } else {
        console.log('! Private key format may need adjustment');
        // Try to fix common issues
        if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
          privateKey = '-----BEGIN PRIVATE KEY-----\n' + privateKey;
        }
        if (!privateKey.endsWith('-----END PRIVATE KEY-----\n')) {
          privateKey = privateKey + '\n-----END PRIVATE KEY-----\n';
        }
      }
      
      // Create JWT client
      console.log('Creating JWT client...');
      const jwtClient = new google.auth.JWT({
        email: keyData.client_email,
        key: privateKey,
        scopes: SCOPES
      });
      
      // Test authentication
      console.log('Testing authentication...');
      const authResponse = await jwtClient.authorize();
      console.log('✓ Authentication successful!');
      console.log('Token type:', authResponse.token_type);
      console.log('Token expires:', new Date(authResponse.expiry_date).toISOString());
      
      return jwtClient;
    }
    
    // Method 2: Try key file (for local development)
    const keyFilePath = './key.json';
    if (fs.existsSync(keyFilePath)) {
      console.log('✓ key.json file found');
      
      // Read and parse key file
      const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');
      const keyData = JSON.parse(keyFileContent);
      
      console.log('Creating JWT client with key file...');
      const jwtClient = new google.auth.JWT({
        email: keyData.client_email,
        key: keyData.private_key,
        scopes: SCOPES
      });
      
      // Test authentication
      console.log('Testing authentication...');
      const authResponse = await jwtClient.authorize();
      console.log('✓ Authentication successful!');
      console.log('Token type:', authResponse.token_type);
      console.log('Token expires:', new Date(authResponse.expiry_date).toISOString());
      
      return jwtClient;
    }
    
    console.log('✗ No valid Google service account configuration found');
    return null;
    
  } catch (error) {
    console.error('✗ Authentication failed:', error.message);
    
    // Provide specific troubleshooting guidance
    if (error.message.includes('invalid_grant')) {
      console.log('\nTroubleshooting tips for "invalid_grant" error:');
      console.log('1. Ensure GOOGLE_SERVICE_ACCOUNT_KEY is properly formatted');
      console.log('2. Check that the Google Sheets API is enabled in your project');
      console.log('3. Verify the service account has access to your spreadsheet');
      console.log('4. Make sure your SPREADSHEET_ID is correct');
      console.log('5. Try regenerating your service account key');
    }
    
    return null;
  }
}

// Export the function
module.exports = { initGoogleSheetsForRender };