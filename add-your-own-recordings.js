// Example script showing how to add your own client recordings
const axios = require('axios');

async function addYourOwnRecordings() {
  const baseUrl = 'http://localhost:3000/api/voice';
  
  try {
    console.log('=== Adding Your Own Client Recordings ===\n');
    
    // Replace these with your actual client phone numbers and recording URLs
    const yourClients = [
      {
        phone: '+1234567890',  // Replace with actual client phone number
        recordings: {
          greeting: 'https://yourserver.com/recordings/client1/greeting.mp3',
          prompt: 'https://yourserver.com/recordings/client1/prompt.mp3',
          thanks: 'https://yourserver.com/recordings/client1/thanks.mp3'
        }
      },
      {
        phone: '+0987654321',  // Replace with another client phone number
        recordings: {
          greeting: 'https://yourserver.com/recordings/client2/greeting.mp3',
          thanks: 'https://yourserver.com/recordings/client2/thanks.mp3'
        }
      }
    ];
    
    // Add recordings for each client
    for (const client of yourClients) {
      console.log(`Adding recordings for client: ${client.phone}`);
      
      for (const [recordingType, url] of Object.entries(client.recordings)) {
        try {
          const response = await axios.post(`${baseUrl}/clients/${client.phone}/${recordingType}`, {
            url: url
          });
          console.log(`  ✓ Added ${recordingType}: ${response.data.message}`);
        } catch (error) {
          console.log(`  ✗ Failed to add ${recordingType}: ${error.message}`);
        }
      }
      console.log();  // Empty line for readability
    }
    
    // List all clients with recordings
    console.log('=== Current Clients with Recordings ===');
    const clientsResponse = await axios.get(`${baseUrl}/clients`);
    console.log('Clients:', clientsResponse.data.clients);
    
    console.log('\n=== How to Prepare Your Recordings ===');
    console.log('1. Record your client\'s voice for each message type (greeting, prompt, thanks, etc.)');
    console.log('2. Upload recordings to a web-accessible location (e.g., your server, cloud storage)');
    console.log('3. Ensure recordings are in MP3 format and accessible via HTTP/HTTPS URLs');
    console.log('4. Use this script or the API directly to register the recordings');
    console.log('5. The system will automatically use your recordings for those clients');
    
    console.log('\n=== Recording Types ===');
    console.log('- greeting: Played when the call is answered');
    console.log('- prompt: Played when asking for caller information');
    console.log('- thanks: Played after successfully capturing caller information');
    console.log('- no_speech: Played when no speech is detected');
    console.log('- parse_error: Played when speech cannot be understood');
    console.log('- record_thanks: Played after recording a message');
    console.log('- error: Played when there\'s a system error');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the function
addYourOwnRecordings();