// Test script for binary response detection
const { detectBinaryResponse } = require('./parse-speech');

console.log('Testing binary response detection function...\n');

// Test cases
const testCases = [
  'oui',
  'non',
  'Oui',
  'NON',
  'Je dis oui',
  'Je dis non',
  'Je ne sais pas',
  'peut-être',
  'Oui, je veux bien',
  'Non merci',
  'Bien sûr que oui',
  'Absolument pas',
  '',
  null,
  'OUI',
  'o u i',
  'non non'
];

testCases.forEach((testCase, index) => {
  const result = detectBinaryResponse(testCase);
  console.log(`Test ${index + 1}: "${testCase}" => ${result}`);
});

console.log('\nTesting complete.');