# Available Synthetic Voices Summary

This document provides a complete overview of all synthetic voices available in your Twilio system and how to hear them.

## Total Available Voices: 59

## Voice Categories

### Amazon Polly Neural Voices (High Quality)
1. **French (France)**
   - `Polly.Mathieu-Neural` - Male voice (default in system)
   - `Polly.Celine-Neural` - Female voice
   - `Polly.Lea-Neural` - Female voice

2. **English Voices**
   - **UK English**
     - `Polly.Amy-Neural` - Female voice
     - `Polly.Brian-Neural` - Male voice
     - `Polly.Emma-Neural` - Female voice
   - **US English**
     - `Polly.Joey-Neural` - Male voice
     - `Polly.Justin-Neural` - Male voice
     - `Polly.Kendra-Neural` - Female voice
     - `Polly.Kimberly-Neural` - Female voice
     - `Polly.Matthew-Neural` - Male voice
     - `Polly.Salli-Neural` - Female voice
   - **Australian English**
     - `Polly.Nicole-Neural` - Female voice
     - `Polly.Olivia-Neural` - Female voice
     - `Polly.Russell-Neural` - Male voice
   - **Indian English**
     - `Polly.Aditi-Neural` - Female voice

3. **Other Languages**
   - **German**: `Polly.Hans-Neural` (Male), `Polly.Marlene-Neural` (Female), `Polly.Vicki-Neural` (Female)
   - **Spanish**: 
     - Spain: `Polly.Conchita-Neural` (Female), `Polly.Enrique-Neural` (Male), `Polly.Lucia-Neural` (Female)
     - US: `Polly.Penelope-Neural` (Female), `Polly.Miguel-Neural` (Male), `Polly.Lupe-Neural` (Female)
   - **Italian**: `Polly.Bianca-Neural` (Female), `Polly.Giorgio-Neural` (Male), `Polly.Carla-Neural` (Female)
   - **Japanese**: `Polly.Mizuki-Neural` (Female), `Polly.Takumi-Neural` (Male)
   - **Korean**: `Polly.Seoyeon-Neural` (Female)
   - **Portuguese**:
     - Portugal: `Polly.Ines-Neural` (Female), `Polly.Cristiano-Neural` (Male)
     - Brazil: `Polly.Camila-Neural` (Female), `Polly.Ricardo-Neural` (Male), `Polly.Vitoria-Neural` (Female)
   - **Swedish**: `Polly.Astrid-Neural` (Female), `Polly.Hedvig-Neural` (Female)

### Google Standard Voices
1. **English (US)**: `Google.en-US-Standard-C` through `Google.en-US-Standard-J` (8 voices)
2. **French (France)**: `Google.fr-FR-Standard-A` through `Google.fr-FR-Standard-D` (4 voices)
3. **Other Languages**:
   - **German**: `Google.de-DE-Standard-A`, `Google.de-DE-Standard-B`
   - **Italian**: `Google.it-IT-Standard-A`
   - **Japanese**: `Google.ja-JP-Standard-A`
   - **Korean**: `Google.ko-KR-Standard-A`
   - **Portuguese (Brazil)**: `Google.pt-BR-Standard-A`
   - **Spanish (Spain)**: `Google.es-ES-Standard-A`

## How to Hear These Voices

### 1. Using Built-in Demo Endpoints

Start your server and use ngrok to expose it, then set your Twilio webhook to one of these endpoints:

- **Short Demo** (`/demo-voices/short`): Features 5 popular voices (Mathieu, Amy, Matthew, Google French, Google US)
- **Standard Demo** (`/demo-voices`): Features the same 5 voices as the short demo
- **Complete Demo** (`/demo-voices/complete`): Features 25+ voices across multiple languages

### 2. Direct Testing

Run the test script to see the TwiML output:
```bash
node test-voice-demos.js
```

### 3. Custom Implementation

To use any voice in your application, use the following syntax:
```javascript
twiml.say({ voice: 'VOICE_NAME', language: 'LANGUAGE_CODE' }, 'Your message');
```

Example:
```javascript
twiml.say({ voice: 'Polly.Amy-Neural', language: 'en-GB' }, 'Hello, this is Amy speaking');
```

## Recommended Voices for Different Use Cases

### For French-Speaking Customers
- Primary: `Polly.Mathieu-Neural` (currently used in your system)
- Alternatives: `Polly.Celine-Neural`, `Polly.Lea-Neural`

### For English-Speaking Customers
- UK English: `Polly.Amy-Neural` (Female) or `Polly.Brian-Neural` (Male)
- US English: `Polly.Matthew-Neural` (Male) or `Polly.Salli-Neural` (Female)

### For Multilingual Applications
- Use language-specific voices to match your caller's preferred language
- Maintain consistency by using the same voice for the same language throughout the call

## Voice Quality Comparison

1. **Amazon Polly Neural Voices**: Highest quality, most natural sounding
2. **Google Standard Voices**: Good quality, slightly less natural than Polly Neural
3. **Traditional voices**: Not implemented in this system but available in Twilio

## Testing Process

1. Start your server: `node server.js`
2. Expose it with ngrok: `ngrok http 3000`
3. Update your Twilio number's voice webhook URL
4. Call your Twilio number to hear the voices
5. Switch between demo endpoints to hear different sets of voices

This system gives you access to a wide variety of high-quality synthetic voices that you can use to create a professional and engaging caller experience.