# Voice File Troubleshooting Guide

## Common Issues and Solutions

### 1. Voice Files Not Playing

#### Issue: Voice files are not being played when the call starts

#### Diagnosis:
1. Check if the voice files are accessible via direct URL
2. Verify the TwiML response contains the correct URLs
3. Ensure the server is publicly accessible

#### Solutions:

1. **Test Voice File Accessibility**
   - Run the test server: `node test_voice_files.js`
   - Access the files directly in your browser:
     - http://localhost:3001/voice-files/a1.mp3
     - http://localhost:3001/voice-files/a2.mp3
     - http://localhost:3001/voice-files/a3.mp3

2. **Check TwiML Response**
   - Add logging to see what TwiML is being generated
   - Ensure URLs in TwiML are absolute (not relative)

3. **Verify Public Accessibility**
   - If testing locally, use ngrok to make your server publicly accessible:
     ```
     ngrok http 3000
     ```
   - Update your Twilio webhook URL to use the ngrok URL

### 2. Incorrect URL Construction

#### Issue: URLs in TwiML are not correctly formatted

#### Solution:
We've updated the server.js to use a more reliable URL construction method:

```javascript
// Use absolute URL for better compatibility with Twilio
const hostUrl = process.env.HOST_URL || `${req.protocol}://${req.get('host')}`;
twiml.play(`${hostUrl}/voice-files/a1.mp3`);
```

You can also set the HOST_URL environment variable in your .env file:
```
HOST_URL=https://your-public-url.ngrok.io
```

### 3. Network/Firewall Issues

#### Issue: Twilio cannot access your voice files

#### Solutions:
1. Ensure your server is publicly accessible
2. Check firewall settings
3. Verify no IP restrictions are blocking Twilio's requests

### 4. File Format Issues

#### Issue: Voice files are not in the correct format

#### Solutions:
1. Ensure files are valid MP3 format
2. Check file size (should not be too large)
3. Verify files play correctly when accessed directly

## Testing Steps

### Step 1: Verify Voice Files
1. Check that a1.mp3, a2.mp3, and a3.mp3 exist in the `voice` directory
2. Test that they play correctly on your computer
3. Run the test server and verify browser access

### Step 2: Check Server Logs
1. Start your server with logging enabled
2. Make a test call
3. Check the console output for any errors

### Step 3: Examine TwiML Response
1. Add additional logging to see the exact TwiML being generated
2. Verify URLs in the TwiML are correct and accessible

### Step 4: Use Ngrok for Testing
1. Install ngrok if you haven't already
2. Run: `ngrok http 3000`
3. Update Twilio webhook to use the ngrok URL
4. Test with a call

## Additional Debugging

### Add Debug Logging
Add this to your server.js to see exactly what URLs are being generated:

```javascript
// In the /client-voice endpoint, add:
console.log('Host URL:', hostUrl);
console.log('Playing file:', `${hostUrl}/voice-files/a1.mp3`);
```

### Check Twilio Debugger
1. Log into your Twilio console
2. Go to the Debugger section
3. Check for any errors related to your calls

## Environment Variables

Make sure your .env file includes:

```
HOST_URL=http://your-public-url.ngrok.io
```

If you're testing locally with ngrok, replace `your-public-url.ngrok.io` with your actual ngrok URL.

## Need More Help?

If you're still experiencing issues:

1. Check the server console for error messages
2. Verify all file paths are correct
3. Ensure your MP3 files are valid
4. Confirm your server is publicly accessible
5. Check Twilio's debugger for specific error messages