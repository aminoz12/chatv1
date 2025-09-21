const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Function to get audio file duration using ffprobe
function getAudioDuration(filePath) {
  try {
    const command = `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${filePath}"`;
    const result = execSync(command, { encoding: 'utf8' });
    return parseFloat(result.trim());
  } catch (error) {
    console.error(`Error getting duration for ${filePath}:`, error.message);
    return null;
  }
}

// Check durations of all voice files
const voiceDir = path.join(__dirname, 'voice');
const files = ['a1.mp3', 'a2.mp3', 'a3.mp3'];

console.log('Checking audio file durations...');

files.forEach(file => {
  const filePath = path.join(voiceDir, file);
  if (fs.existsSync(filePath)) {
    const duration = getAudioDuration(filePath);
    const stats = fs.statSync(filePath);
    
    console.log(`\n${file}:`);
    console.log(`  Size: ${stats.size} bytes`);
    console.log(`  Duration: ${duration ? duration.toFixed(2) + ' seconds' : 'Unknown'}`);
    
    if (duration && duration > 0) {
      console.log(`  ✓ File has audio content (${duration.toFixed(2)} seconds)`);
    } else {
      console.log(`  ⚠️  File may be empty or corrupted`);
    }
  } else {
    console.log(`${file}: File not found`);
  }
});

console.log('\nAudio file check completed.');