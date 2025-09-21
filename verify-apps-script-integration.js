// Script to verify Apps Script integration without actually sending data
require('dotenv').config();

function verifyAppsScriptIntegration() {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;
  
  console.log('=== Verifying Google Apps Script Integration ===\n');
  
  if (!appsScriptUrl || appsScriptUrl.startsWith('#')) {
    console.log('❌ APPS_SCRIPT_URL not configured in .env file');
    console.log('   Please uncomment and set the APPS_SCRIPT_URL in your .env file');
    console.log('   Example: APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec\n');
    return false;
  }
  
  console.log('✅ APPS_SCRIPT_URL is configured:');
  console.log(`   ${appsScriptUrl}\n`);
  
  // Test data that would be sent
  const testData = [
    new Date().toISOString(),
    '+33123456789',
    'Marie Dubois',
    'AB-123-CD',
    'Entretien',
    'https://api.twilio.com/2010-04-01/Accounts/AC0d3887ec2d01d17eea3478a56ccd5ebc/Recordings/RE1234567890abcdef1234567890abcd'
  ];
  
  console.log('Data that would be sent to Apps Script:');
  console.log('  Timestamp:', testData[0]);
  console.log('  Caller Number:', testData[1]);
  console.log('  Name:', testData[2]);
  console.log('  Plate:', testData[3]);
  console.log('  Service:', testData[4]);
  console.log('  Recording URL:', testData[5]);
  console.log('');
  
  console.log('✅ Integration verification complete');
  console.log('   When your server receives actual calls, this data will be sent to your Google Apps Script');
  console.log('   and stored in your Google Sheet if the script is properly deployed.\n');
  
  return true;
}

verifyAppsScriptIntegration();