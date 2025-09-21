require('dotenv').config();

// Debug script to test Google Apps Script connectivity
async function debugAppsScript() {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;
  
  console.log('=== Debugging Google Apps Script Integration ===\n');
  
  if (!appsScriptUrl || appsScriptUrl.startsWith('#')) {
    console.log('❌ APPS_SCRIPT_URL not configured in .env file');
    console.log('Please uncomment and set the APPS_SCRIPT_URL in your .env file');
    return;
  }
  
  console.log('✅ APPS_SCRIPT_URL found:', appsScriptUrl);
  
  // Extract script ID for debugging
  const scriptId = appsScriptUrl.split('/').slice(-2)[0];
  console.log('📝 Script ID:', scriptId);
  
  // Test data that mimics what your server sends - using your actual column names
  const testData = {
    timestamp: new Date().toISOString(),    // date
    callerNumber: '+33612345678',           // numero
    name: 'Debug Test',                     // nom
    plate: 'DEBUG-001',                     // plaquette
    service: 'System Debug',                // service
    recordingUrl: 'https://example.com/debug-recording.mp3'  // recordurl
  };
  
  console.log('\n📡 Sending test data to verify Apps Script is working...');
  console.log('Test data:', JSON.stringify(testData, null, 2));
  
  try {
    // First, let's check if the URL is accessible
    console.log('\n🔍 Testing URL accessibility...');
    const headResponse = await fetch(appsScriptUrl, { method: 'HEAD' });
    console.log('   HEAD request status:', headResponse.status);
    
    // Now send actual test data
    console.log('\n📤 Sending POST request with test data...');
    const startTime = Date.now();
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    const duration = Date.now() - startTime;
    
    console.log('   Request completed in:', duration, 'ms');
    console.log('   Response status:', response.status);
    console.log('   Response status text:', response.statusText);
    
    // Try to get response content
    try {
      const responseBody = await response.text();
      console.log('   Response body:', responseBody.substring(0, 200) + (responseBody.length > 200 ? '...' : ''));
      
      // Try to parse as JSON if possible
      try {
        const jsonResponse = JSON.parse(responseBody);
        console.log('   Parsed JSON response:', JSON.stringify(jsonResponse, null, 2));
      } catch (parseError) {
        // Not JSON, that's okay
        console.log('   Response is not JSON format');
      }
    } catch (contentError) {
      console.log('   Could not read response content:', contentError.message);
    }
    
    // Interpret results
    if (response.status === 200) {
      console.log('\n✅ SUCCESS: Apps Script is accessible and responding!');
      console.log('   Your Google Apps Script appears to be working correctly.');
      console.log('   If data is not appearing in your sheet, check:');
      console.log('   1. The Spreadsheet ID in your Apps Script code');
      console.log('   2. That the Google account has edit access to the spreadsheet');
      console.log('   3. Column headers in row 1 of your spreadsheet match:');
      console.log('      - date');
      console.log('      - numero');
      console.log('      - nom');
      console.log('      - plaquette');
      console.log('      - service');
      console.log('      - recordurl');
    } else if (response.status === 405) {
      console.log('\n⚠️  WARNING: Method not allowed');
      console.log('   Your Apps Script may not have a doPost function');
      console.log('   Check that your Apps Script code includes the doPost function');
    } else if (response.status === 404) {
      console.log('\n❌ ERROR: Apps Script not found');
      console.log('   The URL may be incorrect or the script is not deployed');
      console.log('   Verify the deployment steps in GOOGLE_APPS_SCRIPT_INSTRUCTIONS.md');
    } else if (response.status === 401) {
      console.log('\n❌ ERROR: Unauthorized');
      console.log('   The Apps Script may not be deployed with correct permissions');
      console.log('   Check that "Who has access" is set to "Anyone" or "Anyone with Google"');
    } else {
      console.log('\n❓ UNEXPECTED RESPONSE');
      console.log('   Status code:', response.status);
      console.log('   This may indicate an issue with your Apps Script code');
    }
    
  } catch (error) {
    console.log('\n❌ ERROR: Could not connect to Apps Script');
    console.log('   Error message:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. Verify the APPS_SCRIPT_URL in your .env file is correct');
    console.log('   2. Check your internet connection');
    console.log('   3. Ensure your Apps Script is deployed as a web app');
    console.log('   4. Verify the deployment settings allow access');
    console.log('   5. Check that your Apps Script code has the doPost function');
  }
  
  console.log('\n📋 Next steps:');
  console.log('   1. Review your Google Apps Script code');
  console.log('   2. Check deployment settings');
  console.log('   3. Verify spreadsheet permissions');
  console.log('   4. Test with the sample code in GOOGLE_APPS_SCRIPT_INSTRUCTIONS.md');
}

debugAppsScript();