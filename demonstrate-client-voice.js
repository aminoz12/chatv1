// Demonstrate client voice functionality
const { hasClientRecording, getClientRecordingUrl } = require('./client-voice-manager');

function demonstrateClientVoice() {
  console.log('=== Client Voice Demonstration ===\n');
  
  // Test with a client that has a greeting recording
  const client1 = '+33612345678';
  console.log(`Checking recordings for client: ${client1}`);
  
  if (hasClientRecording(client1, 'greeting')) {
    const greetingUrl = getClientRecordingUrl(client1, 'greeting');
    console.log(`✓ Client ${client1} has a greeting recording:`);
    console.log(`  URL: ${greetingUrl}`);
    console.log(`  The system will play this recording instead of using a synthetic voice\n`);
  } else {
    console.log(`✗ Client ${client1} does not have a greeting recording`);
    console.log(`  The system will use a synthetic voice as fallback\n`);
  }
  
  // Test with a client that doesn't have a prompt recording
  console.log(`Checking prompt recording for client: ${client1}`);
  
  if (hasClientRecording(client1, 'prompt')) {
    const promptUrl = getClientRecordingUrl(client1, 'prompt');
    console.log(`✓ Client ${client1} has a prompt recording:`);
    console.log(`  URL: ${promptUrl}`);
    console.log(`  The system will play this recording instead of using a synthetic voice\n`);
  } else {
    console.log(`✗ Client ${client1} does not have a prompt recording`);
    console.log(`  The system will use a synthetic voice as fallback\n`);
  }
  
  // Test with another client that has a thanks recording
  const client2 = '+33698765432';
  console.log(`Checking recordings for client: ${client2}`);
  
  if (hasClientRecording(client2, 'thanks')) {
    const thanksUrl = getClientRecordingUrl(client2, 'thanks');
    console.log(`✓ Client ${client2} has a thanks recording:`);
    console.log(`  URL: ${thanksUrl}`);
    console.log(`  The system will play this recording instead of using a synthetic voice\n`);
  } else {
    console.log(`✗ Client ${client2} does not have a thanks recording`);
    console.log(`  The system will use a synthetic voice as fallback\n`);
  }
  
  console.log('=== How It Works ===');
  console.log('1. When a call comes in, the system checks if there is a client-specific recording');
  console.log('2. If a recording exists, it plays the recording using <Play> verb');
  console.log('3. If no recording exists, it falls back to synthetic voice using <Say> verb');
  console.log('4. This provides a personalized experience for returning clients');
  console.log('\nTo add your own client recordings:');
  console.log('- Use the API endpoints in client-voice-manager.js');
  console.log('- Or directly modify client-recordings.json');
  console.log('- Recordings should be accessible via HTTP URLs');
}

demonstrateClientVoice();