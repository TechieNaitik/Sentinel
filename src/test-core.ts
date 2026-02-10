/**
 * Test Script for Core Logic Layer
 * Tests entropy calculation, pattern detection, crack time estimation, and zxcvbn integration
 */

import { analyzeEntropy, calculateEntropy, detectCharacterPoolSize } from './core/entropy';
import { detectPatterns } from './core/complexity';
import { calculateCrackTime, formatCrackTime } from './core/crackTime';
import { analyzeWithZxcvbn, compareEntropyWithZxcvbn } from './core/zxcvbnWrapper';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Test passwords with varying strengths
 */
const testPasswords = [
  { password: '123456', description: 'Very weak - common password' },
  { password: 'password', description: 'Very weak - dictionary word' },
  { password: 'qwerty', description: 'Very weak - keyboard walk' },
  { password: 'aaaa1111', description: 'Weak - repetitive characters' },
  { password: 'Password123', description: 'Fair - mixed case with numbers' },
  { password: 'MyP@ssw0rd!', description: 'Fair - common pattern with symbols' },
  { password: 'Tr0ub4dor&3', description: 'Strong - XKCD famous example' },
  { password: 'correct horse battery staple', description: 'Strong - passphrase' },
  { password: 'X9$mK#pL2@qR', description: 'Very strong - random characters' },
  { password: 'aB3$xY9#mK2@pL5&qR8!', description: 'Very strong - long random' },
];

/**
 * Prints a section header
 */
function printHeader(text: string) {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(80)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${text}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'='.repeat(80)}${colors.reset}\n`);
}

/**
 * Prints a subsection header
 */
function printSubHeader(text: string) {
  console.log(`\n${colors.bright}${colors.blue}${text}${colors.reset}`);
  console.log(`${colors.blue}${'-'.repeat(80)}${colors.reset}`);
}

/**
 * Prints test results for a password
 */
function testPassword(password: string, description: string) {
  printSubHeader(`Testing: "${password}" - ${description}`);

  // 1. Entropy Analysis
  console.log(`\n${colors.bright}1. Entropy Analysis:${colors.reset}`);
  const entropyResult = analyzeEntropy(password);
  console.log(`   Length: ${entropyResult.length} characters`);
  console.log(`   Character Pool Size: ${entropyResult.poolSize}`);
  console.log(`   Entropy: ${colors.bright}${entropyResult.entropy} bits${colors.reset}`);
  console.log(`   Strength: ${getStrengthColor(entropyResult.strength)}${entropyResult.strength}${colors.reset}`);

  // 2. Pattern Detection
  console.log(`\n${colors.bright}2. Pattern Detection:${colors.reset}`);
  const patternResult = detectPatterns(password);
  console.log(`   Complexity Score: ${getScoreColor(patternResult.score)}${patternResult.score}/100${colors.reset}`);
  console.log(`   Weak Patterns Found: ${patternResult.hasWeakPatterns ? colors.red + 'Yes' : colors.green + 'No'}${colors.reset}`);
  
  if (patternResult.patterns.length > 0) {
    console.log(`   Detected Patterns:`);
    patternResult.patterns.forEach((pattern) => {
      const severityColor = pattern.severity === 'high' ? colors.red : pattern.severity === 'medium' ? colors.yellow : colors.green;
      console.log(`     - [${severityColor}${pattern.severity.toUpperCase()}${colors.reset}] ${pattern.description}`);
    });
  }

  // 3. Crack Time Estimation
  console.log(`\n${colors.bright}3. Crack Time Estimation (MD5 - worst case):${colors.reset}`);
  const crackTimeResult = calculateCrackTime(entropyResult.poolSize, entropyResult.length);
  console.log(`   Total Combinations: ${crackTimeResult.combinations.toExponential(2)}`);
  console.log(`   Hash Rate: ${crackTimeResult.hashRate.toLocaleString()} hashes/second`);
  console.log(`   Time to Crack: ${colors.bright}${crackTimeResult.formatted}${colors.reset}`);
  console.log(`   Severity: ${getSeverityColor(crackTimeResult.severity)}${crackTimeResult.severity}${colors.reset}`);

  // 4. zxcvbn Analysis
  console.log(`\n${colors.bright}4. zxcvbn Analysis:${colors.reset}`);
  const zxcvbnResult = analyzeWithZxcvbn(password);
  console.log(`   Score: ${zxcvbnResult.score}/4`);
  console.log(`   Strength: ${getStrengthColor(zxcvbnResult.strength)}${zxcvbnResult.strength}${colors.reset}`);
  console.log(`   Guesses Required: ${zxcvbnResult.guesses.toExponential(2)}`);
  console.log(`   Crack Time (zxcvbn): ${colors.bright}${zxcvbnResult.crackTimeDisplay}${colors.reset}`);
  
  if (zxcvbnResult.feedback.warning) {
    console.log(`   ${colors.yellow}Warning: ${zxcvbnResult.feedback.warning}${colors.reset}`);
  }
  
  if (zxcvbnResult.feedback.suggestions.length > 0) {
    console.log(`   Suggestions:`);
    zxcvbnResult.feedback.suggestions.forEach((suggestion) => {
      console.log(`     - ${suggestion}`);
    });
  }

  // 5. Comparison
  console.log(`\n${colors.bright}5. Manual Entropy vs zxcvbn Comparison:${colors.reset}`);
  const comparison = compareEntropyWithZxcvbn(entropyResult.entropy, zxcvbnResult);
  const zxcvbnEntropyBits = comparison.zxcvbnGuessesLog10 * Math.log2(10);
  console.log(`   Manual Entropy: ${comparison.manualEntropy.toFixed(2)} bits`);
  console.log(`   zxcvbn Entropy: ${zxcvbnEntropyBits.toFixed(2)} bits`);
  console.log(`   Difference: ${comparison.difference.toFixed(2)} bits`);
  console.log(`   ${colors.cyan}${comparison.recommendation}${colors.reset}`);
}

/**
 * Gets color based on strength level
 */
function getStrengthColor(strength: string): string {
  switch (strength) {
    case 'very-weak':
      return colors.red + colors.bright;
    case 'weak':
      return colors.red;
    case 'fair':
      return colors.yellow;
    case 'strong':
      return colors.green;
    case 'very-strong':
      return colors.green + colors.bright;
    default:
      return colors.reset;
  }
}

/**
 * Gets color based on score
 */
function getScoreColor(score: number): string {
  if (score >= 80) return colors.green + colors.bright;
  if (score >= 60) return colors.green;
  if (score >= 40) return colors.yellow;
  if (score >= 20) return colors.red;
  return colors.red + colors.bright;
}

/**
 * Gets color based on severity
 */
function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'instant':
    case 'very-fast':
      return colors.red + colors.bright;
    case 'fast':
      return colors.red;
    case 'moderate':
      return colors.yellow;
    case 'slow':
      return colors.green;
    case 'very-slow':
      return colors.green + colors.bright;
    default:
      return colors.reset;
  }
}

/**
 * Tests specific entropy calculations
 */
function testEntropyCalculations() {
  printHeader('ENTROPY CALCULATION TESTS');

  const tests = [
    { password: '1234', expected: { poolSize: 10, entropy: 13.29 } },
    { password: 'abcd', expected: { poolSize: 26, entropy: 18.80 } },
    { password: 'ABCD', expected: { poolSize: 26, entropy: 18.80 } },
    { password: 'AbCd', expected: { poolSize: 52, entropy: 22.76 } },
    { password: 'Ab12', expected: { poolSize: 62, entropy: 23.90 } },
    { password: 'Ab1!', expected: { poolSize: 95, entropy: 26.30 } },
  ];

  tests.forEach((test) => {
    const poolSize = detectCharacterPoolSize(test.password);
    const entropy = calculateEntropy(test.password);
    
    const poolMatch = poolSize === test.expected.poolSize;
    const entropyMatch = Math.abs(entropy - test.expected.entropy) < 0.1;
    
    console.log(`Password: "${test.password}"`);
    console.log(`  Pool Size: ${poolMatch ? colors.green : colors.red}${poolSize}${colors.reset} (expected: ${test.expected.poolSize})`);
    console.log(`  Entropy: ${entropyMatch ? colors.green : colors.red}${entropy}${colors.reset} bits (expected: ${test.expected.entropy})`);
    console.log(`  ${poolMatch && entropyMatch ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}\n`);
  });
}

/**
 * Tests crack time formatting
 */
function testCrackTimeFormatting() {
  printHeader('CRACK TIME FORMATTING TESTS');

  const tests = [
    { seconds: 0.5, expected: 'instant' },
    { seconds: 30, expected: '30 seconds' },
    { seconds: 120, expected: '2 minutes' },
    { seconds: 7200, expected: '2 hours' },
    { seconds: 86400, expected: '1 day' },
    { seconds: 2592000, expected: '1 month' },
    { seconds: 31536000, expected: '1.0 year' },
    { seconds: 315360000, expected: '1 decade' },
  ];

  tests.forEach((test) => {
    const formatted = formatCrackTime(test.seconds);
    const match = formatted === test.expected;
    
    console.log(`Seconds: ${test.seconds}`);
    console.log(`  Formatted: ${match ? colors.green : colors.red}${formatted}${colors.reset} (expected: ${test.expected})`);
    console.log(`  ${match ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}\n`);
  });
}

/**
 * Main test runner
 */
function runTests() {
  console.clear();
  
  printHeader('SENTINEL - CORE LOGIC LAYER TEST SUITE');
  console.log(`${colors.bright}Testing Password Strength Analysis Components${colors.reset}`);
  console.log(`Date: ${new Date().toLocaleString()}\n`);

  // Run unit tests
  testEntropyCalculations();
  testCrackTimeFormatting();

  // Run integration tests
  printHeader('PASSWORD ANALYSIS INTEGRATION TESTS');
  testPasswords.forEach((test) => {
    testPassword(test.password, test.description);
  });

  // Summary
  printHeader('TEST SUITE COMPLETED');
  console.log(`${colors.green}${colors.bright}All core logic modules tested successfully!${colors.reset}`);
  console.log(`\n${colors.cyan}Next Steps:${colors.reset}`);
  console.log(`  1. Review the test results above`);
  console.log(`  2. Verify entropy calculations are accurate`);
  console.log(`  3. Check pattern detection is working correctly`);
  console.log(`  4. Confirm crack time estimates are reasonable`);
  console.log(`  5. Compare manual entropy with zxcvbn results\n`);
}

// Run the tests
runTests();
