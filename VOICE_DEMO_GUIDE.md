# Voice Demo Guide

This guide explains how to hear the different synthetic voices available in your Twilio system.

## Available Voices

The system supports two main types of synthetic voices:

1. **Amazon Polly Voices** - High quality neural voices
2. **Google Voices** - Standard text-to-speech voices

In total, there are 59 different voices available across multiple languages.

## How to Hear the Voices

### Method 1: Using the Built-in Demo Endpoints

The system includes three demo endpoints that showcase different sets of voices:

1. **Short Demo** (`/demo-voices/short`) - Features 4 popular voices
2. **Standard Demo** (`/demo-voices`) - Features 5 voices (default)
3. **Complete Demo** (`/demo-voices/complete`) - Features 25+ voices

To hear these demos:

1. Start your server:
   ```bash
   node server.js
   ```

2. Use ngrok to expose your local server:
   ```bash
   ngrok http 3000
   ```

3. Update your Twilio phone number webhook to point to one of these URLs:
   - Short demo: `https://your-ngrok-url/demo-voices/short`
   - Standard demo: `https://your-ngrok-url/demo-voices`
   - Complete demo: `https://your-ngrok-url/demo-voices/complete`

4. Call your Twilio number to hear the voices

### Method 2: Direct TwiML Testing

You can also test the voice generation functions directly:

```bash
node voice-demo-complete.js
```

This will output the TwiML that would be generated for the voice demos.

### Method 3: Modify Your Main Voice Endpoint

To hear voices in your main call flow, you can temporarily modify the [server.js](file:///C:/Users/pc/Desktop/botcalls/server.js) file to use different voices.

## Voice Categories

### French Voices
- `Polly.Mathieu-Neural` - Male voice
- `Polly.Celine-Neural` - Female voice (alternative)
- `Polly.Lea-Neural` - Female voice (alternative)
- `Google.fr-FR-Standard-A` to `Google.fr-FR-Standard-D` - Multiple standard options

### English Voices
- **UK English**: `Polly.Amy-Neural`, `Polly.Brian-Neural`, `Polly.Emma-Neural`
- **US English**: `Polly.Joey-Neural`, `Polly.Justin-Neural`, `Polly.Kendra-Neural`, `Polly.Kimberly-Neural`, `Polly.Matthew-Neural`, `Polly.Salli-Neural`
- **Australian English**: `Polly.Nicole-Neural`, `Polly.Olivia-Neural`, `Polly.Russell-Neural`
- **Indian English**: `Polly.Aditi-Neural`

### Other Languages
- **German**: `Polly.Hans-Neural`, `Polly.Marlene-Neural`, `Polly.Vicki-Neural`
- **Spanish**: `Polly.Conchita-Neural`, `Polly.Enrique-Neural`, `Polly.Lucia-Neural`
- **Italian**: `Polly.Bianca-Neural`, `Polly.Giorgio-Neural`, `Polly.Carla-Neural`
- **Japanese**: `Polly.Mizuki-Neural`, `Polly.Takumi-Neural`
- **Portuguese**: `Polly.Camila-Neural`, `Polly.Ricardo-Neural`, `Polly.Vitoria-Neural`
- **And more...**

## Best Practices for Voice Selection

1. **Consistency**: Choose one voice and stick with it for a consistent experience
2. **Language Matching**: Use voices that match your target audience's language
3. **Clarity**: Test voices to ensure they're clear and understandable
4. **Tone**: Consider the tone of the voice and whether it matches your brand
5. **Performance**: Neural voices generally sound better but may have slightly higher latency

## Customizing Voices

To use a specific voice in your application, modify the `say` commands in your TwiML:

```javascript
twiml.say({ voice: 'Polly.Amy-Neural', language: 'en-GB' }, 'Your message here');
```

Replace `'Polly.Amy-Neural'` with your preferred voice name from the list.