# Client Voice Implementation

## Overview
This document details the implementation of a client voice-based call system that:
1. Plays a client's recorded greeting (a1.mp3)
2. Based on user response ('oui' or 'non'), plays corresponding response (a2.mp3 or a3.mp3)
3. Stores client data in Google Sheets with call recording URL

## Implementation Steps

### Step 1: Update server.js to serve static voice files and add new endpoints

#### 1.1 Add path module import and static file serving

At the top of server.js, add the path module import:
```javascript
const path = require('path');
```

After the existing middleware, add static file serving:
```javascript
// Serve static voice files
app.use('/voice-files', express.static(path.join(__dirname, 'voice')));
```

#### 1.2 Import the binary response detection function

Update the parse-speech import:
```javascript
// Function to parse speech result and detect binary responses
const { parseSpeechResult, detectBinaryResponse } = require('./parse-speech');
```

#### 1.3 Add new endpoints for client voice workflow

Before the health check endpoints, add:

```javascript
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
  const recordingUrl = req.body.RecordingUrl;
  
  try {
    // Detect binary response
    const binaryResponse = detectBinaryResponse(speechResult);
    
    if (binaryResponse === 'oui') {
      // Play a2.mp3
      twiml.play(`${req.protocol}://${req.get('host')}/voice-files/a2.mp3`);
      
      // Store minimal data with service = Cartegrise
      await storeCallData(callerNumber, 'Unknown', 'Unknown', 'Cartegrise', recordingUrl);
      
      // Hang up after playing
      twiml.hangup();
    } 
    else if (binaryResponse === 'non') {
      // Play a3.mp3
      twiml.play(`${req.protocol}://${req.get('host')}/voice-files/a3.mp3`);
      
      // Parse the speech for complete data
      const parsedData = parseSpeechResult(speechResult);
      
      // Store complete data
      await storeCallData(callerNumber, parsedData.name, parsedData.plate, parsedData.service, recordingUrl);
      
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

### Step 2: Update parse-speech.js to add binary response detection

At the end of parse-speech.js, before the module.exports line, add:

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

### Step 3: Update the module.exports line in parse-speech.js

Change:
```javascript
module.exports = { parseSpeechResult };
```

To:
```javascript
module.exports = { parseSpeechResult, detectBinaryResponse };
```

## Testing Plan

1. **Test static file serving**:
   - Start the server
   - Access http://localhost:3000/voice-files/a1.mp3 to verify files are served

2. **Test speech parsing**:
   - Create a simple test script to call [detectBinaryResponse](file:///c%3A/Users/pc/Desktop/botcalls/parse-speech.js#L75-L90) with various inputs:
     - "oui"
     - "non" 
     - "Oui"
     - "NON"
     - "Je dis oui"
     - "Je dis non"
     - "Je ne sais pas"

3. **Test call flow**:
   - Use ngrok to expose the endpoint to Twilio
   - Configure Twilio webhook to point to /client-voice
   - Make test calls

4. **Test data storage**:
   - Verify data is stored correctly in Google Sheets
   - Check both "oui" and "non" response scenarios

## Deployment Considerations

1. Ensure voice files are properly accessible in production
2. Update Twilio webhook URL to point to the new endpoint
3. Test with various audio qualities and accents
4. Monitor Google Sheets storage for correct data format

## Expected Data Storage Format

For "oui" responses:
| Timestamp | Phone Number | Name | Plate | Service | Recording URL |
|-----------|--------------|------|-------|---------|---------------|
| ... | +33XXXXXXXXX | Unknown | Unknown | Cartegrise | [URL] |

For "non" responses:
| Timestamp | Phone Number | Name | Plate | Service | Recording URL |
|-----------|--------------|------|-------|---------|---------------|
| ... | +33XXXXXXXXX | [Parsed Name] | [Parsed Plate] | [Parsed Service] | [URL] |