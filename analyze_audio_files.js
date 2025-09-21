const fs = require('fs');
const path = require('path');

// Function to analyze audio file headers and content
function analyzeAudioFile(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    console.log(`\nAnalyzing ${path.basename(filePath)}...`);
    console.log(`  File size: ${buffer.length} bytes`);
    
    // Check for MP3 signature
    const mp3Signature = buffer.readUInt32BE(0);
    console.log(`  First 4 bytes (hex): ${mp3Signature.toString(16)}`);
    
    // Check for ID3 tag (common in MP3 files)
    if (buffer.length > 3 && buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
      console.log(`  ✓ Contains ID3 tag (valid MP3 header)`);
    } else {
      console.log(`  ? May not have ID3 tag`);
    }
    
    // Check if file has reasonable size for audio
    if (buffer.length > 1000) {
      console.log(`  ✓ File size suggests it may contain audio content`);
    } else {
      console.log(`  ⚠️  File size is very small, may be empty`);
    }
    
    // Show first 20 bytes in hex for analysis
    let hexPreview = '';
    for (let i = 0; i < Math.min(20, buffer.length); i++) {
      hexPreview += buffer[i].toString(16).padStart(2, '0') + ' ';
    }
    console.log(`  First 20 bytes (hex): ${hexPreview.trim()}`);
    
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
  }
}

// Analyze all voice files
const voiceDir = path.join(__dirname, 'voice');
const files = ['a1.mp3', 'a2.mp3', 'a3.mp3'];

console.log('Analyzing audio files for content...\n');

files.forEach(file => {
  const filePath = path.join(voiceDir, file);
  if (fs.existsSync(filePath)) {
    analyzeAudioFile(filePath);
  } else {
    console.log(`${file}: File not found`);
  }
});

console.log('\nAudio analysis completed.');