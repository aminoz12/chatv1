const http = require('http');

// Test accessing the voice files
const testUrls = [
  'http://localhost:3001/voice-files/a1.mp3',
  'http://localhost:3001/voice-files/a2.mp3',
  'http://localhost:3001/voice-files/a3.mp3'
];

function testUrl(url, callback) {
  console.log(`Testing ${url}...`);
  
  const req = http.get(url, (res) => {
    console.log(`  Status: ${res.statusCode}`);
    console.log(`  Content-Type: ${res.headers['content-type']}`);
    console.log(`  Content-Length: ${res.headers['content-length'] || 'Unknown'}`);
    
    if (res.statusCode === 200) {
      console.log(`  ✓ ${url} is accessible`);
    } else {
      console.log(`  ✗ ${url} returned status ${res.statusCode}`);
    }
    
    // Read a small amount of data to verify content
    res.on('data', (chunk) => {
      // Just read first chunk to verify content exists
      if (chunk.length > 0) {
        console.log(`  ✓ Content received (${chunk.length} bytes)`);
      }
      res.destroy(); // Stop reading
    });
    
    res.on('end', callback);
  }).on('error', (err) => {
    console.log(`  ✗ Error accessing ${url}: ${err.message}`);
    callback();
  });
  
  // Set timeout
  req.setTimeout(5000, () => {
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

console.log('Testing voice file accessibility...\n');
testAllUrls();