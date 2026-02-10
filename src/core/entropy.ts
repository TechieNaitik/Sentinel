/**
 * Entropy Calculation Module
 * Implements Shannon Entropy formula: E = L × log₂(R)
 * Where:
 *   L = Length of password
 *   R = Size of character pool (range)
 */

/**
 * Interface for entropy calculation results
 */
export interface EntropyResult {
  entropy: number; // Entropy in bits
  poolSize: number; // Character pool size (R)
  length: number; // Password length (L)
  strength: 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';
}

/**
 * Character pool sizes for different character types
 */
const POOL_SIZES = {
  NUMBERS: 10,
  LOWERCASE: 26,
  UPPERCASE: 26,
  SYMBOLS: 33, // Common symbols: !@#$%^&*()_+-=[]{}|;:,.<>?/~`
} as const;

/**
 * Detects the character pool size based on the characters used in the password
 * @param password - The password to analyze
 * @returns The size of the character pool (R)
 */
export function detectCharacterPoolSize(password: string): number {
  if (!password || password.length === 0) {
    return 0;
  }

  let poolSize = 0;

  // Check for numbers (0-9)
  if (/\d/.test(password)) {
    poolSize += POOL_SIZES.NUMBERS;
  }

  // Check for lowercase letters (a-z)
  if (/[a-z]/.test(password)) {
    poolSize += POOL_SIZES.LOWERCASE;
  }

  // Check for uppercase letters (A-Z)
  if (/[A-Z]/.test(password)) {
    poolSize += POOL_SIZES.UPPERCASE;
  }

  // Check for symbols
  if (/[^a-zA-Z0-9]/.test(password)) {
    poolSize += POOL_SIZES.SYMBOLS;
  }

  return poolSize;
}

/**
 * Calculates the Shannon Entropy of a password
 * Formula: E = L × log₂(R)
 * @param password - The password to analyze
 * @returns Entropy in bits
 */
export function calculateEntropy(password: string): number {
  if (!password || password.length === 0) {
    return 0;
  }

  const length = password.length; // L
  const poolSize = detectCharacterPoolSize(password); // R

  if (poolSize === 0) {
    return 0;
  }

  // E = L × log₂(R)
  const entropy = length * Math.log2(poolSize);

  return Math.round(entropy * 100) / 100; // Round to 2 decimal places
}

/**
 * Determines the strength level based on entropy
 * @param entropy - Entropy value in bits
 * @returns Strength level
 */
export function getStrengthFromEntropy(
  entropy: number
): 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong' {
  if (entropy < 28) return 'very-weak'; // Less than 28 bits
  if (entropy < 36) return 'weak'; // 28-35 bits
  if (entropy < 60) return 'fair'; // 36-59 bits
  if (entropy < 128) return 'strong'; // 60-127 bits
  return 'very-strong'; // 128+ bits
}

/**
 * Performs complete entropy analysis on a password
 * @param password - The password to analyze
 * @returns Complete entropy analysis results
 */
export function analyzeEntropy(password: string): EntropyResult {
  const length = password.length;
  const poolSize = detectCharacterPoolSize(password);
  const entropy = calculateEntropy(password);
  const strength = getStrengthFromEntropy(entropy);

  return {
    entropy,
    poolSize,
    length,
    strength,
  };
}
