// Easiest Google Sheets integration using Service Account
const { google } = require('googleapis');
const fs = require('fs');

// Simple function to append data to Google Sheets
async function appendToSheet(spreadsheetId, data, credentialsPath = './service-account-key.json') {
  try {
    // Load service account credentials
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    // Create sheets client
    const sheets = google.sheets({ version: 'v4', auth });

    // Append data
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [data]
      }
    });

    console.log('Data added successfully!');
    return response.data;
  } catch (error) {
    console.error('Error adding data to Google Sheets:', error.message);
    throw error;
  }
}

// Example usage:
// appendToSheet('YOUR_SPREADSHEET_ID', ['2025-09-21', '+1234567890', 'John Doe', 'ABC123', 'Cartegrise', 'https://recording.url']);

module.exports = { appendToSheet };