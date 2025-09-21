// Test script for voice demos
const { generateShortVoiceDemo, generateCompleteVoiceDemo } = require('./voice-demo-complete');

console.log('=== Testing Voice Demo Functions ===\n');

console.log('1. Short Voice Demo TwiML:');
console.log(generateShortVoiceDemo().toString());
console.log('\n' + '='.repeat(50) + '\n');

console.log('2. Complete Voice Demo TwiML:');
console.log(generateCompleteVoiceDemo().toString());
console.log('\n' + '='.repeat(50) + '\n');

console.log('=== How to Use These Demos ===');
console.log('1. Start your server: node server.js');
console.log('2. Use ngrok: ngrok http 3000');
console.log('3. Set your Twilio webhook to:');
console.log('   - Short demo: https://your-ngrok-url/demo-voices/short');
console.log('   - Complete demo: https://your-ngrok-url/demo-voices/complete');
console.log('4. Call your Twilio number to hear the voices');