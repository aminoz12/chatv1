// Check clock synchronization which can cause JWT signature errors
const https = require('https');

async function checkClockSynchronization() {
  console.log('=== Clock Synchronization Check ===\n');
  
  // Get local time
  const localTime = new Date();
  console.log('Local system time:', localTime.toISOString());
  
  // Get time from Google's server
  return new Promise((resolve, reject) => {
    const req = https.get('https://www.googleapis.com/oauth2/v4/token', (res) => {
      const googleTime = new Date(res.headers.date);
      console.log('Google server time:', googleTime.toISOString());
      
      // Calculate difference
      const diffMs = Math.abs(localTime.getTime() - googleTime.getTime());
      const diffSeconds = Math.floor(diffMs / 1000);
      
      console.log('Time difference:', diffSeconds, 'seconds');
      
      if (diffSeconds > 300) { // 5 minutes
        console.log('⚠️  WARNING: Clock drift is significant (> 5 minutes)');
        console.log('This can cause JWT signature validation failures');
        console.log('Consider synchronizing your system clock');
      } else if (diffSeconds > 60) { // 1 minute
        console.log('⚠️  Clock drift detected (> 1 minute)');
        console.log('This might cause authentication issues');
      } else {
        console.log('✓ Clock synchronization looks good');
      }
      
      resolve({
        localTime,
        googleTime,
        differenceSeconds: diffSeconds
      });
    });
    
    req.on('error', (error) => {
      console.log('✗ Failed to get time from Google server:', error.message);
      resolve(null);
    });
    
    req.end();
  });
}

checkClockSynchronization().then(() => {
  console.log('\n=== Clock Check Complete ===');
});