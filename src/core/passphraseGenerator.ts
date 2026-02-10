/**
 * Passphrase Generator Module
 * Generates high-entropy passphrases using the XKCD method (Correct-Horse-Battery-Staple)
 * Uses crypto.getRandomValues for cryptographically secure random selection
 */

import { WORD_LIST } from './wordlist';

interface PassphraseOptions {
  wordCount?: number;
  separator?: string;
  capitalize?: boolean;
  includeNumber?: boolean;
}

/**
 * Generates a random passphrase from the word list
 */
export function generatePassphrase(options: PassphraseOptions = {}): string {
  const {
    wordCount = 4,
    separator = '-',
    capitalize = true,
    includeNumber = false,
  } = options;

  const words: string[] = [];
  const listSize = WORD_LIST.length;

  // Use crypto.getRandomValues for secure random number generation
  const randomValues = new Uint32Array(wordCount);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < wordCount; i++) {
    const index = randomValues[i] % listSize;
    let word = WORD_LIST[index];

    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }

    words.push(word);
  }

  // Optionally substitute a random character with a number in the last word
  // OR just append a number. Appending is safer for readability.
  // Let's replace the last word's last char? No, that breaks the word.
  // Common pattern: Append a digit to one of the words.
  if (includeNumber) {
    const randomPos = crypto.getRandomValues(new Uint32Array(1))[0] % wordCount;
    const randomNum = crypto.getRandomValues(new Uint32Array(1))[0] % 10;
    words[randomPos] += randomNum;
  }

  return words.join(separator);
}

/**
 * Calculates the entropy bits for a generated passphrase
 * Entropy = log2(PoolSize^WordCount)
 */
export function calculatePassphraseEntropy(wordCount: number = 4): number {
  const poolSize = WORD_LIST.length;
  // If includeNumber is true, pool size effective increases by * 10 * wordCount?
  // Conservative estimate: log2(PoolSize^WordCount)
  return Math.log2(Math.pow(poolSize, wordCount));
}
