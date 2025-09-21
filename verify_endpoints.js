const http = require('http');

// Test the /voice endpoint
const voiceData = JSON.stringify({
  // Add any required Twilio parameters here
});

const voiceOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/voice',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': voiceData.length
  }
};

const voiceReq = http.request(voiceOptions, res => {
  console.log(`Status for /voice: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

voiceReq.on('error', error => {
  console.error('Error with /voice endpoint:', error);
});

voiceReq.write(voiceData);
voiceReq.end();

// Test the /voice-response endpoint
const responseOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/voice-response',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': 0
  }
};

const responseReq = http.request(responseOptions, res => {
  console.log(`Status for /voice-response: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

responseReq.on('error', error => {
  console.error('Error with /voice-response endpoint:', error);
});

responseReq.end();