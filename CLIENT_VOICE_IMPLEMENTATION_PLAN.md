# Client Voice Implementation Plan

## 1. Serve Static Voice Files

First, we need to make the voice files accessible via HTTP so Twilio can play them.

### Implementation:
- Add static file serving for the voice directory in [server.js](file:///c%3A/Users/pc/Desktop/botcalls/server.js)

## 2. Enhanced Speech Parsing for Binary Responses

We need to modify the speech parsing to detect simple "oui"/"non" responses.

### Implementation:
- Add a new function in [parse-speech.js](file:///c%3A/Users/pc/Desktop/botcalls/parse-speech.js) to detect binary responses
- Update existing parsing to work with the new workflow

## 3. New Call Flow Endpoint

Create a dedicated endpoint for the client voice workflow.

### Implementation:
- Add a new route in [server.js](file:///c%3A/Users/pc/Desktop/botcalls/server.js) for the binary response workflow
- Implement the specific logic for a1/a2/a3.mp3 handling

## 4. Data Storage Logic

Update data storage to handle the two different scenarios.

### Implementation:
- Modify the [storeCallData](file:///c%3A/Users/pc/Desktop/botcalls/server.js#L78-L122) function or create a new function to handle the binary response data storage

## Detailed Code Changes

### 1. Update parse-speech.js

Add a new function to detect binary responses:

```javascript
// Function to detect binary responses (oui/non)
function detectBinaryResponse(speechResult) {
  if (!speechResult) return null;
  
  const lowerSpeech = speechResult.toLowerCase().trim();
  
  // Check for positive response
  if (lowerSpeech.includes('oui') || lowerSpeech === 'oui') {
    return 'oui';
  }
  
  // Check for negative response
  if (lowerSpeech.includes('non') || lowerSpeech === 'non') {
    return 'non';
  }
  
  // Not a binary response
  return null;
}

module.exports = { parseSpeechResult, detectBinaryResponse };
```

### 2. Update server.js

Add static file serving and new endpoint:

```javascript
// Add after existing middleware
app.use('/voice-files', express.static(path.join(__dirname, 'voice')));

// New endpoint for client voice workflow
app.post('/client-voice', async (req, res) => {
  console.log('=== CLIENT VOICE WORKFLOW ===');
  console.log('Request body:', req.body);
  
  const twiml = new twilio.twiml.VoiceResponse();
  const callerId = req.body.From;
  
  try {
    // Play greeting (a1.mp3)
    twiml.play(`${req.protocol}://${req.get('host')}/voice-files/a1.mp3`);
    
    // Gather response
    const gather = twiml.gather({
      input: 'speech',
      action: '/client-voice-response',
      method: 'POST',
      language: 'fr-FR',
      timeout: 10,
      speechModel: 'phone_call'
    });
    
    // If no input, hang up
    twiml.hangup();
    
    console.log('Generated TwiML:', twiml.toString());
    
    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error in /client-voice endpoint:', error);
    const errorTwiML = new twilio.twiml.VoiceResponse();
    errorTwiML.say({ voice: 'Polly.Mathieu-Neural', language: 'fr-FR' }, 'Désolé, nous rencontrons un problème technique.');
    errorTwiML.hangup();
    res.type('text/xml');
    res.status(500).send(errorTwiML.toString());
  }
});

// Handle the response from the client voice workflow
app.post('/client-voice-response', async (req, res) => {
  console.log('=== CLIENT VOICE RESPONSE ===');
  console.log('Request body:', req.body);
  
  const twiml = new twilio.twiml.VoiceResponse();
  const callerId = req.body.From;
  const speechResult = req.body.SpeechResult;
  const callerNumber = req.body.From;
  
  try {
    // Detect binary response
    const binaryResponse = detectBinaryResponse(speechResult);
    
    if (binaryResponse === 'oui') {
      // Play a2.mp3
      twiml.play(`${req.protocol}://${req.get('host')}/voice-files/a2.mp3`);
      
      // Store minimal data with service = Cartegrise
      await storeCallData(callerNumber, 'Unknown', 'Unknown', 'Cartegrise', null);
      
      // Hang up after playing
      twiml.hangup();
    } 
    else if (binaryResponse === 'non') {
      // Play a3.mp3
      twiml.play(`${req.protocol}://${req.get('host')}/voice-files/a3.mp3`);
      
      // Parse the speech for complete data
      const parsedData = parseSpeechResult(speechResult);
      
      // Store complete data
      await storeCallData(callerNumber, parsedData.name, parsedData.plate, parsedData.service, null);
      
      // Hang up after playing
      twiml.hangup();
    } 
    else {
      // Not a valid binary response, ask again or hang up
      twiml.say({ voice: 'Polly.Mathieu-Neural', language: 'fr-FR' }, 'Désolé, je n\'ai pas compris votre réponse. Veuillez répondre par oui ou non.');
      twiml.hangup();
    }
  } catch (error) {
    console.error('Error in /client-voice-response:', error);
    twiml.say({ voice: 'Polly.Mathieu-Neural', language: 'fr-FR' }, 'Désolé, nous rencontrons un problème technique.');
    twiml.hangup();
  }
  
  console.log('Generated TwiML:', twiml.toString());
  res.type('text/xml');
  res.send(twiml.toString());
});
```

## Testing Plan

1. Test static file serving:
   - Access http://localhost:3000/voice-files/a1.mp3 to verify files are served

2. Test speech parsing:
   - Call the [detectBinaryResponse](file:///c%3A/Users/pc/Desktop/botcalls/parse-speech.js#L75-L90) function with various inputs

3. Test call flow:
   - Use ngrok to expose the endpoint to Twilio
   - Configure Twilio webhook to point to /client-voice
   - Make test calls

4. Test data storage:
   - Verify data is stored correctly in Google Sheets
   - Check both "oui" and "non" response scenarios

## Deployment Considerations

1. Ensure voice files are properly accessible in production
2. Update Twilio webhook URL to point to the new endpoint
3. Test with various audio qualities and accents
4. Monitor Google Sheets storage for correct data format