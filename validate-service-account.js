// Script to validate the service account key
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

function validateServiceAccountKey() {
  console.log('=== Service Account Key Validation ===\n');
  
  // Check key.json file
  console.log('1. Validating key.json file...');
  try {
    const keyFilePath = './key.json';
    if (fs.existsSync(keyFilePath)) {
      console.log('✓ key.json file found');
      
      const keyData = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
      console.log('✓ key.json file parsed successfully');
      
      // Check required fields
      const requiredFields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email', 'client_id'];
      let allFieldsPresent = true;
      
      for (const field of requiredFields) {
        if (!keyData[field]) {
          console.log(`✗ Missing required field: ${field}`);
          allFieldsPresent = false;
        } else {
          console.log(`✓ Field ${field} present`);
          if (field === 'client_email') {
            console.log(`  Client email: ${keyData[field]}`);
          }
        }
      }
      
      if (allFieldsPresent) {
        console.log('✓ All required fields present');
      }
      
      // Validate private key format
      if (keyData.private_key) {
        console.log(`  Private key length: ${keyData.private_key.length} characters`);
        
        if (keyData.private_key.startsWith('-----BEGIN PRIVATE KEY-----')) {
          console.log('✓ Private key format looks correct');
        } else {
          console.log('✗ Private key format may be incorrect');
          console.log('  Private key preview:', keyData.private_key.substring(0, 100));
        }
        
        // Check for newlines
        const newlineCount = (keyData.private_key.match(/\n/g) || []).length;
        console.log(`  Newlines in private key: ${newlineCount}`);
        
        if (newlineCount < 10) {
          console.log('⚠️  Warning: Private key may be missing newlines');
        }
      }
      
      // Note: We can't reliably determine key age from private_key_id alone
      // The previous calculation was incorrect
      
    } else {
      console.log('✗ key.json file not found');
    }
  } catch (error) {
    console.log('✗ Error validating key.json file:', error.message);
  }
  
  // Check environment variable
  console.log('\n2. Validating environment variable...');
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  
  if (serviceAccountKey) {
    console.log('✓ GOOGLE_SERVICE_ACCOUNT_KEY environment variable found');
    console.log(`  Variable length: ${serviceAccountKey.length} characters`);
    
    try {
      const keyData = JSON.parse(serviceAccountKey);
      console.log('✓ Environment variable parsed successfully');
      
      if (keyData.client_email) {
        console.log(`  Client email: ${keyData.client_email}`);
      }
      
      if (keyData.private_key) {
        console.log(`  Private key length: ${keyData.private_key.length} characters`);
        
        // Check if it contains escaped newlines
        if (keyData.private_key.includes('\\n')) {
          console.log('  Contains escaped newlines (\\n) - will need to be converted');
        } else if (keyData.private_key.includes('\n')) {
          console.log('  Contains actual newlines');
        } else {
          console.log('⚠️  Warning: Private key may be missing newlines');
        }
      }
    } catch (parseError) {
      console.log('✗ Failed to parse environment variable as JSON:', parseError.message);
    }
  } else {
    console.log('✗ GOOGLE_SERVICE_ACCOUNT_KEY environment variable not found');
  }
  
  console.log('\n=== Validation Complete ===');
  console.log('Next steps:');
  console.log('1. Run the test-google-api.js script to test actual Google Sheets API access');
  console.log('2. If that fails, check that:');
  console.log('   - Google Sheets API is enabled in your Google Cloud project');
  console.log('   - Your spreadsheet is shared with the service account email');
  console.log('   - Your SPREADSHEET_ID environment variable is correct');
}

validateServiceAccountKey();