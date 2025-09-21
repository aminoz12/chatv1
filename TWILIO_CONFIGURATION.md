# Twilio Configuration Guide

## Setting Up Your Client Voice Workflow

To use the new client voice workflow you've implemented, you'll need to configure Twilio to point to your new endpoints.

## Prerequisites

1. Your server must be publicly accessible (use ngrok for local development)
2. Twilio account with a phone number

## Configuration Steps

### 1. Make Your Server Publicly Accessible

If you're running locally, use ngrok:
```bash
ngrok http 3000
```

This will give you a public URL like `https://abcd1234.ngrok.io`

### 2. Configure Your Twilio Phone Number

1. Log into your Twilio Console
2. Go to "Phone Numbers" > "Manage" > "Active Numbers"
3. Click on your phone number
4. In the "Voice & Fax" section:
   - Set "Configure With" to "Webhooks, TwiML Bins, Functions, Studio, or Proxy"
   - Set the webhook URL to: `[your-public-url]/client-voice`
   - Set HTTP Method to "POST"
5. Click "Save"

### 3. Verify Configuration

After configuration, when someone calls your Twilio number:
1. They will hear your a1.mp3 greeting
2. They can respond with "oui" or "non"
3. Based on their response, either a2.mp3 or a3.mp3 will play
4. Appropriate data will be stored in your Google Sheet

## Testing Your Setup

### Test "oui" Response
1. Call your Twilio number
2. When prompted, say "oui"
3. You should hear a2.mp3
4. Check your Google Sheet for a new entry with:
   - Phone number
   - "Unknown" for name and plate
   - "Cartegrise" for service

### Test "non" Response
1. Call your Twilio number
2. When prompted, say "non" followed by your information
   For example: "non, je m'appelle Pierre Dupont, plaque AB-123-CD, je viens pour une réparation"
3. You should hear a3.mp3
4. Check your Google Sheet for a new entry with:
   - Phone number
   - Parsed name, plate, and service

## Troubleshooting

### No Audio Played
- Verify your MP3 files are in the voice directory
- Check that the files are accessible via `[your-url]/voice-files/a1.mp3`
- Ensure files are valid MP3 format

### Speech Not Recognized
- Speak clearly and at a moderate pace
- Try simple responses like just "oui" or "non"
- Background noise can affect recognition

### Data Not Stored
- Check Google Sheets authentication
- Verify your Google service account has write access to the spreadsheet
- Check server logs for errors

## Need Help?

If you encounter any issues:
1. Check the server console for error messages
2. Verify all environment variables are set correctly
3. Ensure your Google service account is properly configured