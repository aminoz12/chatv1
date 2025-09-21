// Test the /record endpoint
const express = require('express');
const axios = require('axios');

async function testRecordEndpoint() {
  console.log('=== Testing /record Endpoint ===\n');
  
  try {
    // Test the endpoint with sample data
    console.log('Sending test request to /record endpoint...');
    
    const response = await axios.post('http://localhost:3000/record', 
      new URLSearchParams({
        RecordingUrl: 'https://example.com/recording.mp3',
        From: '+1234567890',
        RecordingDuration: '30'
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('✓ Request sent successfully');
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers['content-type']);
    console.log('Response data:', response.data.substring(0, 200) + '...');
    
    // Parse the TwiML response
    if (response.data.includes('<Response>')) {
      console.log('✓ Valid TwiML response received');
      
      if (response.data.includes('enregistré')) {
        console.log('✓ Confirmation message found in response');
      } else if (response.data.includes('noté votre appel')) {
        console.log('✓ Fallback message found in response');
      } else {
        console.log('⚠️  Unexpected message in response');
      }
      
      if (response.data.includes('<Hangup')) {
        console.log('✓ Hangup command found in response');
      } else {
        console.log('⚠️  Hangup command missing from response');
      }
    } else {
      console.log('✗ Invalid response format');
    }
    
    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.log('✗ Test failed:', error.message);
    
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

// Run the test
testRecordEndpoint();