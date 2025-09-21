// Client Voice Manager - API for managing client voice recordings
const express = require('express');
const fs = require('fs');
const path = require('path');

// In a real implementation, you would use a database
// For this example, we'll use a simple JSON file
const recordingsFile = path.join(__dirname, 'client-recordings.json');

// Initialize recordings file if it doesn't exist
if (!fs.existsSync(recordingsFile)) {
  fs.writeFileSync(recordingsFile, JSON.stringify({}));
}

// Load recordings data
function loadRecordings() {
  try {
    const data = fs.readFileSync(recordingsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading recordings:', error);
    return {};
  }
}

// Save recordings data
function saveRecordings(data) {
  try {
    fs.writeFileSync(recordingsFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving recordings:', error);
    return false;
  }
}

// Check if a client has a specific recording
function hasClientRecording(callerId, recordingType) {
  const recordings = loadRecordings();
  return recordings[callerId] && recordings[callerId][recordingType];
}

// Get the URL for a client's recording
function getClientRecordingUrl(callerId, recordingType) {
  const recordings = loadRecordings();
  if (recordings[callerId] && recordings[callerId][recordingType]) {
    return recordings[callerId][recordingType];
  }
  return null;
}

// Add or update a client recording
function setClientRecording(callerId, recordingType, url) {
  const recordings = loadRecordings();
  
  if (!recordings[callerId]) {
    recordings[callerId] = {};
  }
  
  recordings[callerId][recordingType] = url;
  return saveRecordings(recordings);
}

// Remove a client recording
function removeClientRecording(callerId, recordingType) {
  const recordings = loadRecordings();
  
  if (recordings[callerId] && recordings[callerId][recordingType]) {
    delete recordings[callerId][recordingType];
    
    // If no recordings left for this client, remove the client entry
    if (Object.keys(recordings[callerId]).length === 0) {
      delete recordings[callerId];
    }
    
    return saveRecordings(recordings);
  }
  
  return false;
}

// Get all recordings for a client
function getClientRecordings(callerId) {
  const recordings = loadRecordings();
  return recordings[callerId] || {};
}

// Get all clients with recordings
function getAllClientsWithRecordings() {
  const recordings = loadRecordings();
  return Object.keys(recordings);
}

// Express router for managing client recordings
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Get all clients with recordings
router.get('/clients', (req, res) => {
  try {
    const clients = getAllClientsWithRecordings();
    res.json({ clients });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve clients' });
  }
});

// Get all recordings for a specific client
router.get('/clients/:callerId', (req, res) => {
  try {
    const { callerId } = req.params;
    const recordings = getClientRecordings(callerId);
    res.json({ callerId, recordings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recordings' });
  }
});

// Add or update a recording for a client
router.post('/clients/:callerId/:recordingType', (req, res) => {
  try {
    const { callerId, recordingType } = req.params;
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const success = setClientRecording(callerId, recordingType, url);
    
    if (success) {
      res.json({ 
        message: `Recording ${recordingType} for client ${callerId} updated successfully`,
        callerId,
        recordingType,
        url
      });
    } else {
      res.status(500).json({ error: 'Failed to update recording' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update recording' });
  }
});

// Remove a recording for a client
router.delete('/clients/:callerId/:recordingType', (req, res) => {
  try {
    const { callerId, recordingType } = req.params;
    const success = removeClientRecording(callerId, recordingType);
    
    if (success) {
      res.json({ 
        message: `Recording ${recordingType} for client ${callerId} removed successfully`
      });
    } else {
      res.status(404).json({ error: 'Recording not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove recording' });
  }
});

// Export functions for use in the main server
module.exports = {
  hasClientRecording,
  getClientRecordingUrl,
  setClientRecording,
  removeClientRecording,
  getClientRecordings,
  getAllClientsWithRecordings,
  router
};