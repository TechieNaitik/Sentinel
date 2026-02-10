import { describe, it, expect } from 'vitest';
import { detectPatterns } from './complexity';

describe('Complexity Analysis', () => {
    describe('detectPatterns', () => {
        it('should detect sequential numbers', () => {
            const result = detectPatterns('1234');
            const pattern = result.patterns.find(p => p.description.includes('Sequential pattern'));
            expect(pattern).toBeDefined();
            expect(result.hasWeakPatterns).toBe(true);
        });

        it('should detect repetitive characters', () => {
            const result = detectPatterns('aaaa');
            const pattern = result.patterns.find(p => p.description.includes('Repetitive characters'));
            expect(pattern).toBeDefined();
        });

        it('should detect keyboard walks', () => {
            const result = detectPatterns('qwerty');
            const pattern = result.patterns.find(p => p.description.includes('Keyboard walk'));
            expect(pattern).toBeDefined();
        });

        it('should handle complex mixed passwords', () => {
            const result = detectPatterns('P@ssword123!');
            // '123' might trigger sequential, but 'password' might trigger dictionary... 
            // Depending on complexity.ts complexity:
            // Assuming pattern detection works for sequential, dictionary, etc.
            expect(result.patterns.length).toBeGreaterThan(0);
        });
        
        it('should return empty patterns for random strong password', () => {
            const result = detectPatterns('X9$mK#pL2@qR');
            expect(result.hasWeakPatterns).toBe(false);
            expect(result.patterns.length).toBe(0);
        });
        
        it('should calculate complexity score', () => {
            const result = detectPatterns('veryweakpassword');
            expect(result.score).toBeLessThan(50); // Just a generic check
        });
    });
});
