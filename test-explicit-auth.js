// Test explicit authentication approach
const { google } = require('googleapis');
const fs = require('fs');

async function testExplicitAuth() {
  console.log('=== Testing Explicit Authentication ===\n');
  
  try {
    const keyFilePath = './key.json';
    if (!fs.existsSync(keyFilePath)) {
      console.log('✗ key.json file not found');
      return;
    }
    
    console.log('✓ key.json file found');
    
    // Read and parse the key file
    const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');
    const keyData = JSON.parse(keyFileContent);
    
    console.log('✓ Key file parsed successfully');
    console.log('Client email:', keyData.client_email);
    console.log('Private key length:', keyData.private_key.length);
    
    // Check private key format
    if (keyData.private_key.startsWith('-----BEGIN PRIVATE KEY-----')) {
      console.log('✓ Private key format looks correct');
    } else {
      console.log('✗ Private key format may be incorrect');
    }
    
    // Count newlines
    const newlineCount = (keyData.private_key.match(/\n/g) || []).length;
    console.log('Newlines in private key:', newlineCount);
    
    // Create JWT client with explicit credentials
    console.log('\nCreating JWT client with explicit credentials...');
    const jwtClient = new google.auth.JWT({
      email: keyData.client_email,
      key: keyData.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    // Test authentication
    console.log('Testing authentication...');
    const authResponse = await jwtClient.authorize();
    
    console.log('✓ Authentication successful!');
    console.log('Token type:', authResponse.token_type);
    console.log('Token expires:', new Date(authResponse.expiry_date).toISOString());
    
    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.log('✗ Authentication failed:', error.message);
    
    if (error.message.includes('invalid_grant')) {
      console.log('\nThis is still the JWT signature error. Let\'s try a few more debugging steps:');
      console.log('1. The private key might be corrupted');
      console.log('2. The service account might be disabled');
      console.log('3. There might be an issue with the Google Cloud project');
      
      // Let's check the key data in more detail
      const keyFilePath = './key.json';
      if (fs.existsSync(keyFilePath)) {
        const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');
        const keyData = JSON.parse(keyFileContent);
        
        console.log('\nDetailed key information:');
        console.log('Type:', keyData.type);
        console.log('Project ID:', keyData.project_id);
        console.log('Private key ID:', keyData.private_key_id);
        console.log('Client email:', keyData.client_email);
        console.log('Client ID:', keyData.client_id);
        
        // Check if the key looks valid
        if (keyData.private_key.includes('-----BEGIN PRIVATE KEY-----') && 
            keyData.private_key.includes('-----END PRIVATE KEY-----')) {
          console.log('✓ Private key has correct delimiters');
        } else {
          console.log('✗ Private key missing delimiters');
        }
      }
    }
    
    console.log('\nFull error:', error);
  }
}

testExplicitAuth();