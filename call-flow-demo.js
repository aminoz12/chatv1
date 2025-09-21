// Demonstrate how the call flow works with client recordings
const { hasClientRecording, getClientRecordingUrl } = require('./client-voice-manager');

// Simulate different callers
const callers = [
  {
    phone: '+1234567890',  // Client with recordings
    name: 'John Smith'
  },
  {
    phone: '+1111111111',  // Client without recordings (will use synthetic voice)
    name: 'Jane Doe'
  }
];

function simulateCallFlow(caller) {
  console.log(`\n=== Simulating Call from ${caller.name} (${caller.phone}) ===`);
  
  // Check if client has greeting recording
  console.log('\n1. Checking for greeting recording...');
  if (hasClientRecording(caller.phone, 'greeting')) {
    const greetingUrl = getClientRecordingUrl(caller.phone, 'greeting');
    console.log(`   ✓ Playing client recording: ${greetingUrl}`);
    console.log('   <Play>' + greetingUrl + '</Play>');
  } else {
    console.log('   ✗ No greeting recording found, using synthetic voice');
    console.log('   <Say voice="Polly.Mathieu-Neural" language="fr-FR">Bonjour! Merci d\'appeler Espace Auto 92</Say>');
  }
  
  // Check if client has prompt recording
  console.log('\n2. Asking for caller information...');
  if (hasClientRecording(caller.phone, 'prompt')) {
    const promptUrl = getClientRecordingUrl(caller.phone, 'prompt');
    console.log(`   ✓ Playing client recording: ${promptUrl}`);
    console.log('   <Play>' + promptUrl + '</Play>');
  } else {
    console.log('   ✗ No prompt recording found, using synthetic voice');
    console.log('   <Say voice="Polly.Mathieu-Neural" language="fr-FR">Veuillez dire votre nom, votre numéro de plaque d\'immatriculation, et le service souhaité.</Say>');
  }
  
  // Simulate successful data capture
  console.log('\n3. Caller provided information successfully...');
  if (hasClientRecording(caller.phone, 'thanks')) {
    const thanksUrl = getClientRecordingUrl(caller.phone, 'thanks');
    console.log(`   ✓ Playing client recording: ${thanksUrl}`);
    console.log('   <Play>' + thanksUrl + '</Play>');
  } else {
    console.log('   ✗ No thanks recording found, using synthetic voice');
    console.log('   <Say voice="Polly.Mathieu-Neural" language="fr-FR">Merci ' + caller.name + '. Nous avons bien noté votre demande.</Say>');
  }
  
  console.log('\n4. Ending call...');
  console.log('   <Hangup/>');
}

// Run simulation for each caller
console.log('=== Client Voice Recording System Demo ===');
console.log('This demonstrates how the system plays client recordings when available');
console.log('and falls back to synthetic voices when recordings are not available.\n');

callers.forEach(caller => {
  simulateCallFlow(caller);
});

console.log('\n=== Summary ===');
console.log('• John Smith (+1234567890) has recordings, so the system plays his voice');
console.log('• Jane Doe (+1111111111) has no recordings, so the system uses synthetic voice');
console.log('• The system automatically selects the appropriate response for each caller');
console.log('• New clients automatically get the synthetic voice experience');
console.log('• You can gradually add recordings for your frequent clients');