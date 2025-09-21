// Test script for Google Apps Script integration
async function testAppsScript() {
  // Mock data that would be sent to Apps Script
  const testData = [
    new Date().toISOString(),
    '+1234567890',
    'Jean Dupont',
    'AB-123-CD',
    'Réparation',
    'https://example.com/recording.mp3'
  ];
  
  console.log('Testing Apps Script integration with data:', testData);
  console.log('\nTo test the Apps Script integration:');
  console.log('1. Set up the Google Apps Script as described in GOOGLE_APPS_SCRIPT_INSTRUCTIONS.md');
  console.log('2. Add APPS_SCRIPT_URL to your .env file');
  console.log('3. The server will automatically use Apps Script when Google Sheets API is not available');
  
  // In a real scenario, this would be called from storeCallData function
  console.log('\nWhen properly configured, the system will:');
  console.log('- Try to use Google Sheets API first');
  console.log('- If that fails, fall back to Apps Script');
  console.log('- If Apps Script URL is not configured, skip data storage gracefully');
}

testAppsScript();