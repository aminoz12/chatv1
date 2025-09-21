// Test script for client voice management API
const axios = require('axios');

async function testClientVoiceAPI() {
  const baseUrl = 'http://localhost:3000/api/voice';
  
  try {
    console.log('=== Testing Client Voice Management API ===\n');
    
    // Test 1: Add a greeting recording for a client
    console.log('1. Adding greeting recording for client +33612345678...');
    const addResponse = await axios.post(`${baseUrl}/clients/+33612345678/greeting`, {
      url: 'https://example.com/recordings/client1/greeting.mp3'
    });
    console.log('Response:', addResponse.data.message);
    
    // Test 2: Add a prompt recording for the same client
    console.log('\n2. Adding prompt recording for client +33612345678...');
    const addPromptResponse = await axios.post(`${baseUrl}/clients/+33612345678/prompt`, {
      url: 'https://example.com/recordings/client1/prompt.mp3'
    });
    console.log('Response:', addPromptResponse.data.message);
    
    // Test 3: Add a thanks recording for another client
    console.log('\n3. Adding thanks recording for client +33698765432...');
    const addThanksResponse = await axios.post(`${baseUrl}/clients/+33698765432/thanks`, {
      url: 'https://example.com/recordings/client2/thanks.mp3'
    });
    console.log('Response:', addThanksResponse.data.message);
    
    // Test 4: Get all clients with recordings
    console.log('\n4. Getting all clients with recordings...');
    const clientsResponse = await axios.get(`${baseUrl}/clients`);
    console.log('Clients with recordings:', clientsResponse.data.clients);
    
    // Test 5: Get all recordings for a specific client
    console.log('\n5. Getting all recordings for client +33612345678...');
    const clientRecordingsResponse = await axios.get(`${baseUrl}/clients/+33612345678`);
    console.log('Client recordings:', clientRecordingsResponse.data);
    
    // Test 6: Update an existing recording
    console.log('\n6. Updating greeting recording for client +33612345678...');
    const updateResponse = await axios.post(`${baseUrl}/clients/+33612345678/greeting`, {
      url: 'https://example.com/recordings/client1/greeting_v2.mp3'
    });
    console.log('Response:', updateResponse.data.message);
    
    // Test 7: Remove a recording
    console.log('\n7. Removing prompt recording for client +33612345678...');
    const removeResponse = await axios.delete(`${baseUrl}/clients/+33612345678/prompt`);
    console.log('Response:', removeResponse.data.message);
    
    // Test 8: Verify the recording was removed
    console.log('\n8. Verifying recordings for client +33612345678 after removal...');
    const verifyResponse = await axios.get(`${baseUrl}/clients/+33612345678`);
    console.log('Client recordings after removal:', verifyResponse.data);
    
    console.log('\n🎉 All client voice API tests completed successfully!');
    console.log('\nTo use client recordings in your call system:');
    console.log('1. Add recordings using the API as shown above');
    console.log('2. The system will automatically play client recordings when available');
    console.log('3. If no recording is found, it falls back to the synthetic voice');
    
  } catch (error) {
    console.error('❌ Error testing client voice API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testClientVoiceAPI();