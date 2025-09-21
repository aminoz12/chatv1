// Script to verify Google Sheets environment variables
require('dotenv').config();

console.log('=== Verifying Google Sheets Environment Variables ===\n');

// Check required variables
const requiredVars = [
  'GOOGLE_CLIENT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'SPREADSHEET_ID'
];

console.log('Checking required environment variables...\n');

let allPresent = true;
for (const varName of requiredVars) {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Present`);
    if (varName === 'GOOGLE_CLIENT_EMAIL') {
      console.log(`   Value: ${process.env[varName]}`);
    } else if (varName === 'SPREADSHEET_ID') {
      console.log(`   Value: ${process.env[varName]}`);
      console.log(`   Google Sheet URL: https://docs.google.com/spreadsheets/d/${process.env[varName]}/edit`);
    } else if (varName === 'GOOGLE_PRIVATE_KEY') {
      console.log(`   Length: ${process.env[varName].length} characters`);
      console.log(`   Starts with: ${process.env[varName].substring(0, 30)}...`);
      console.log(`   Ends with: ...${process.env[varName].substring(process.env[varName].length - 30)}`);
      
      // Check formatting
      if (process.env[varName].includes('\\n') && !process.env[varName].includes('\n')) {
        console.log('   ✅ Newlines properly escaped');
      } else if (process.env[varName].includes('\n')) {
        console.log('   ⚠️  Warning: Contains actual newlines (should use \\n)');
      }
      
      if (process.env[varName].startsWith('-----BEGIN PRIVATE KEY-----')) {
        console.log('   ✅ Correct header present');
      } else {
        console.log('   ❌ Missing or incorrect header');
      }
      
      if (process.env[varName].endsWith('-----END PRIVATE KEY-----')) {
        console.log('   ✅ Correct footer present');
      } else {
        console.log('   ❌ Missing or incorrect footer');
      }
    }
  } else {
    console.log(`❌ ${varName}: MISSING`);
    allPresent = false;
  }
  console.log('');
}

if (allPresent) {
  console.log('🎉 All required environment variables are present!');
  console.log('\nNext steps:');
  console.log('1. Verify the service account has access to your Google Sheet');
  console.log('2. Ensure the Google Sheets API is enabled in your Google Cloud project');
  console.log('3. Check that your system clock is synchronized');
  console.log('4. Run the Google Sheets test script to verify authentication');
} else {
  console.log('❌ Some required environment variables are missing.');
  console.log('Please check your .env file and ensure all variables are set correctly.');
}