import { describe, it, expect } from 'vitest';
import { analyzeEntropy } from '../core/entropy';
import { detectPatterns } from '../core/complexity';
import { calculateCrackTime } from '../core/crackTime';
import { analyzeWithZxcvbn } from '../core/zxcvbnWrapper';

describe('Performance Tests', () => {
    it('should complete full analysis of a weak password in < 200ms', () => {
        const start = performance.now();
        const password = 'password123';
        
        analyzeEntropy(password);
        detectPatterns(password);
        calculateCrackTime(10, password.length);
        analyzeWithZxcvbn(password);
        
        const end = performance.now();
        const duration = end - start;
        console.log(`Analysis duration (weak): ${duration}ms`);
        expect(duration).toBeLessThan(200);
    });

    it('should complete full analysis of a long password (1000 chars) in < 500ms', () => {
        const start = performance.now();
        const password = 'a'.repeat(1000);
        
        analyzeEntropy(password);
        detectPatterns(password);
        calculateCrackTime(26, password.length);
        analyzeWithZxcvbn(password); // zxcvbn might be slow on very long strings
        
        const end = performance.now();
        const duration = end - start;
        console.log(`Analysis duration (long): ${duration}ms`);
        // zxcvbn is the bottleneck here usually.
        expect(duration).toBeLessThan(500); 
    });
});
