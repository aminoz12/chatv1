// Verification script to ensure no text-to-speech is used
const fs = require('fs');

// Read the server.js file
const serverCode = fs.readFileSync('server.js', 'utf8');

// Check for any twiml.say() calls
const sayCalls = (serverCode.match(/twiml\.say\(/g) || []).length;

// Check for any playOrSay calls (which might fallback to text-to-speech)
const playOrSayCalls = (serverCode.match(/playOrSay/g) || []).length;

console.log('=== TEXT-TO-SPEECH VERIFICATION ===');
console.log('Checking server.js for text-to-speech usage...\n');

console.log(`Direct twiml.say() calls found: ${sayCalls}`);
console.log(`playOrSay function calls found: ${playOrSayCalls}\n`);

if (sayCalls === 0 && playOrSayCalls === 0) {
  console.log('✓ PASS: No text-to-speech usage found');
  console.log('✓ The system now uses only client voice recordings (MP3 files)');
} else {
  console.log('✗ WARNING: Text-to-speech usage detected');
  console.log('  Please review the server.js file to remove text-to-speech elements');
  
  if (sayCalls > 0) {
    console.log(`  - Found ${sayCalls} direct twiml.say() calls`);
  }
  
  if (playOrSayCalls > 0) {
    console.log(`  - Found ${playOrSayCalls} playOrSay function calls`);
    console.log('  - playOrSay may fallback to text-to-speech if recordings are not found');
  }
}

console.log('\n=== VERIFICATION COMPLETE ===');