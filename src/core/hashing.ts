/**
 * Secure Hashing Demonstration Module
 * demonstrating secure password storage practices
 * Uses PBKDF2 (Password-Based Key Derivation Function 2) which is
 * standard in Web Crypto API and conceptually similar to Argon2/Bcrypt
 * (uses Salt + Iterations + HMAC)
 */

export interface HashingResult {
  salt: string;
  hash: string;
  iterations: number;
  algorithm: string;
  timeTaken: number;
}

/**
 * Generates a random salt
 */
export function generateSalt(length: number = 16): Uint8Array {
  const salt = new Uint8Array(length);
  crypto.getRandomValues(salt);
  return salt;
}

/**
 * Converts buffer to Hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Demonstrates secure hashing using PBKDF2
 * @param password Password to hash
 * @param iterations Number of iterations (work factor)
 */
export async function demonstrateHashing(
  password: string,
  iterations: number = 100000
): Promise<HashingResult> {
  const start = performance.now();

  // 1. Generate Salt
  const salt = generateSalt(16);

  // 2. Import Password Key
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // 3. Derive Key (Hash)
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  // Export the key to get the raw bytes
  const rawKey = await crypto.subtle.exportKey('raw', key);
  const hashHex = bufferToHex(rawKey);
  const saltHex = bufferToHex(salt);

  const end = performance.now();

  return {
    salt: saltHex,
    hash: hashHex,
    iterations,
    algorithm: 'PBKDF2-HMAC-SHA256',
    timeTaken: end - start,
  };
}
