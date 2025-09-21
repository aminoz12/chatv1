const https = require('https');

// Test accessing the voice files using your ngrok URL
const testUrls = [
  'https://46d4fef642a5.ngrok-free.app/voice-files/a1.mp3',
  'https://46d4fef642a5.ngrok-free.app/voice-files/a2.mp3',
  'https://46d4fef642a5.ngrok-free.app/voice-files/a3.mp3'
];

function testUrl(url, callback) {
  console.log(`Testing ${url}...`);
  
  const req = https.get(url, (res) => {
    console.log(`  Status: ${res.statusCode}`);
    console.log(`  Content-Type: ${res.headers['content-type']}`);
    console.log(`  Content-Length: ${res.headers['content-length'] || 'Unknown'}`);
    
    if (res.statusCode === 200) {
      console.log(`  ✓ ${url} is accessible`);
    } else {
      console.log(`  ✗ ${url} returned status ${res.statusCode}`);
    }
    
    callback();
  }).on('error', (err) => {
    console.log(`  ✗ Error accessing ${url}: ${err.message}`);
    callback();
  });
  
  // Set timeout
  req.setTimeout(10000, () => {
    console.log(`  ✗ Timeout accessing ${url}`);
    req.destroy();
    callback();
  });
}

function testAllUrls(index = 0) {
  if (index >= testUrls.length) {
    console.log('\nAll tests completed.');
    process.exit(0);
  }
  
  testUrl(testUrls[index], () => {
    console.log(''); // Empty line between tests
    testAllUrls(index + 1);
  });
}

console.log('Testing voice file accessibility using your ngrok URL...\n');
testAllUrls();