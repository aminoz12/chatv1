const http = require('http');

// Test that your POST endpoints are accessible
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/voice',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'TwilioProxy/1.1'
  }
};

console.log('Testing POST endpoint accessibility...\n');

const req = http.request(options, (res) => {
  console.log(`POST /voice endpoint:`);
  console.log(`  Status: ${res.statusCode}`);
  console.log(`  Content-Type: ${res.headers['content-type']}`);
  
  if (res.statusCode === 200) {
    console.log(`  ✓ POST endpoint is accessible`);
  } else {
    console.log(`  ✗ POST endpoint returned status ${res.statusCode}`);
  }
  
  // Collect response data
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (data.includes('<Response>') && data.includes('<Play>')) {
      console.log(`  ✓ Response contains valid TwiML with Play command`);
    } else {
      console.log(`  ✗ Response may not contain valid TwiML`);
    }
    
    console.log('\nTest completed.');
  });
});

req.on('error', (error) => {
  console.log(`✗ Error testing POST endpoint: ${error.message}`);
  console.log('\nTest completed.');
});

// Send minimal form data like Twilio would
req.write('From=%2B1234567890&CallSid=CA1234567890');
req.end();