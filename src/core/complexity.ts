/**
 * Pattern Detection Module
 * Detects weak patterns in passwords including:
 * - Sequential patterns (1234, abcd)
 * - Repetitive characters (aaaa, 1111)
 * - Keyboard walks (qwerty, asdfgh)
 * - Common dictionary words
 */

/**
 * Interface for pattern detection results
 */
export interface PatternDetectionResult {
  hasWeakPatterns: boolean;
  patterns: DetectedPattern[];
  score: number; // 0-100, where 100 is no patterns detected
}

/**
 * Interface for individual detected patterns
 */
export interface DetectedPattern {
  type: 'sequential' | 'repetitive' | 'keyboard-walk' | 'dictionary-word' | 'common-password';
  description: string;
  severity: 'low' | 'medium' | 'high';
  match?: string; // The actual matched pattern
}

/**
 * Common keyboard walks (QWERTY layout)
 */
const KEYBOARD_WALKS = [
  'qwerty', 'qwertyuiop', 'asdfgh', 'asdfghjkl', 'zxcvbn', 'zxcvbnm',
  'qazwsx', 'wsxedc', 'edcrfv', 'rfvtgb', 'tgbyhn', 'yhnujm',
  '1qaz', '2wsx', '3edc', '4rfv', '5tgb', '6yhn', '7ujm', '8ik', '9ol', '0p',
  'qwe', 'wer', 'ert', 'rty', 'tyu', 'yui', 'uio', 'iop',
  'asd', 'sdf', 'dfg', 'fgh', 'ghj', 'hjk', 'jkl',
  'zxc', 'xcv', 'cvb', 'vbn', 'bnm',
];

/**
 * Common dictionary words and weak passwords
 */
const COMMON_WORDS = [
  'password', 'pass', 'admin', 'user', 'login', 'welcome', 'monkey',
  'dragon', 'master', 'shadow', 'letmein', 'trustno1', 'starwars',
  'football', 'baseball', 'basketball', 'soccer', 'hockey',
  'love', 'secret', 'god', 'princess', 'sunshine', 'iloveyou',
  'hello', 'freedom', 'whatever', 'ninja', 'mustang', 'michael',
  'jordan', 'superman', 'batman', 'thomas', 'robert', 'william',
  'january', 'february', 'march', 'april', 'may', 'june', 'july',
  'august', 'september', 'october', 'november', 'december',
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

/**
 * Detects sequential numeric patterns (e.g., 1234, 5678, 9876)
 */
function detectSequentialNumbers(password: string): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  const lowerPassword = password.toLowerCase();

  // Check for ascending sequences (1234, 2345, etc.)
  const ascendingRegex = /(?:0123|1234|2345|3456|4567|5678|6789)/g;
  const ascendingMatches = lowerPassword.match(ascendingRegex);
  if (ascendingMatches) {
    patterns.push({
      type: 'sequential',
      description: 'Contains sequential numbers (e.g., 1234)',
      severity: 'high',
      match: ascendingMatches[0],
    });
  }

  // Check for descending sequences (9876, 8765, etc.)
  const descendingRegex = /(?:9876|8765|7654|6543|5432|4321|3210)/g;
  const descendingMatches = lowerPassword.match(descendingRegex);
  if (descendingMatches) {
    patterns.push({
      type: 'sequential',
      description: 'Contains reverse sequential numbers (e.g., 4321)',
      severity: 'high',
      match: descendingMatches[0],
    });
  }

  return patterns;
}

/**
 * Detects sequential alphabetic patterns (e.g., abcd, xyz)
 */
function detectSequentialLetters(password: string): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  const lowerPassword = password.toLowerCase();

  // Check for ascending letter sequences
  const ascendingRegex = /(?:abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz)/g;
  const ascendingMatches = lowerPassword.match(ascendingRegex);
  if (ascendingMatches) {
    patterns.push({
      type: 'sequential',
      description: 'Contains sequential letters (e.g., abcd)',
      severity: 'high',
      match: ascendingMatches[0],
    });
  }

  // Check for descending letter sequences
  const descendingRegex = /(?:zyxw|yxwv|xwvu|wvut|vuts|utsr|tsrq|srqp|rqpo|qpon|ponm|onml|nmlk|mlkj|lkji|kjih|jihg|ihgf|hgfe|gfed|fedc|edcb|dcba)/g;
  const descendingMatches = lowerPassword.match(descendingRegex);
  if (descendingMatches) {
    patterns.push({
      type: 'sequential',
      description: 'Contains reverse sequential letters (e.g., dcba)',
      severity: 'high',
      match: descendingMatches[0],
    });
  }

  return patterns;
}

/**
 * Detects repetitive characters (e.g., aaaa, 1111, !!!!)
 */
function detectRepetitiveCharacters(password: string): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];

  // Check for 3 or more repeated characters
  const repetitiveRegex = /(.)\1{2,}/g;
  const matches = password.match(repetitiveRegex);

  if (matches) {
    patterns.push({
      type: 'repetitive',
      description: `Contains repeated characters (e.g., ${matches[0]})`,
      severity: matches[0].length >= 4 ? 'high' : 'medium',
      match: matches[0],
    });
  }

  return patterns;
}

/**
 * Detects keyboard walk patterns (e.g., qwerty, asdfgh)
 */
function detectKeyboardWalks(password: string): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  const lowerPassword = password.toLowerCase();

  for (const walk of KEYBOARD_WALKS) {
    if (lowerPassword.includes(walk)) {
      patterns.push({
        type: 'keyboard-walk',
        description: `Contains keyboard pattern (${walk})`,
        severity: walk.length >= 5 ? 'high' : 'medium',
        match: walk,
      });
      break; // Only report the first keyboard walk found
    }
  }

  return patterns;
}

/**
 * Detects common dictionary words and weak passwords
 */
function detectDictionaryWords(password: string): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  const lowerPassword = password.toLowerCase();

  for (const word of COMMON_WORDS) {
    if (lowerPassword.includes(word)) {
      patterns.push({
        type: 'dictionary-word',
        description: `Contains common word or phrase (${word})`,
        severity: 'high',
        match: word,
      });
      break; // Only report the first dictionary word found
    }
  }

  return patterns;
}

/**
 * Calculates a complexity score based on detected patterns
 * @param patterns - Array of detected patterns
 * @returns Score from 0-100 (100 = no patterns, 0 = many severe patterns)
 */
function calculateComplexityScore(patterns: DetectedPattern[]): number {
  if (patterns.length === 0) {
    return 100;
  }

  let deductions = 0;

  for (const pattern of patterns) {
    switch (pattern.severity) {
      case 'high':
        deductions += 30;
        break;
      case 'medium':
        deductions += 20;
        break;
      case 'low':
        deductions += 10;
        break;
    }
  }

  const score = Math.max(0, 100 - deductions);
  return score;
}

/**
 * Performs complete pattern detection analysis on a password
 * @param password - The password to analyze
 * @returns Pattern detection results
 */
export function detectPatterns(password: string): PatternDetectionResult {
  if (!password || password.length === 0) {
    return {
      hasWeakPatterns: false,
      patterns: [],
      score: 100,
    };
  }

  const allPatterns: DetectedPattern[] = [
    ...detectSequentialNumbers(password),
    ...detectSequentialLetters(password),
    ...detectRepetitiveCharacters(password),
    ...detectKeyboardWalks(password),
    ...detectDictionaryWords(password),
  ];

  const score = calculateComplexityScore(allPatterns);

  return {
    hasWeakPatterns: allPatterns.length > 0,
    patterns: allPatterns,
    score,
  };
}
