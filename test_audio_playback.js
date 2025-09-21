const express = require('express');
const twilio = require('twilio');

const app = express();

// Test endpoint to play just one audio file immediately
app.post('/test-audio', (req, res) => {
  console.log('=== TESTING AUDIO PLAYBACK ===');
  console.log('Request body:', req.body);
  
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Play a1.mp3 immediately without pause
  const hostUrl = 'https://46d4fef642a5.ngrok-free.app';
  twiml.play(`${hostUrl}/voice-files/a1.mp3`);
  
  // Add a message after 2 seconds to confirm if audio played
  twiml.pause({ length: 2 });
  twiml.say('If you hear this message, the audio file has finished playing');
  
  console.log('Generated TwiML:', twiml.toString());
  
  res.type('text/xml');
  res.send(twiml.toString());
});

app.listen(3001, () => {
  console.log('Audio test server running on port 3001');
  console.log('Test endpoint: http://localhost:3001/test-audio');
});