import { describe, it, expect } from 'vitest';
import { calculateCrackTime, formatCrackTime } from './crackTime';

describe('Crack Time Calculation', () => {
    describe('formatCrackTime', () => {
        it('should format seconds to readable strings', () => {
            expect(formatCrackTime(0.5)).toBe('instant');
            expect(formatCrackTime(30)).toBe('30 seconds');
            expect(formatCrackTime(120)).toBe('2 minutes');
            expect(formatCrackTime(7200)).toBe('2 hours');
            expect(formatCrackTime(86400)).toBe('1 day');
            expect(formatCrackTime(2592000)).toBe('1 month'); 
            expect(formatCrackTime(31536000)).toBe('1 year');
            expect(formatCrackTime(315360000)).toBe('1 decade');
        });

        it('should handle large values gracefully', () => {
            expect(formatCrackTime(999999999999999)).toBe('centuries+');
        });
    });

    describe('calculateCrackTime', () => {
        it('should estimate crack time correctly', () => {
            const result = calculateCrackTime(10, 4); // 10^4 = 10000 combinations
            // Assuming default hash rate.
            expect(result.combinations).toBe(10000);
            expect(result.severity).toBe('instant'); // Or 'very-weak'
        });

        it('should scale appropriately for strength', () => {
            const weak = calculateCrackTime(10, 4);
            const strong = calculateCrackTime(62, 20);
            
            expect(strong.combinations).toBeGreaterThan(weak.combinations);
            expect(strong.severity).not.toBe('instant');
        });
    });
});
