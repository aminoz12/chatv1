const axios = require('axios');

// Test sending real data to simulate actual call scenarios
async function testRealData() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('=== Testing Real Data Scenarios ===\n');
    
    // Test 1: Simulate speech gathering with real French data
    console.log('1. Testing speech gathering with real data...');
    const gatherResponse = await axios.post(`${baseUrl}/gather`, {
      SpeechResult: 'Je m\'appelle Marie Dubois, plaque AB-123-CD, je viens pour un entretien.',
      From: '+33123456789'
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('✅ Speech gathering test successful');
    console.log('Response:', gatherResponse.data.substring(0, 100) + '...\n');
    
    // Test 2: Simulate call recording with real data
    console.log('2. Testing call recording with real data...');
    const recordResponse = await axios.post(`${baseUrl}/record`, {
      RecordingUrl: 'https://api.twilio.com/2010-04-01/Accounts/AC0d3887ec2d01d17eea3478a56ccd5ebc/Recordings/RE1234567890abcdef1234567890abcd',
      From: '+33987654321',
      RecordingDuration: '45'
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('✅ Call recording test successful');
    console.log('Response:', recordResponse.data.substring(0, 100) + '...\n');
    
    // Test 3: Simulate empty speech result (edge case)
    console.log('3. Testing empty speech result...');
    const emptySpeechResponse = await axios.post(`${baseUrl}/gather`, {
      SpeechResult: '',
      From: '+33112233445'
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('✅ Empty speech test successful');
    console.log('Response:', emptySpeechResponse.data.substring(0, 100) + '...\n');
    
    // Test 4: Simulate missing recording URL (edge case)
    console.log('4. Testing missing recording URL...');
    const missingRecordingResponse = await axios.post(`${baseUrl}/record`, {
      From: '+33556677889',
      RecordingDuration: '30'
      // Note: No RecordingUrl provided
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('✅ Missing recording URL test successful');
    console.log('Response:', missingRecordingResponse.data.substring(0, 100) + '...\n');
    
    console.log('🎉 All real data tests completed successfully!');
    console.log('\nNote: If you have configured your APPS_SCRIPT_URL in the .env file,');
    console.log('this data would have been sent to your Google Apps Script and stored in your spreadsheet.');
    
  } catch (error) {
    console.error('❌ Error testing real data:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testRealData();