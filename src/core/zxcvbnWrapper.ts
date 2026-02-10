/**
 * zxcvbn Wrapper Module
 * Integrates the zxcvbn password strength estimation library
 */

import zxcvbn, { ZXCVBNResult, ZXCVBNScore } from 'zxcvbn';

/**
 * Interface for zxcvbn analysis results (mapped to our internal structure)
 */
export interface ZxcvbnAnalysisResult {
  score: ZXCVBNScore; // 0-4 score from zxcvbn
  strength: 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';
  crackTimeSeconds: number;
  crackTimeDisplay: string;
  feedback: {
    warning: string;
    suggestions: string[];
  };
  guesses: number; // Number of guesses required
  guessesLog10: number; // Log10 of guesses
  sequence: Array<{
    pattern: string;
    token: string;
    matched_word?: string;
  }>;
}

/**
 * Maps zxcvbn score (0-4) to our internal strength levels
 * @param score - zxcvbn score (0-4)
 * @returns Internal strength level
 */
function mapZxcvbnScoreToStrength(
  score: ZXCVBNScore
): 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong' {
  switch (score) {
    case 0:
      return 'very-weak';
    case 1:
      return 'weak';
    case 2:
      return 'fair';
    case 3:
      return 'strong';
    case 4:
      return 'very-strong';
    default:
      return 'very-weak';
  }
}

/**
 * Analyzes a password using the zxcvbn library
 * @param password - The password to analyze
 * @param userInputs - Optional array of user-specific inputs (e.g., username, email)
 * @returns Mapped zxcvbn analysis results
 */
export function analyzeWithZxcvbn(
  password: string,
  userInputs?: string[]
): ZxcvbnAnalysisResult {
  // Handle empty password
  if (!password || password.length === 0) {
    return {
      score: 0,
      strength: 'very-weak',
      crackTimeSeconds: 0,
      crackTimeDisplay: 'instant',
      feedback: {
        warning: 'Password is empty',
        suggestions: ['Enter a password to analyze'],
      },
      guesses: 0,
      guessesLog10: 0,
      sequence: [],
    };
  }

  try {
    // Call zxcvbn with optional user inputs
    const result: ZXCVBNResult = zxcvbn(password, userInputs);

    // Map to our internal structure
    return {
      score: result.score,
      strength: mapZxcvbnScoreToStrength(result.score),
      crackTimeSeconds: Number(result.crack_times_seconds.offline_fast_hashing_1e10_per_second),
      crackTimeDisplay: String(result.crack_times_display.offline_fast_hashing_1e10_per_second),
      feedback: {
        warning: result.feedback.warning || '',
        suggestions: result.feedback.suggestions || [],
      },
      guesses: result.guesses,
      guessesLog10: result.guesses_log10,
      sequence: result.sequence.map((seq) => ({
        pattern: seq.pattern,
        token: seq.token,
        matched_word: (seq as any).matched_word,
      })),
    };
  } catch (error) {
    // Fallback if zxcvbn fails
    console.error('zxcvbn analysis failed:', error);
    return {
      score: 0,
      strength: 'very-weak',
      crackTimeSeconds: 0,
      crackTimeDisplay: 'unknown',
      feedback: {
        warning: 'Analysis failed',
        suggestions: ['Try a different password'],
      },
      guesses: 0,
      guessesLog10: 0,
      sequence: [],
    };
  }
}

/**
 * Compares manual entropy calculation with zxcvbn results
 * @param manualEntropy - Entropy calculated using Shannon formula
 * @param zxcvbnResult - Results from zxcvbn analysis
 * @returns Comparison object
 */
export function compareEntropyWithZxcvbn(
  manualEntropy: number,
  zxcvbnResult: ZxcvbnAnalysisResult
): {
  manualEntropy: number;
  zxcvbnGuessesLog10: number;
  difference: number;
  recommendation: string;
} {
  // Convert zxcvbn guesses to bits (log2)
  const zxcvbnEntropyBits = zxcvbnResult.guessesLog10 * Math.log2(10);

  const difference = Math.abs(manualEntropy - zxcvbnEntropyBits);

  let recommendation = '';
  if (zxcvbnEntropyBits < manualEntropy * 0.5) {
    recommendation =
      'zxcvbn detected patterns that significantly weaken this password. Consider using a more random password.';
  } else if (zxcvbnEntropyBits < manualEntropy * 0.8) {
    recommendation =
      'zxcvbn detected some patterns. The password is weaker than the entropy suggests.';
  } else {
    recommendation = 'Password strength is consistent with entropy calculation.';
  }

  return {
    manualEntropy,
    zxcvbnGuessesLog10: zxcvbnResult.guessesLog10,
    difference,
    recommendation,
  };
}

/**
 * Gets actionable feedback for improving password strength
 * @param zxcvbnResult - Results from zxcvbn analysis
 * @returns Array of actionable suggestions
 */
export function getActionableFeedback(zxcvbnResult: ZxcvbnAnalysisResult): string[] {
  const feedback: string[] = [];

  // Add warning if present
  if (zxcvbnResult.feedback.warning) {
    feedback.push(`⚠️ ${zxcvbnResult.feedback.warning}`);
  }

  // Add suggestions
  if (zxcvbnResult.feedback.suggestions.length > 0) {
    feedback.push(...zxcvbnResult.feedback.suggestions.map((s) => `💡 ${s}`));
  }

  // Add general suggestions based on score
  if (zxcvbnResult.score < 3) {
    if (feedback.length === 0) {
      feedback.push('💡 Use a longer password (12+ characters)');
      feedback.push('💡 Mix uppercase, lowercase, numbers, and symbols');
      feedback.push('💡 Avoid common words and patterns');
    }
  }

  return feedback;
}
