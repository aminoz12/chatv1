const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Serve static voice files (same as in server.js)
app.use('/voice-files', express.static(path.join(__dirname, 'voice')));

app.get('/', (req, res) => {
  res.send(`
    <h1>Voice File Test</h1>
    <p>Click below to test each voice file:</p>
    <ul>
      <li><a href="/voice-files/a1.mp3">Test a1.mp3</a></li>
      <li><a href="/voice-files/a2.mp3">Test a2.mp3</a></li>
      <li><a href="/voice-files/a3.mp3">Test a3.mp3</a></li>
    </ul>
    <p>If files don't play, check the server console for errors.</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Voice file test server running on port ${PORT}`);
  console.log(`Test URLs:`);
  console.log(`  http://localhost:${PORT}/voice-files/a1.mp3`);
  console.log(`  http://localhost:${PORT}/voice-files/a2.mp3`);
  console.log(`  http://localhost:${PORT}/voice-files/a3.mp3`);
});