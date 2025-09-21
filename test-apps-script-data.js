// Test script to send real data to Google Apps Script
require('dotenv').config();

async function testAppsScriptData() {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;
  
  if (!appsScriptUrl || appsScriptUrl.startsWith('#')) {
    console.log('⚠️  APPS_SCRIPT_URL not configured in .env file');
    console.log('Please uncomment and set the APPS_SCRIPT_URL in your .env file to test actual data sending.');
    console.log('\nExample configuration:');
    console.log('APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec');
    return;
  }
  
  try {
    console.log('=== Testing Google Apps Script Data Sending ===\n');
    
    // Test data that mimics what would be sent from your server - using your actual column names
    const testData = {
      timestamp: new Date().toISOString(),    // date
      callerNumber: '+33123456789',           // numero
      name: 'Marie Dubois',                   // nom
      plate: 'AB-123-CD',                     // plaquette
      service: 'Entretien',                   // service
      recordingUrl: 'https://api.twilio.com/2010-04-01/Accounts/AC0d3887ec2d01d17eea3478a56ccd5ebc/Recordings/RE1234567890abcdef1234567890abcd'  // recordurl
    };
    
    console.log('Sending test data to Google Apps Script:');
    console.log(JSON.stringify(testData, null, 2));
    
    // Send data to Apps Script
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('\nResponse status:', response.status);
    
    if (response.ok) {
      const responseData = await response.text();
      console.log('✅ Data sent successfully to Google Apps Script');
      console.log('Response:', responseData);
    } else {
      console.log('❌ Error sending data to Google Apps Script');
      console.log('Status:', response.status);
      console.log('Status text:', response.statusText);
      
      // Try to get error details
      try {
        const errorData = await response.text();
        console.log('Error details:', errorData);
      } catch (e) {
        console.log('Could not retrieve error details');
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing Apps Script data sending:', error.message);
    console.log('\nThis could be due to:');
    console.log('1. Incorrect APPS_SCRIPT_URL in .env file');
    console.log('2. Google Apps Script not deployed correctly');
    console.log('3. Network connectivity issues');
    console.log('4. Google Apps Script permissions not set correctly');
  }
}

testAppsScriptData();