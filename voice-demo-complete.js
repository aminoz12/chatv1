// Complete voice demo showcasing many available synthetic voices
const twilio = require('twilio');

function generateCompleteVoiceDemo() {
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Welcome message
  twiml.say({ voice: 'Polly.Mathieu-Neural', language: 'fr-FR' }, 
    'Bienvenue dans la démonstration complète des voix synthétiques.');
  twiml.pause({ length: 2 });
  
  // French voices
  twiml.say({ voice: 'Polly.Mathieu-Neural', language: 'fr-FR' }, 
    'Voici Mathieu, une voix française Amazon Polly.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Polly.Celine-Neural', language: 'fr-FR' }, 
    'Bonjour, je suis Céline, une autre voix française Amazon Polly.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Polly.Lea-Neural', language: 'fr-FR' }, 
    'Salut, moi c\'est Léa, la troisième voix française Amazon Polly.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Google.fr-FR-Standard-A', language: 'fr-FR' }, 
    'Voici une voix Google en français.');
  twiml.pause({ length: 1 });
  
  // English voices (UK)
  twiml.say({ voice: 'Polly.Amy-Neural', language: 'en-GB' }, 
    'Hello, I\'m Amy, a British English voice from Amazon Polly.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Polly.Brian-Neural', language: 'en-GB' }, 
    'Hi there, I\'m Brian, another British English voice.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Polly.Emma-Neural', language: 'en-GB' }, 
    'Hello, I\'m Emma, also a British English voice from Amazon Polly.');
  twiml.pause({ length: 1 });
  
  // English voices (US)
  twiml.say({ voice: 'Polly.Joey-Neural', language: 'en-US' }, 
    'Hey, I\'m Joey, an American English voice from Amazon Polly.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Polly.Matthew-Neural', language: 'en-US' }, 
    'Hi, I\'m Matthew, another American English voice.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Polly.Salli-Neural', language: 'en-US' }, 
    'Hello, I\'m Salli, an American English female voice.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Google.en-US-Standard-C', language: 'en-US' }, 
    'This is a Google American English voice.');
  twiml.pause({ length: 1 });
  
  // German voices
  twiml.say({ voice: 'Polly.Hans-Neural', language: 'de-DE' }, 
    'Hallo, ich bin Hans, eine deutsche Stimme von Amazon Polly.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Polly.Vicki-Neural', language: 'de-DE' }, 
    'Guten Tag, ich bin Vicki, eine weitere deutsche Stimme.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Google.de-DE-Standard-A', language: 'de-DE' }, 
    'Dies ist eine Google deutsche Stimme.');
  twiml.pause({ length: 1 });
  
  // Spanish voices
  twiml.say({ voice: 'Polly.Conchita-Neural', language: 'es-ES' }, 
    'Hola, soy Conchita, una voz española de Amazon Polly.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Polly.Enrique-Neural', language: 'es-ES' }, 
    'Hola, soy Enrique, otra voz española de Amazon Polly.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Google.es-ES-Standard-A', language: 'es-ES' }, 
    'Esta es una voz Google en español.');
  twiml.pause({ length: 1 });
  
  // Italian voices
  twiml.say({ voice: 'Polly.Bianca-Neural', language: 'it-IT' }, 
    'Ciao, sono Bianca, una voce italiana di Amazon Polly.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Google.it-IT-Standard-A', language: 'it-IT' }, 
    'Questa è una voce Google in italiano.');
  twiml.pause({ length: 1 });
  
  // Japanese voices
  twiml.say({ voice: 'Polly.Mizuki-Neural', language: 'ja-JP' }, 
    'こんにちは、私はミズキです、アマゾンポリーの日本語の声です。');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Google.ja-JP-Standard-A', language: 'ja-JP' }, 
    'これはグーグルの日本語の声です。');
  twiml.pause({ length: 1 });
  
  // Portuguese voices
  twiml.say({ voice: 'Polly.Camila-Neural', language: 'pt-BR' }, 
    'Olá, eu sou a Camila, uma voz brasileira da Amazon Polly.');
  twiml.pause({ length: 1 });
  
  twiml.say({ voice: 'Google.pt-BR-Standard-A', language: 'pt-BR' }, 
    'Esta é uma voz Google em português do Brasil.');
  twiml.pause({ length: 2 });
  
  // Closing message
  twiml.say({ voice: 'Polly.Mathieu-Neural', language: 'fr-FR' }, 
    'Fin de la démonstration. Merci d\'avoir écouté toutes ces voix différentes.');
  
  return twiml;
}

// Function to generate a short demo with just a few voices
function generateShortVoiceDemo() {
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Welcome message
  twiml.say({ voice: 'Polly.Mathieu-Neural', language: 'fr-FR' }, 
    'Voici une courte démonstration de quelques voix synthétiques.');
  twiml.pause({ length: 1 });
  
  // French
  twiml.say({ voice: 'Polly.Mathieu-Neural', language: 'fr-FR' }, 
    'Bonjour, je suis Mathieu.');
  twiml.pause({ length: 1 });
  
  // English
  twiml.say({ voice: 'Polly.Amy-Neural', language: 'en-GB' }, 
    'Hello, I\'m Amy.');
  twiml.pause({ length: 1 });
  
  // German
  twiml.say({ voice: 'Polly.Hans-Neural', language: 'de-DE' }, 
    'Hallo, ich bin Hans.');
  twiml.pause({ length: 1 });
  
  // Spanish
  twiml.say({ voice: 'Polly.Conchita-Neural', language: 'es-ES' }, 
    'Hola, soy Conchita.');
  
  return twiml;
}

// Export functions
module.exports = { generateCompleteVoiceDemo, generateShortVoiceDemo };

// If run directly, output the TwiML
if (require.main === module) {
  console.log('=== Short Voice Demo TwiML ===');
  console.log(generateShortVoiceDemo().toString());
  
  console.log('\n=== Complete Voice Demo TwiML ===');
  console.log(generateCompleteVoiceDemo().toString());
}