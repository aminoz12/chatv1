const fs = require('fs');
const path = require('path');

// Check MP3 files for content
const voiceDir = path.join(__dirname, 'voice');
const files = ['a1.mp3', 'a2.mp3', 'a3.mp3'];

console.log('Checking MP3 files for content...\n');

files.forEach(file => {
  const filePath = path.join(voiceDir, file);
  
  try {
    // Get file stats
    const stats = fs.statSync(filePath);
    console.log(`File: ${file}`);
    console.log(`  Size: ${stats.size} bytes`);
    
    // Read file content
    const buffer = fs.readFileSync(filePath);
    console.log(`  Buffer length: ${buffer.length} bytes`);
    
    // Check if file is empty or has minimal content
    if (stats.size < 100) {
      console.log(`  ⚠️  WARNING: File appears to be empty or very small`);
    }
    
    // Check MP3 header (first 3 bytes should be ID3 tag or MP3 frame header)
    if (buffer.length >= 3) {
      const header = buffer.slice(0, 3);
      const hexHeader = header.toString('hex');
      console.log(`  First 3 bytes: ${hexHeader}`);
      
      // Check for common MP3 signatures
      if (hexHeader === '494433' || hexHeader === 'fffb9' || hexHeader === 'fff334') {
        console.log(`  ✓ File appears to have valid MP3 header`);
      } else {
        console.log(`  ⚠️  WARNING: File may not have valid MP3 header`);
      }
    } else {
      console.log(`  ⚠️  WARNING: File is too small to be a valid MP3`);
    }
    
    console.log('');
  } catch (error) {
    console.log(`  ✗ Error reading ${file}: ${error.message}`);
    console.log('');
  }
});

console.log('MP3 file check completed.');