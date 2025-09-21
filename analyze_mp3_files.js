const fs = require('fs');
const path = require('path');

// Analyze MP3 files in detail
const voiceDir = path.join(__dirname, 'voice');
const files = ['a1.mp3', 'a2.mp3', 'a3.mp3'];

console.log('Analyzing MP3 files in detail...\n');

files.forEach(file => {
  const filePath = path.join(voiceDir, file);
  
  try {
    console.log(`=== Analyzing ${file} ===`);
    
    // Get file stats
    const stats = fs.statSync(filePath);
    console.log(`Size: ${stats.size} bytes`);
    
    // Read file content
    const buffer = fs.readFileSync(filePath);
    console.log(`Buffer length: ${buffer.length} bytes`);
    
    // Display first 20 bytes in hex
    const first20Hex = buffer.slice(0, 20).toString('hex');
    console.log(`First 20 bytes (hex): ${first20Hex}`);
    
    // Display first 20 bytes as ASCII (if printable)
    const first20Ascii = buffer.slice(0, 20).toString('ascii');
    console.log(`First 20 bytes (ASCII): ${first20Ascii.replace(/[^\x20-\x7E]/g, '.')}`);
    
    // Check if all bytes are zero (empty file)
    const isAllZero = buffer.every(byte => byte === 0);
    if (isAllZero) {
      console.log(`⚠️  WARNING: File contains only zero bytes (completely empty)`);
    }
    
    // Check if file is mostly the same byte
    const byteCounts = {};
    buffer.forEach(byte => {
      byteCounts[byte] = (byteCounts[byte] || 0) + 1;
    });
    
    const uniqueBytes = Object.keys(byteCounts).length;
    console.log(`Unique byte values: ${uniqueBytes}`);
    
    if (uniqueBytes < 10) {
      console.log(`⚠️  WARNING: File has very few unique byte values (${uniqueBytes}), likely not a valid audio file`);
    }
    
    // Check for valid MP3 signatures
    const hexString = buffer.toString('hex');
    if (hexString.startsWith('494433') || hexString.startsWith('fff')) {
      console.log(`✓ File appears to have valid MP3 signature`);
    } else {
      console.log(`✗ File does not have valid MP3 signature`);
    }
    
    console.log('');
  } catch (error) {
    console.log(`✗ Error analyzing ${file}: ${error.message}`);
    console.log('');
  }
});

console.log('MP3 file analysis completed.');