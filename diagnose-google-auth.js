// Comprehensive diagnostic script for Google authentication issues
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function diagnoseGoogleAuth() {
  console.log('=== Google Authentication Diagnostic ===\n');
  
  // Check 1: File-based approach
  console.log('1. Checking key.json file approach...');
  try {
    const keyFilePath = './key.json';
    if (fs.existsSync(keyFilePath)) {
      console.log('✓ key.json file found');
      
      // Try to read and parse it
      const keyData = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
      console.log('✓ key.json file parsed successfully');
      console.log('  Client email:', keyData.client_email);
      console.log('  Private key length:', keyData.private_key.length);
      
      // Check private key format
      if (keyData.private_key.startsWith('-----BEGIN PRIVATE KEY-----')) {
        console.log('✓ Private key format looks correct');
      } else {
        console.log('✗ Private key format may be incorrect');
      }
      
      // Try authentication
      console.log('  Testing authentication with key.json...');
      const jwtClient = new google.auth.JWT({
        keyFile: keyFilePath,
        scopes: SCOPES
      });
      
      const authResponse = await jwtClient.authorize();
      console.log('✓ Authentication successful with key.json approach');
      console.log('  Token type:', authResponse.token_type);
      console.log('  Expiry date:', new Date(authResponse.expiry_date).toISOString());
      
      return true;
    } else {
      console.log('✗ key.json file not found');
    }
  } catch (error) {
    console.log('✗ key.json approach failed:', error.message);
  }
  
  // Check 2: Environment variable approach
  console.log('\n2. Checking environment variable approach...');
  try {
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      console.log('✓ GOOGLE_SERVICE_ACCOUNT_KEY environment variable found');
      console.log('  Variable length:', serviceAccountKey.length);
      
      // Try to parse it
      let keyData;
      try {
        keyData = JSON.parse(serviceAccountKey);
        console.log('✓ Environment variable parsed successfully');
        console.log('  Client email:', keyData.client_email);
        
        // Fix private key formatting
        if (keyData.private_key) {
          console.log('  Private key length:', keyData.private_key.length);
          
          // Try to fix formatting
          let fixedPrivateKey = keyData.private_key.replace(/\\n/g, '\n');
          
          // Check if it looks correct
          if (fixedPrivateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
            console.log('✓ Private key format looks correct after fixing');
            keyData.private_key = fixedPrivateKey;
          } else {
            console.log('! Private key format may still be incorrect');
            // Try using as-is
            keyData.private_key = keyData.private_key;
          }
        }
        
        // Try authentication
        console.log('  Testing authentication with environment variable...');
        const jwtClient = new google.auth.JWT({
          email: keyData.client_email,
          key: keyData.private_key,
          scopes: SCOPES
        });
        
        const authResponse = await jwtClient.authorize();
        console.log('✓ Authentication successful with environment variable approach');
        console.log('  Token type:', authResponse.token_type);
        console.log('  Expiry date:', new Date(authResponse.expiry_date).toISOString());
        
        return true;
      } catch (parseError) {
        console.log('✗ Failed to parse environment variable:', parseError.message);
      }
    } else {
      console.log('✗ GOOGLE_SERVICE_ACCOUNT_KEY environment variable not found');
    }
  } catch (error) {
    console.log('✗ Environment variable approach failed:', error.message);
  }
  
  // Check 3: System information
  console.log('\n3. System information...');
  console.log('  Node.js version:', process.version);
  console.log('  Current time:', new Date().toISOString());
  console.log('  UTC time:', new Date().toUTCString());
  
  console.log('\n=== Diagnostic Complete ===');
  console.log('If both approaches failed, the issue is likely with the service account key itself.');
  console.log('Please verify that:');
  console.log('1. The service account key is valid and not expired');
  console.log('2. The Google Sheets API is enabled in your Google Cloud project');
  console.log('3. The service account email has been shared with your Google Sheet');
  
  return false;
}

diagnoseGoogleAuth();