const fs = require('fs');
const path = require('path');

// Function to validate MP3 file
function validateMp3(filePath) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: 'File does not exist' };
    }
    
    // Get file stats
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      return { valid: false, error: 'File is empty' };
    }
    
    // Read first 100 bytes to check header
    const buffer = fs.readFileSync(filePath);
    if (buffer.length < 3) {
      return { valid: false, error: 'File is too small' };
    }
    
    // Check for valid MP3 signatures
    const hexString = buffer.toString('hex');
    
    // Valid MP3 signatures:
    // ID3 tag: 494433
    // MP3 frame headers start with fff
    if (hexString.startsWith('494433') || hexString.startsWith('fff')) {
      return { 
        valid: true, 
        size: stats.size,
        signature: hexString.substring(0, 10)
      };
    } else {
      return { 
        valid: false, 
        error: 'Not a valid MP3 file (invalid signature)',
        signature: hexString.substring(0, 10)
      };
    }
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Validate all MP3 files in voice directory
const voiceDir = path.join(__dirname, 'voice');
const files = ['a1.mp3', 'a2.mp3', 'a3.mp3'];

console.log('Validating MP3 files...\n');

files.forEach(file => {
  const filePath = path.join(voiceDir, file);
  console.log(`Checking ${file}...`);
  
  const result = validateMp3(filePath);
  
  if (result.valid) {
    console.log(`  ✓ VALID MP3 file`);
    console.log(`  Size: ${result.size} bytes`);
    console.log(`  Signature: ${result.signature}`);
  } else {
    console.log(`  ✗ INVALID: ${result.error}`);
    if (result.signature) {
      console.log(`  First bytes: ${result.signature}`);
    }
  }
  
  console.log('');
});

console.log('Validation complete.');