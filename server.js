const express = require('express');
const twilio = require('twilio');
const dotenv = require('dotenv');
const { google } = require('googleapis');
const path = require('path');
const { appendToSheet } = require('./easiest-google-sheets');

// Function to parse speech result and detect binary responses
const { parseSpeechResult, detectBinaryResponse } = require('./parse-speech');

// Client voice manager
const { hasClientRecording, getClientRecordingUrl } = require('./client-voice-manager');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Enable logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static voice files
app.use('/voice-files', express.static(path.join(__dirname, 'voice')));

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
let jwtClient;

// Initialize Google Sheets client using environment variables only
async function initGoogleSheets() {
  try {
    console.log('Initializing Google Sheets client with environment variables only...');
    
    // Check if we have the required environment variables
    const requiredVars = [
      'GOOGLE_CLIENT_EMAIL',
      'GOOGLE_PRIVATE_KEY',
      'SPREADSHEET_ID'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.log('Missing required environment variables:', missingVars);
      jwtClient = null;
      return;
    }
    
    // Get values from environment variables
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.SPREADSHEET_ID;
    
    console.log('Client email:', clientEmail);
    console.log('Spreadsheet ID:', spreadsheetId);
    
    // Process private key - handle different newline formats
    console.log('Processing private key...');
    
    // Remove surrounding quotes if present
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      console.log('Removing surrounding quotes...');
      privateKey = privateKey.slice(1, -1);
    }
    
    // Handle different newline formats - convert escaped newlines to actual newlines
    if (privateKey.includes('\\n')) {
      console.log('Converting escaped newlines to actual newlines...');
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    
    console.log('Processed key length:', privateKey.length);
    
    // Verify key format
    if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
      console.warn('Warning: Private key may not be properly formatted');
      console.log('Private key start:', privateKey.substring(0, 50));
    }
    
    // Create JWT client
    console.log('Creating JWT client with environment variables...');
    jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: SCOPES
    });
    
    // Test authentication
    console.log('Testing authentication...');
    const authResponse = await jwtClient.authorize();
    console.log('✓ Google Sheets authentication successful with environment variables');
    console.log('Token expires:', new Date(authResponse.expiry_date).toISOString());
    
  } catch (error) {
    console.error('Error in initGoogleSheets:', error.message);
    console.error('Full error:', error);
    jwtClient = null;
  }
}

// Function to append data to Google Sheet with better error handling
async function appendToSheet(data) {
  try {
    // Check if we have a valid jwtClient
    if (!jwtClient) {
      console.log('Google Sheets client not initialized, skipping data storage');
      return { status: 'skipped', reason: 'Google Sheets client not initialized' };
    }
    
    const sheets = google.sheets({ version: 'v4', auth: jwtClient });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    
    console.log('Appending data to Google Sheet:', data);
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [data]
      }
    });
    
    console.log('Data appended to Google Sheet successfully');
    return { status: 'success', response };
  } catch (error) {
    console.error('Error appending to Google Sheet:', error.message);
    console.error('Full error:', error);
    
    // Return error information instead of throwing
    return { 
      status: 'error', 
      error: error.message,
      data: data 
    };
  }
}

// Function to store call data with simplified Google Sheets integration
async function storeCallData(callerNumber, name, plate, service, recordingUrl) {
  try {
    console.log('=== STORING CALL DATA ===');
    console.log('Caller number:', callerNumber);
    console.log('Name:', name);
    console.log('Plate:', plate);
    console.log('Service:', service);
    console.log('Recording URL:', recordingUrl);
    
    // Validate and sanitize inputs
    const sanitizedCallerNumber = callerNumber && callerNumber.trim() !== '' ? callerNumber : 'Unknown';
    const sanitizedName = name && name.trim() !== '' ? name : 'Unknown';
    const sanitizedPlate = plate && plate.trim() !== '' ? plate : 'Unknown';
    const sanitizedService = service && service.trim() !== '' ? service : 'Unknown';
    const sanitizedRecordingUrl = recordingUrl && recordingUrl.trim() !== '' ? recordingUrl : '';
    
    const timestamp = new Date().toISOString();
    const data = [timestamp, sanitizedCallerNumber, sanitizedName, sanitizedPlate, sanitizedService, sanitizedRecordingUrl];
    
    // Use simplified Google Sheets integration
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (spreadsheetId) {
      try {
        await appendToSheet(spreadsheetId, data);
        console.log('Call data stored successfully in Google Sheets');
      } catch (error) {
        console.error('Error storing data in Google Sheets:', error.message);
      }
    } else {
      console.log('No SPREADSHEET_ID configured, skipping data storage');
    }
    
    return { status: 'success' };
  } catch (error) {
    console.error('Error in storeCallData:', error.message);
    console.error('Full error:', error);
    return { 
      status: 'error', 
      error: error.message,
      data: [new Date().toISOString(), callerNumber, name, plate, service, recordingUrl]
    };
  }
}

// Webhook for handling incoming calls

// New endpoint to demo all voices - using client's voice recordings only
app.get('/demo-voices', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  const hostUrl = process.env.HOST_URL || `${req.protocol}://${req.get('host')}`;
  
  // Play all client voice recordings in sequence
  twiml.play(`${hostUrl}/voice-files/a1.mp3`);
  twiml.pause({ length: 1 });
  
  twiml.play(`${hostUrl}/voice-files/a2.mp3`);
  twiml.pause({ length: 1 });
  
  twiml.play(`${hostUrl}/voice-files/a3.mp3`);
  twiml.pause({ length: 1 });
  
  // Play a1.mp3 again to close
  twiml.play(`${hostUrl}/voice-files/a1.mp3`);
  
  res.type('text/xml');
  res.send(twiml.toString());
});

// Short voice demo endpoint
app.get('/demo-voices/short', (req, res) => {
  const { generateShortVoiceDemo } = require('./voice-demo-complete');
  const twiml = generateShortVoiceDemo();
  res.type('text/xml');
  res.send(twiml.toString());
});

// Complete voice demo endpoint
app.get('/demo-voices/complete', (req, res) => {
  const { generateCompleteVoiceDemo } = require('./voice-demo-complete');
  const twiml = generateCompleteVoiceDemo();
  res.type('text/xml');
  res.send(twiml.toString());
});

app.post('/voice', (req, res) => {
  console.log('=== CLIENT VOICE WORKFLOW (MAIN ENDPOINT) ===');
  console.log('Request body:', req.body);
  console.log('Caller ID:', req.body.From);
  
  const twiml = new twilio.twiml.VoiceResponse();
  const callerId = req.body.From;
  
  try {
    // KEEP THE 10-SECOND PAUSE - BUT THIS IS NOT SILENCE, IT'S A DELAY BEFORE PLAYING AUDIO
    // This makes the system wait 10 seconds before playing the greeting
    twiml.pause({ length: 10 });
    
    // Play greeting using client's voice recording (a1.mp3) - can be external URL
    const voiceFiles = {
      a1: process.env.A1_VOICE_URL || `${process.env.HOST_URL || `${req.protocol}://${req.get('host')}`}/voice-files/a1.mp3`,
      a2: process.env.A2_VOICE_URL || `${process.env.HOST_URL || `${req.protocol}://${req.get('host')}`}/voice-files/a2.mp3`,
      a3: process.env.A3_VOICE_URL || `${process.env.HOST_URL || `${req.protocol}://${req.get('host')}`}/voice-files/a3.mp3`
    };
    
    console.log('Playing client greeting (a1.mp3):', voiceFiles.a1);
    twiml.play(voiceFiles.a1);
    
    // Gather caller response
    const gather = twiml.gather({
      input: 'speech',
      action: '/voice-response',
      method: 'POST',
      language: 'fr-FR',
      timeout: 3,
      speechModel: 'phone_call'
    });
    
    // If no input, hang up
    twiml.hangup();
    
    console.log('Generated TwiML:', twiml.toString());
    
    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error in /voice endpoint:', error);
    // Create a simple error response
    const errorTwiML = new twilio.twiml.VoiceResponse();
    
    // Play error message using client's voice recording
    const voiceFiles = {
      a1: process.env.A1_VOICE_URL || `${process.env.HOST_URL || `${req.protocol}://${req.get('host')}`}/voice-files/a1.mp3`
    };
    errorTwiML.play(voiceFiles.a1);
    
    errorTwiML.hangup();
    res.type('text/xml');
    res.status(500).send(errorTwiML.toString());
  }
});

// New endpoint to handle the client's voice response
app.post('/voice-response', async (req, res) => {
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
    
    console.log('Binary response detected:', binaryResponse);
    
    // Use external URLs if configured, otherwise use local files
    const voiceFiles = {
      a1: process.env.A1_VOICE_URL || `${process.env.HOST_URL || `${req.protocol}://${req.get('host')}`}/voice-files/a1.mp3`,
      a2: process.env.A2_VOICE_URL || `${process.env.HOST_URL || `${req.protocol}://${req.get('host')}`}/voice-files/a2.mp3`,
      a3: process.env.A3_VOICE_URL || `${process.env.HOST_URL || `${req.protocol}://${req.get('host')}`}/voice-files/a3.mp3`
    };
    
    if (binaryResponse === 'oui') {
      // Play a2.mp3
      console.log('Playing positive response (a2.mp3):', voiceFiles.a2);
      twiml.play(voiceFiles.a2);
      
      // Store minimal data with service = Cartegrise (fire and forget)
      storeCallData(callerNumber, 'Unknown', 'Unknown', 'Cartegrise', recordingUrl)
        .catch(error => console.error('Error storing call data:', error));
      
      // Hang up after playing
      twiml.hangup();
    } 
    else if (binaryResponse === 'non') {
      // Play a3.mp3
      console.log('Playing negative response (a3.mp3):', voiceFiles.a3);
      twiml.play(voiceFiles.a3);
      
      // Parse the speech for complete data
      const parsedData = parseSpeechResult(speechResult);
      console.log('Parsed data:', parsedData);
      
      // Store complete data (fire and forget)
      storeCallData(callerNumber, parsedData.name, parsedData.plate, parsedData.service, recordingUrl)
        .catch(error => console.error('Error storing call data:', error));
      
      // Hang up after playing
      twiml.hangup();
    } 
    else {
      // Not a valid binary response, play a1.mp3 again and ask for response
      console.log('No valid binary response detected, asking user to respond with "oui" or "non"');
      twiml.play(voiceFiles.a1);
      
      // Gather response again
      const gather = twiml.gather({
        input: 'speech',
        action: '/voice-response',
        method: 'POST',
        language: 'fr-FR',
        timeout: 3,
        speechModel: 'phone_call'
      });
      
      // If no input, hang up
      twiml.hangup();
    }
  } catch (error) {
    console.error('Error in /voice-response:', error);
    // Play error message using client's voice recording
    const voiceFiles = {
      a1: process.env.A1_VOICE_URL || `${process.env.HOST_URL || `${req.protocol}://${req.get('host')}`}/voice-files/a1.mp3`
    };
    twiml.play(voiceFiles.a1);
    twiml.hangup();
  }
  
  console.log('Generated TwiML:', twiml.toString());
  res.type('text/xml');
  res.send(twiml.toString());
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Call handling system is running!');
});

// Render health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Handle common mistake of accessing /webhook instead of /voice
app.get('/webhook', (req, res) => {
  res.status(404).send('Incorrect endpoint. Please use /voice for Twilio webhooks. See documentation for setup instructions.');
});

app.post('/webhook', (req, res) => {
  res.status(404).send('Incorrect endpoint. Please use /voice for Twilio webhooks. See documentation for setup instructions.');
});

// TEST ENDPOINT - Play audio immediately without pause
app.post('/test-immediate', (req, res) => {
  console.log('=== IMMEDIATE AUDIO TEST ===');
  console.log('Request body:', req.body);
  
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Play greeting immediately
  const hostUrl = process.env.HOST_URL || `${req.protocol}://${req.get('host')}`;
  twiml.play(`${hostUrl}/voice-files/a1.mp3`);
  
  console.log('Generated TwiML:', twiml.toString());
  
  res.type('text/xml');
  res.send(twiml.toString());
});

// Initialize Google Sheets on startup
initGoogleSheets();

// Add the client voice manager router
const { router: voiceManagerRouter } = require('./client-voice-manager');
app.use('/api/voice', voiceManagerRouter);

// Export functions for testing
module.exports = app;

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check endpoint: http://localhost:${PORT}/`);
  console.log(`Twilio webhook endpoint: http://localhost:${PORT}/voice`);
});