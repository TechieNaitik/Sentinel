import { describe, it, expect } from 'vitest';
import { analyzeEntropy, calculateEntropy, detectCharacterPoolSize } from './entropy';

describe('Entropy Calculation', () => {
  describe('detectCharacterPoolSize', () => {
    it('should detect numbers only', () => {
      expect(detectCharacterPoolSize('12345')).toBe(10);
    });

    it('should detect lowercase only', () => {
      expect(detectCharacterPoolSize('abcde')).toBe(26);
    });

    it('should detect uppercase only', () => {
      expect(detectCharacterPoolSize('ABCDE')).toBe(26);
    });

    it('should detect alphanumeric (mixed case)', () => {
      expect(detectCharacterPoolSize('AbCdE')).toBe(52);
    });

    it('should detect alphanumeric + numbers', () => {
      expect(detectCharacterPoolSize('Ab12')).toBe(62);
    });

    it('should detect alphanumeric + symbols', () => {
      expect(detectCharacterPoolSize('Ab1!')).toBe(95);
    });

    it('should handle empty string', () => {
        expect(detectCharacterPoolSize('')).toBe(0); // or whatever default
    });
  });

  describe('calculateEntropy', () => {
    it('should calculate entropy for 1234', () => {
      // 4 * log2(10) = 4 * 3.3219 approx 13.29
      expect(calculateEntropy('1234')).toBeCloseTo(13.29, 1);
    });

    it('should calculate entropy for abcd', () => {
      // 4 * log2(26) = 4 * 4.7004 approx 18.80
      expect(calculateEntropy('abcd')).toBeCloseTo(18.80, 1);
    });
  });

  describe('analyzeEntropy', () => {
      it('should return correct object structure for very weak password', () => {
          const result = analyzeEntropy('1234');
          expect(result.length).toBe(4);
          expect(result.poolSize).toBe(10);
          expect(result.strength).toBe('very-weak');
      });

      it('should identify strong passwords', () => {
         const result = analyzeEntropy('CorrectHorseBatteryStaple!');
         expect(result.strength).toBe('very-strong'); // Assuming threshold
      });
  });
});
