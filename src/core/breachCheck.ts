/**
 * Breach Check Module
 * Checks if a password has been exposed in data breaches using HaveIBeenPwned API
 * Implements k-Anonymity model for Zero-Knowledge privacy:
 * 1. Hash password with SHA-1 locally (client-side)
 * 2. Send only first 5 characters of hash to API
 * 3. Receive list of suffixes
 * 4. Check if rest of hash exists in the list locally
 */

export interface BreachCheckResult {
  isBreached: boolean;
  count: number;
  error?: string;
}

/**
 * Validates if the password has been breached
 * @param password The password to check
 * @returns {Promise<BreachCheckResult>} Result containing breach status and count
 */
export async function checkBreach(password: string): Promise<BreachCheckResult> {
  if (!password) {
    return { isBreached: false, count: 0 };
  }

  try {
    // 1. Hash password with SHA-1
    const buffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    // 2. Extract prefix (5 chars) and suffix
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);

    // 3. Call HIBP API with k-Anonymity prefix
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const text = await response.text();

    // 4. Parse response to find matching suffix
    // Response format: SUFFIX:COUNT (one per line)
    const lines = text.split('\n');
    let count = 0;

    for (const line of lines) {
      const [lineSuffix, lineCount] = line.trim().split(':');
      if (lineSuffix === suffix) {
        count = parseInt(lineCount, 10);
        break;
      }
    }

    return {
      isBreached: count > 0,
      count,
    };

  } catch (error) {
    console.error('Breach check failed:', error);
    return {
      isBreached: false,
      count: 0,
      error: 'Failed to verify breach status',
    };
  }
}
