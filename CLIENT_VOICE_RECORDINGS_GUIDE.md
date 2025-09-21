# Client Voice Recordings Guide

This system allows you to use recorded voices of your actual clients instead of synthetic voices, providing a more personalized experience.

## How It Works

1. When a call comes in, the system checks if there is a client-specific recording for that phone number
2. If a recording exists, it plays the recording using the `<Play>` verb
3. If no recording exists, it falls back to a synthetic voice using the `<Say>` verb
4. This provides a personalized experience for returning clients while maintaining compatibility for new callers

## Recording Types

The system supports different types of recordings for various parts of the call flow:

- `greeting`: Played when the call is answered
- `prompt`: Played when asking for caller information
- `thanks`: Played after successfully capturing caller information
- `no_speech`: Played when no speech is detected
- `parse_error`: Played when speech cannot be understood
- `record_thanks`: Played after recording a message
- `error`: Played when there's a system error

## Adding Client Recordings

You can add client recordings in several ways:

### 1. Using the API (Recommended)

The system provides a REST API for managing client recordings:

```bash
# Add/update a recording for a client
curl -X POST http://localhost:3000/api/voice/clients/+1234567890/greeting \
  -H "Content-Type: application/json" \
  -d '{"url": "https://yourserver.com/recordings/client1/greeting.mp3"}'

# Get all recordings for a client
curl http://localhost:3000/api/voice/clients/+1234567890

# Remove a recording
curl -X DELETE http://localhost:3000/api/voice/clients/+1234567890/greeting
```

### 2. Using the Helper Scripts

We've provided example scripts to make it easy to add your recordings:

1. Modify `add-your-own-recordings.js` with your client phone numbers and recording URLs
2. Run `node add-your-own-recordings.js`

### 3. Direct File Editing

You can directly edit the `client-recordings.json` file:

```json
{
  "+1234567890": {
    "greeting": "https://yourserver.com/recordings/client1/greeting.mp3",
    "prompt": "https://yourserver.com/recordings/client1/prompt.mp3",
    "thanks": "https://yourserver.com/recordings/client1/thanks.mp3"
  }
}
```

## Preparing Your Recordings

To use your own client recordings:

1. Record your client's voice for each message type
2. Convert recordings to MP3 format
3. Upload recordings to a web-accessible location (your server, cloud storage, etc.)
4. Ensure the URLs are publicly accessible via HTTP/HTTPS
5. Register the recordings using one of the methods above

## Testing the System

You can test that recordings are working correctly:

1. Make sure the server is running (`node server.js`)
2. Run the test script: `node test-client-voice-api.js`
3. Check the `client-recordings.json` file to verify your recordings are registered
4. Use a tool like ngrok to expose your local server and test with Twilio

## Fallback Behavior

If a client recording is not available for a specific message type, the system automatically falls back to a synthetic voice (Polly.Mathieu-Neural in French). This ensures that all callers receive a response, even if you haven't recorded a specific message for their phone number.

## Best Practices

1. Use clear, high-quality recordings in a quiet environment
2. Keep recordings short and to the point
3. Use consistent messaging across synthetic and recorded voices
4. Regularly check that your recording URLs are still accessible
5. Consider having a few generic recordings for common scenarios