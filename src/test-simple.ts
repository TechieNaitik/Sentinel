/**
 * Simple Test Script for Core Logic Layer
 */

import { analyzeEntropy } from './core/entropy.js';
import { detectPatterns } from './core/complexity.js';
import { calculateCrackTime } from './core/crackTime.js';
import { analyzeWithZxcvbn } from './core/zxcvbnWrapper.js';

console.log('='.repeat(80));
console.log('SENTINEL - CORE LOGIC LAYER TEST');
console.log('='.repeat(80));

// Test 1: Weak password
console.log('\n--- Test 1: "password123" ---');
const test1 = 'password123';
const entropy1 = analyzeEntropy(test1);
const patterns1 = detectPatterns(test1);
const crack1 = calculateCrackTime(entropy1.poolSize, entropy1.length);
const zxcvbn1 = analyzeWithZxcvbn(test1);

console.log(`Entropy: ${entropy1.entropy} bits (${entropy1.strength})`);
console.log(`Patterns found: ${patterns1.patterns.length}`);
console.log(`Crack time: ${crack1.formatted}`);
console.log(`zxcvbn score: ${zxcvbn1.score}/4 (${zxcvbn1.strength})`);

// Test 2: Strong password
console.log('\n--- Test 2: "X9$mK#pL2@qR" ---');
const test2 = 'X9$mK#pL2@qR';
const entropy2 = analyzeEntropy(test2);
const patterns2 = detectPatterns(test2);
const crack2 = calculateCrackTime(entropy2.poolSize, entropy2.length);
const zxcvbn2 = analyzeWithZxcvbn(test2);

console.log(`Entropy: ${entropy2.entropy} bits (${entropy2.strength})`);
console.log(`Patterns found: ${patterns2.patterns.length}`);
console.log(`Crack time: ${crack2.formatted}`);
console.log(`zxcvbn score: ${zxcvbn2.score}/4 (${zxcvbn2.strength})`);

// Test 3: Pattern detection
console.log('\n--- Test 3: "qwerty1234" ---');
const test3 = 'qwerty1234';
const patterns3 = detectPatterns(test3);
console.log(`Patterns detected: ${patterns3.hasWeakPatterns ? 'YES' : 'NO'}`);
patterns3.patterns.forEach(p => {
  console.log(`  - [${p.severity}] ${p.description}`);
});

console.log('\n' + '='.repeat(80));
console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
console.log('='.repeat(80));
