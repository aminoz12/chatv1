const axios = require('axios');

// Test all endpoints
async function testAllEndpoints() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Test 1: Health check endpoint
    console.log('Testing health check endpoint...');
    const healthResponse = await axios.get(`${baseUrl}/`);
    console.log('Health check response:', healthResponse.status, healthResponse.data);
    
    // Test 2: Voice GET endpoint
    console.log('\nTesting voice GET endpoint...');
    const voiceGetResponse = await axios.get(`${baseUrl}/voice`);
    console.log('Voice GET response status:', voiceGetResponse.status);
    console.log('Voice GET response data:', voiceGetResponse.data.substring(0, 100) + '...');
    
    // Test 3: Voice POST endpoint
    console.log('\nTesting voice POST endpoint...');
    const voicePostResponse = await axios.post(`${baseUrl}/voice`, {}, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('Voice POST response status:', voicePostResponse.status);
    console.log('Voice POST response data:', voicePostResponse.data.substring(0, 100) + '...');
    
    // Test 4: Gather endpoint
    console.log('\nTesting gather endpoint...');
    const gatherResponse = await axios.post(`${baseUrl}/gather`, {
      SpeechResult: 'Je m\'appelle Pierre Dupont, plaque AB-123-CD, je viens pour une réparation.',
      From: '+1234567890'
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('Gather response status:', gatherResponse.status);
    console.log('Gather response data:', gatherResponse.data.substring(0, 100) + '...');
    
    // Test 5: Record endpoint
    console.log('\nTesting record endpoint...');
    const recordResponse = await axios.post(`${baseUrl}/record`, {
      RecordingUrl: 'https://example.com/recording.mp3',
      From: '+1234567890',
      RecordingDuration: '60'
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('Record response status:', recordResponse.status);
    console.log('Record response data:', recordResponse.data);
    
    console.log('\n✅ All endpoints are working correctly!');
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAllEndpoints();