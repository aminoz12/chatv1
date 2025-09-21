// Test script to verify TwiML generation for client voice workflow
const twilio = require('twilio');

console.log('Testing TwiML generation for client voice workflow...\n');

// Test the main /voice endpoint TwiML
console.log('=== MAIN VOICE ENDPOINT TWIML ===');
const twiml1 = new twilio.twiml.VoiceResponse();
const testHost = 'https://example.com';
const voiceFileUrl = `${testHost}/voice-files/a1.mp3`;

console.log('Host URL:', testHost);
console.log('Playing client greeting (a1.mp3):', voiceFileUrl);

twiml1.pause({ length: 10 });
twiml1.play(voiceFileUrl);

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
const voiceFileUrl2 = `${testHost}/voice-files/a2.mp3`;

console.log('Playing positive response (a2.mp3):', voiceFileUrl2);
twiml2.play(voiceFileUrl2);
twiml2.hangup();

console.log('Generated TwiML:');
console.log(twiml2.toString());
console.log('');

// Test the /voice-response endpoint TwiML for "non" response
console.log('=== VOICE RESPONSE TWIML (NON) ===');
const twiml3 = new twilio.twiml.VoiceResponse();
const voiceFileUrl3 = `${testHost}/voice-files/a3.mp3`;

console.log('Playing negative response (a3.mp3):', voiceFileUrl3);
twiml3.play(voiceFileUrl3);
twiml3.hangup();

console.log('Generated TwiML:');
console.log(twiml3.toString());
console.log('');

console.log('All TwiML tests completed. No text-to-speech (Say) elements should be present.');