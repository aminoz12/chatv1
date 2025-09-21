// Explore available synthetic voices in Twilio
const twilio = require('twilio');

// This function generates TwiML to demonstrate different voices
function generateVoiceDemo() {
  const twiml = new twilio.twiml.VoiceResponse();
  
  // List of available voices with their languages
  const voices = [
    // Amazon Polly voices
    { name: 'Polly.Mathieu-Neural', language: 'fr-FR', description: 'French (France) - Mathieu (Neural)' },
    { name: 'Polly.Celine-Neural', language: 'fr-FR', description: 'French (France) - Celine (Neural)' },
    { name: 'Polly.Lea-Neural', language: 'fr-FR', description: 'French (France) - Lea (Neural)' },
    { name: 'Polly.Aditi-Neural', language: 'en-IN', description: 'English (India) - Aditi (Neural)' },
    { name: 'Polly.Amy-Neural', language: 'en-GB', description: 'English (UK) - Amy (Neural)' },
    { name: 'Polly.Brian-Neural', language: 'en-GB', description: 'English (UK) - Brian (Neural)' },
    { name: 'Polly.Emma-Neural', language: 'en-GB', description: 'English (UK) - Emma (Neural)' },
    { name: 'Polly.Joey-Neural', language: 'en-US', description: 'English (US) - Joey (Neural)' },
    { name: 'Polly.Justin-Neural', language: 'en-US', description: 'English (US) - Justin (Neural)' },
    { name: 'Polly.Kendra-Neural', language: 'en-US', description: 'English (US) - Kendra (Neural)' },
    { name: 'Polly.Kimberly-Neural', language: 'en-US', description: 'English (US) - Kimberly (Neural)' },
    { name: 'Polly.Matthew-Neural', language: 'en-US', description: 'English (US) - Matthew (Neural)' },
    { name: 'Polly.Salli-Neural', language: 'en-US', description: 'English (US) - Salli (Neural)' },
    { name: 'Polly.Lotte-Neural', language: 'nl-NL', description: 'Dutch - Lotte (Neural)' },
    { name: 'Polly.Ruben-Neural', language: 'nl-NL', description: 'Dutch - Ruben (Neural)' },
    { name: 'Polly.Russell-Neural', language: 'en-AU', description: 'English (Australia) - Russell (Neural)' },
    { name: 'Polly.Nicole-Neural', language: 'en-AU', description: 'English (Australia) - Nicole (Neural)' },
    { name: 'Polly.Olivia-Neural', language: 'en-AU', description: 'English (Australia) - Olivia (Neural)' },
    { name: 'Polly.Vicki-Neural', language: 'de-DE', description: 'German - Vicki (Neural)' },
    { name: 'Polly.Hans-Neural', language: 'de-DE', description: 'German - Hans (Neural)' },
    { name: 'Polly.Marlene-Neural', language: 'de-DE', description: 'German - Marlene (Neural)' },
    { name: 'Polly.Bianca-Neural', language: 'it-IT', description: 'Italian - Bianca (Neural)' },
    { name: 'Polly.Giorgio-Neural', language: 'it-IT', description: 'Italian - Giorgio (Neural)' },
    { name: 'Polly.Carla-Neural', language: 'it-IT', description: 'Italian - Carla (Neural)' },
    { name: 'Polly.Mizuki-Neural', language: 'ja-JP', description: 'Japanese - Mizuki (Neural)' },
    { name: 'Polly.Takumi-Neural', language: 'ja-JP', description: 'Japanese - Takumi (Neural)' },
    { name: 'Polly.Seoyeon-Neural', language: 'ko-KR', description: 'Korean - Seoyeon (Neural)' },
    { name: 'Polly.Ines-Neural', language: 'pt-PT', description: 'Portuguese - Ines (Neural)' },
    { name: 'Polly.Cristiano-Neural', language: 'pt-PT', description: 'Portuguese - Cristiano (Neural)' },
    { name: 'Polly.Camila-Neural', language: 'pt-BR', description: 'Portuguese (Brazil) - Camila (Neural)' },
    { name: 'Polly.Ricardo-Neural', language: 'pt-BR', description: 'Portuguese (Brazil) - Ricardo (Neural)' },
    { name: 'Polly.Vitoria-Neural', language: 'pt-BR', description: 'Portuguese (Brazil) - Vitoria (Neural)' },
    { name: 'Polly.Conchita-Neural', language: 'es-ES', description: 'Spanish (Spain) - Conchita (Neural)' },
    { name: 'Polly.Enrique-Neural', language: 'es-ES', description: 'Spanish (Spain) - Enrique (Neural)' },
    { name: 'Polly.Lucia-Neural', language: 'es-ES', description: 'Spanish (Spain) - Lucia (Neural)' },
    { name: 'Polly.Penelope-Neural', language: 'es-US', description: 'Spanish (US) - Penelope (Neural)' },
    { name: 'Polly.Miguel-Neural', language: 'es-US', description: 'Spanish (US) - Miguel (Neural)' },
    { name: 'Polly.Lupe-Neural', language: 'es-US', description: 'Spanish (US) - Lupe (Neural)' },
    { name: 'Polly.Astrid-Neural', language: 'sv-SE', description: 'Swedish - Astrid (Neural)' },
    { name: 'Polly.Hedvig-Neural', language: 'sv-SE', description: 'Swedish - Hedvig (Neural)' },
    
    // Google voices
    { name: 'Google.en-US-Standard-C', language: 'en-US', description: 'English (US) - Standard C' },
    { name: 'Google.en-US-Standard-D', language: 'en-US', description: 'English (US) - Standard D' },
    { name: 'Google.en-US-Standard-E', language: 'en-US', description: 'English (US) - Standard E' },
    { name: 'Google.en-US-Standard-F', language: 'en-US', description: 'English (US) - Standard F' },
    { name: 'Google.en-US-Standard-G', language: 'en-US', description: 'English (US) - Standard G' },
    { name: 'Google.en-US-Standard-H', language: 'en-US', description: 'English (US) - Standard H' },
    { name: 'Google.en-US-Standard-I', language: 'en-US', description: 'English (US) - Standard I' },
    { name: 'Google.en-US-Standard-J', language: 'en-US', description: 'English (US) - Standard J' },
    { name: 'Google.fr-FR-Standard-A', language: 'fr-FR', description: 'French (France) - Standard A' },
    { name: 'Google.fr-FR-Standard-B', language: 'fr-FR', description: 'French (France) - Standard B' },
    { name: 'Google.fr-FR-Standard-C', language: 'fr-FR', description: 'French (France) - Standard C' },
    { name: 'Google.fr-FR-Standard-D', language: 'fr-FR', description: 'French (France) - Standard D' },
    { name: 'Google.de-DE-Standard-A', language: 'de-DE', description: 'German - Standard A' },
    { name: 'Google.de-DE-Standard-B', language: 'de-DE', description: 'German - Standard B' },
    { name: 'Google.it-IT-Standard-A', language: 'it-IT', description: 'Italian - Standard A' },
    { name: 'Google.ja-JP-Standard-A', language: 'ja-JP', description: 'Japanese - Standard A' },
    { name: 'Google.ko-KR-Standard-A', language: 'ko-KR', description: 'Korean - Standard A' },
    { name: 'Google.pt-BR-Standard-A', language: 'pt-BR', description: 'Portuguese (Brazil) - Standard A' },
    { name: 'Google.es-ES-Standard-A', language: 'es-ES', description: 'Spanish (Spain) - Standard A' },
  ];
  
  console.log('=== Available Synthetic Voices ===\n');
  
  voices.forEach((voice, index) => {
    console.log(`${index + 1}. ${voice.description}`);
    console.log(`   Voice Name: ${voice.name}`);
    console.log(`   Language: ${voice.language}`);
    console.log('');
    
    // Add to TwiML demo (first 5 voices only to keep it short)
    if (index < 5) {
      twiml.say(
        { 
          voice: voice.name, 
          language: voice.language 
        }, 
        `Bonjour! This is ${voice.description}`
      );
      twiml.pause({ length: 1 });
    }
  });
  
  console.log(`Total voices available: ${voices.length}`);
  console.log('\n=== How to Hear These Voices ===');
  console.log('1. Start your server: node server.js');
  console.log('2. Use ngrok to expose your local server: ngrok http 3000');
  console.log('3. Update your Twilio phone number webhook to point to your ngrok URL + /voice');
  console.log('4. Call your Twilio number to hear the voices');
  console.log('\nOr create a custom endpoint that uses the generateVoiceDemoTwiML() function');
  
  return twiml;
}

// Generate TwiML for voice demo
function generateVoiceDemoTwiML() {
  const twiml = new twilio.twiml.VoiceResponse();
  
  twiml.say({ voice: 'Polly.Mathieu-Neural', language: 'fr-FR' }, 
    'Bonjour! This is Mathieu, a French voice from Amazon Polly.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Polly.Amy-Neural', language: 'en-GB' }, 
    'Hello! This is Amy, a British English voice from Amazon Polly.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Polly.Matthew-Neural', language: 'en-US' }, 
    'Hi there! This is Matthew, an American English voice from Amazon Polly.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Google.fr-FR-Standard-A', language: 'fr-FR' }, 
    'Bonjour! This is a Google French voice.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Google.en-US-Standard-C', language: 'en-US' }, 
    'Hello! This is a Google American English voice.');
  
  return twiml;
}

// Run the demonstration
generateVoiceDemo();

console.log('\n=== Example TwiML Output ===');
console.log(generateVoiceDemoTwiML().toString());

module.exports = { generateVoiceDemoTwiML };