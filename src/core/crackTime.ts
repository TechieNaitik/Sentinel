/**
 * Time-to-Crack Calculation Module
 * Estimates how long it would take to crack a password using brute force
 */

import {
  GPU_HASH_RATES,
  DEFAULT_HASH_ALGORITHM,
  TIME_UNITS,
  type HashAlgorithm,
} from './constants';

/**
 * Interface for time-to-crack results
 */
export interface CrackTimeResult {
  seconds: number; // Raw time in seconds
  formatted: string; // Human-readable format (e.g., "2.5 years")
  severity: 'instant' | 'very-fast' | 'fast' | 'moderate' | 'slow' | 'very-slow';
  combinations: number; // Total possible combinations
  hashRate: number; // Hashes per second used in calculation
  algorithm: HashAlgorithm; // Hash algorithm used
}

/**
 * Calculates total possible combinations for a given pool size and length
 * Formula: R^L (where R = pool size, L = password length)
 * @param poolSize - Size of character pool
 * @param length - Length of password
 * @returns Total possible combinations
 */
export function calculateCombinations(poolSize: number, length: number): number {
  if (poolSize === 0 || length === 0) {
    return 0;
  }

  // Use Math.pow for calculation
  // Note: For very large values, this may return Infinity
  return Math.pow(poolSize, length);
}

/**
 * Calculates time to crack in seconds
 * @param combinations - Total possible combinations
 * @param hashRate - Hashes per second
 * @returns Time in seconds (assumes 50% of keyspace needs to be searched on average)
 */
export function calculateCrackTimeSeconds(
  combinations: number,
  hashRate: number
): number {
  if (combinations === 0 || hashRate === 0) {
    return 0;
  }

  // On average, you need to search 50% of the keyspace
  const averageCombinations = combinations / 2;

  // Time = Combinations / Hash Rate
  const seconds = averageCombinations / hashRate;

  return seconds;
}

/**
 * Formats time in seconds to human-readable format
 * @param seconds - Time in seconds
 * @returns Formatted string (e.g., "2.5 years", "3 months", "instant")
 */
export function formatCrackTime(seconds: number): string {
  if (seconds === 0 || !isFinite(seconds)) {
    return 'instant';
  }

  // Handle very large numbers
  if (seconds === Infinity || seconds > TIME_UNITS.MILLENNIUM * 1000) {
    return 'longer than the age of the universe';
  }

  // Millennium
  if (seconds >= TIME_UNITS.MILLENNIUM) {
    const millennia = Math.round(seconds / TIME_UNITS.MILLENNIUM);
    return `${millennia.toLocaleString()} ${millennia === 1 ? 'millennium' : 'millennia'}`;
  }

  // Centuries
  if (seconds >= TIME_UNITS.CENTURY) {
    const centuries = Math.round(seconds / TIME_UNITS.CENTURY);
    return `${centuries.toLocaleString()} ${centuries === 1 ? 'century' : 'centuries'}`;
  }

  // Decades
  if (seconds >= TIME_UNITS.DECADE) {
    const decades = Math.round(seconds / TIME_UNITS.DECADE);
    return `${decades.toLocaleString()} ${decades === 1 ? 'decade' : 'decades'}`;
  }

  // Years
  if (seconds >= TIME_UNITS.YEAR) {
    const years = (seconds / TIME_UNITS.YEAR).toFixed(1);
    return `${years} ${parseFloat(years) === 1 ? 'year' : 'years'}`;
  }

  // Months
  if (seconds >= TIME_UNITS.MONTH) {
    const months = Math.round(seconds / TIME_UNITS.MONTH);
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }

  // Weeks
  if (seconds >= TIME_UNITS.WEEK) {
    const weeks = Math.round(seconds / TIME_UNITS.WEEK);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  }

  // Days
  if (seconds >= TIME_UNITS.DAY) {
    const days = Math.round(seconds / TIME_UNITS.DAY);
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }

  // Hours
  if (seconds >= TIME_UNITS.HOUR) {
    const hours = Math.round(seconds / TIME_UNITS.HOUR);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }

  // Minutes
  if (seconds >= TIME_UNITS.MINUTE) {
    const minutes = Math.round(seconds / TIME_UNITS.MINUTE);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }

  // Seconds
  if (seconds >= 1) {
    const secs = Math.round(seconds);
    return `${secs} ${secs === 1 ? 'second' : 'seconds'}`;
  }

  // Less than a second
  return 'instant';
}

/**
 * Determines severity level based on crack time
 * @param seconds - Time in seconds
 * @returns Severity level
 */
export function getCrackTimeSeverity(
  seconds: number
): 'instant' | 'very-fast' | 'fast' | 'moderate' | 'slow' | 'very-slow' {
  if (seconds < 1) return 'instant'; // Less than 1 second
  if (seconds < TIME_UNITS.HOUR) return 'very-fast'; // Less than 1 hour
  if (seconds < TIME_UNITS.DAY) return 'fast'; // Less than 1 day
  if (seconds < TIME_UNITS.MONTH) return 'moderate'; // Less than 1 month
  if (seconds < TIME_UNITS.YEAR) return 'slow'; // Less than 1 year
  return 'very-slow'; // 1 year or more
}

/**
 * Calculates time to crack a password
 * @param poolSize - Size of character pool
 * @param length - Length of password
 * @param algorithm - Hash algorithm to use (default: MD5)
 * @returns Complete crack time analysis
 */
export function calculateCrackTime(
  poolSize: number,
  length: number,
  algorithm: HashAlgorithm = DEFAULT_HASH_ALGORITHM
): CrackTimeResult {
  const combinations = calculateCombinations(poolSize, length);
  const hashRate = GPU_HASH_RATES[algorithm];
  const seconds = calculateCrackTimeSeconds(combinations, hashRate);
  const formatted = formatCrackTime(seconds);
  const severity = getCrackTimeSeverity(seconds);

  return {
    seconds,
    formatted,
    severity,
    combinations,
    hashRate,
    algorithm,
  };
}

/**
 * Calculates crack time for multiple hash algorithms
 * Useful for showing comparison between secure and insecure hashing
 * @param poolSize - Size of character pool
 * @param length - Length of password
 * @returns Map of algorithm to crack time results
 */
export function calculateCrackTimeMultipleAlgorithms(
  poolSize: number,
  length: number
): Record<HashAlgorithm, CrackTimeResult> {
  const algorithms: HashAlgorithm[] = Object.keys(GPU_HASH_RATES) as HashAlgorithm[];
  const results: Partial<Record<HashAlgorithm, CrackTimeResult>> = {};

  for (const algorithm of algorithms) {
    results[algorithm] = calculateCrackTime(poolSize, length, algorithm);
  }

  return results as Record<HashAlgorithm, CrackTimeResult>;
}
