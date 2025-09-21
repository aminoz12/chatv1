// Test the current TwiML generation to verify URL paths
const twilio = require('twilio');

console.log('Testing current TwiML generation...\n');

// Test the main /voice endpoint TwiML
console.log('=== MAIN VOICE ENDPOINT TWIML ===');
const twiml1 = new twilio.twiml.VoiceResponse();
const hostUrl = 'https://46d4fef642a5.ngrok-free.app'; // Your actual host URL
console.log('Host URL:', hostUrl);

twiml1.pause({ length: 10 });
const playUrl1 = `${hostUrl}/voice-files/a1.mp3`;
console.log('Playing client greeting (a1.mp3):', playUrl1);
twiml1.play(playUrl1);

const gather = twiml1.gather({
  input: 'speech',
  action: '/voice-response',
  method: 'POST',
  language: 'fr-FR',
  timeout: 15,
  speechModel: 'phone_call'
});

twiml1.hangup();

console.log('Generated TwiML:');
console.log(twiml1.toString());
console.log('');

// Test the /voice-response endpoint TwiML for "oui" response
console.log('=== VOICE RESPONSE TWIML (OUI) ===');
const twiml2 = new twilio.twiml.VoiceResponse();
const playUrl2 = `${hostUrl}/voice-files/a2.mp3`;
console.log('Playing positive response (a2.mp3):', playUrl2);
twiml2.play(playUrl2);
twiml2.hangup();

console.log('Generated TwiML:');
console.log(twiml2.toString());
console.log('');

// Test the /voice-response endpoint TwiML for "non" response
console.log('=== VOICE RESPONSE TWIML (NON) ===');
const twiml3 = new twilio.twiml.VoiceResponse();
const playUrl3 = `${hostUrl}/voice-files/a3.mp3`;
console.log('Playing negative response (a3.mp3):', playUrl3);
twiml3.play(playUrl3);
twiml3.hangup();

console.log('Generated TwiML:');
console.log(twiml3.toString());
console.log('');

console.log('All TwiML tests completed. URLs should be:');
console.log('1. https://46d4fef642a5.ngrok-free.app/voice-files/a1.mp3');
console.log('2. https://46d4fef642a5.ngrok-free.app/voice-files/a2.mp3');
console.log('3. https://46d4fef642a5.ngrok-free.app/voice-files/a3.mp3');