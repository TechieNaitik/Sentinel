/**
 * Constants for Time-to-Crack Calculations
 * Contains GPU hash rates and hash algorithm speeds
 */

/**
 * GPU hash rates (hashes per second)
 * Based on NVIDIA RTX 4090 benchmarks
 * Source: https://gist.github.com/Chick3nman/32e662a5bb63bc4f51b847bb422222fd
 */
export const GPU_HASH_RATES = {
  // Fast hashes (unsalted, legacy)
  MD5: 164_000_000_000, // 164 GH/s
  SHA1: 55_000_000_000, // 55 GH/s
  SHA256: 26_000_000_000, // 26 GH/s
  SHA512: 8_500_000_000, // 8.5 GH/s

  // Modern secure hashes (with salt and iterations)
  BCRYPT: 100_000, // ~100 KH/s (cost factor 5)
  SCRYPT: 1_000_000, // ~1 MH/s
  ARGON2: 50_000, // ~50 KH/s (conservative estimate)
  PBKDF2_SHA256: 2_000_000, // ~2 MH/s (10,000 iterations)
} as const;

/**
 * Default hash algorithm to use for calculations
 * Using MD5 as worst-case scenario (fastest to crack)
 */
export const DEFAULT_HASH_ALGORITHM = 'MD5';

/**
 * Time conversion constants
 */
export const TIME_UNITS = {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 60 * 60 * 24,
  WEEK: 60 * 60 * 24 * 7,
  MONTH: 60 * 60 * 24 * 30, // Approximate
  YEAR: 60 * 60 * 24 * 365,
  DECADE: 60 * 60 * 24 * 365 * 10,
  CENTURY: 60 * 60 * 24 * 365 * 100,
  MILLENNIUM: 60 * 60 * 24 * 365 * 1000,
} as const;

/**
 * Hash algorithm type
 */
export type HashAlgorithm = keyof typeof GPU_HASH_RATES;
