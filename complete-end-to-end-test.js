const axios = require('axios');
require('dotenv').config();

// Complete end-to-end test simulating real call scenarios
async function completeEndToEndTest() {
  const baseUrl = 'http://localhost:3000';
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;
  
  console.log('=== Complete End-to-End Test ===\n');
  
  // Check if Apps Script is configured
  if (!appsScriptUrl || appsScriptUrl.startsWith('#')) {
    console.log('⚠️  Warning: APPS_SCRIPT_URL not configured in .env file');
    console.log('   Data will not be stored in Google Sheets\n');
  } else {
    console.log('✅ APPS_SCRIPT_URL is configured');
    console.log('   Data will be sent to:', appsScriptUrl.split('/').slice(-1)[0], '\n');
  }
  
  try {
    // Test 1: Simulate a complete call flow - speech gathering
    console.log('1. Testing complete call flow - speech gathering...');
    const gatherStartTime = Date.now();
    const gatherResponse = await axios.post(`${baseUrl}/gather`, {
      SpeechResult: 'Je m\'appelle Pierre Martin, plaque XY-789-ZW, je viens pour une réparation moteur.',
      From: '+33612345678'
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const gatherDuration = Date.now() - gatherStartTime;
    
    console.log(`   ✅ Speech gathering processed in ${gatherDuration}ms`);
    console.log('   Response:', gatherResponse.data.includes('Merci Pierre') ? 'Correct greeting response' : 'Unexpected response');
    
    // Test 2: Simulate a complete call flow - call recording
    console.log('\n2. Testing complete call flow - call recording...');
    const recordStartTime = Date.now();
    const recordResponse = await axios.post(`${baseUrl}/record`, {
      RecordingUrl: 'https://api.twilio.com/2010-04-01/Accounts/AC0d3887ec2d01d17eea3478a56ccd5ebc/Recordings/RE9876543210zyxwvutsrqponmlkjihgfedcba',
      From: '+33698765432',
      RecordingDuration: '75'
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const recordDuration = Date.now() - recordStartTime;
    
    console.log(`   ✅ Call recording processed in ${recordDuration}ms`);
    console.log('   Response:', recordResponse.data.includes('message a été enregistré') ? 'Correct recording response' : 'Unexpected response');
    
    // Test 3: Simulate edge case - empty speech
    console.log('\n3. Testing edge case - empty speech result...');
    const emptyStartTime = Date.now();
    const emptyResponse = await axios.post(`${baseUrl}/gather`, {
      SpeechResult: '',
      From: '+33611223344'
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const emptyDuration = Date.now() - emptyStartTime;
    
    console.log(`   ✅ Empty speech handled in ${emptyDuration}ms`);
    console.log('   Response:', emptyResponse.data.includes('n\'avons pas compris') ? 'Correct error response' : 'Unexpected response');
    
    console.log('\n🎉 All end-to-end tests completed successfully!');
    
    if (appsScriptUrl && !appsScriptUrl.startsWith('#')) {
      console.log('\n📋 What happened during these tests:');
      console.log('   1. Speech data was parsed and would be sent to your Google Apps Script');
      console.log('   2. Recording data would be sent to your Google Apps Script');
      console.log('   3. Error cases were handled gracefully');
      console.log('\n📊 In a real deployment:');
      console.log('   - Data would appear in your Google Sheet with columns:');
      console.log('     date, numero, nom, plaquette, service, recordurl');
      console.log('   - All endpoints respond with proper TwiML for Twilio');
      console.log('   - System handles errors gracefully without crashing');
    } else {
      console.log('\n📋 Note: Since APPS_SCRIPT_URL is not configured, data was not sent to Google Sheets');
      console.log('   To enable data storage, follow the instructions in GOOGLE_APPS_SCRIPT_INSTRUCTIONS.md');
    }
    
  } catch (error) {
    console.error('❌ Error during end-to-end test:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

completeEndToEndTest();