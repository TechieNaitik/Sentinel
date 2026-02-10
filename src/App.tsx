/**
 * Main Application Component
 * Integrates all UI components with the core logic layer
 * Features:
 * - Real-time password analysis
 * - State management for all metrics
 * - Debounced analysis for performance
 * - Responsive layout via Dashboard
 * - Advanced Tools: Breach Check, Secure Hashing, Passphrase Generator
 */

import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PasswordInput from './components/PasswordInput';
import StrengthMeter from './components/StrengthMeter';
import InfoTiles from './components/InfoTiles';
import Feedback from './components/Feedback';
import PassphraseGenerator from './components/PassphraseGenerator';
import BreachCheck from './components/BreachCheck';
import HashingVisualizer from './components/HashingVisualizer';

// Core Logic Imports
import { analyzeEntropy, EntropyResult } from './core/entropy';
import { detectPatterns, PatternDetectionResult } from './core/complexity';
import { calculateCrackTime, CrackTimeResult } from './core/crackTime';
import { analyzeWithZxcvbn, ZxcvbnAnalysisResult } from './core/zxcvbnWrapper';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  // State for password input
  const [password, setPassword] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // State for analysis results
  const [entropyResult, setEntropyResult] = useState<EntropyResult | null>(null);
  const [patternResult, setPatternResult] = useState<PatternDetectionResult | null>(null);
  const [crackTimeResult, setCrackTimeResult] = useState<CrackTimeResult | null>(null);
  const [zxcvbnResult, setZxcvbnResult] = useState<ZxcvbnAnalysisResult | null>(null);

  // Derived state for UI feedback
  const isVeryWeak = (entropyResult?.entropy ?? 0) < 20 && password.length > 0;

  // Real-time analysis effect
  useEffect(() => {
    if (!password) {
      // Reset state if password is empty
      setEntropyResult(null);
      setPatternResult(null);
      setCrackTimeResult(null);
      setZxcvbnResult(null);
      return;
    }

    // Perform analysis
    const entropy = analyzeEntropy(password);
    const patterns = detectPatterns(password);
    const crackTime = calculateCrackTime(entropy.poolSize, entropy.length);
    const zxcvbn = analyzeWithZxcvbn(password);

    // Update state
    setEntropyResult(entropy);
    setPatternResult(patterns);
    setCrackTimeResult(crackTime);
    setZxcvbnResult(zxcvbn);

  }, [password]);

  const handlePassphraseSelect = (newPassphrase: string) => {
    setPassword(newPassphrase);
    setShowGenerator(false); // Close generator after selection
  };

  return (
    <Dashboard>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowGenerator(!showGenerator)}
            className="text-sm font-medium text-slate text-underline flex items-center gap-1 hover:text-slate/80 transition-colors"
          >
            {showGenerator ? 'Close Generator' : 'Need a stronger password?'}
          </button>
        </div>

        <AnimatePresence>
          {showGenerator && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <PassphraseGenerator onSelect={handlePassphraseSelect} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Input */}
        <PasswordInput
          value={password}
          onChange={setPassword}
          isVeryWeak={isVeryWeak}
          placeholder="Type a password to analyze..."
        />

        {/* Strength Meter */}
        <StrengthMeter 
          strength={entropyResult?.strength ?? 'none'} 
        />

        {/* Info Tiles (Metrics) */}
        <InfoTiles
          crackTime={crackTimeResult?.formatted}
          entropy={entropyResult?.entropy}
          patternsDetected={patternResult?.hasWeakPatterns}
          patternsCount={patternResult?.patterns?.length}
        />

        {/* Detailed Feedback */}
        {patternResult && zxcvbnResult && (
          <Feedback 
            patterns={patternResult.patterns}
            zxcvbnFeedback={zxcvbnResult.feedback}
            strength={entropyResult?.strength ?? 'none'}
          />
        )}

        {/* Advanced Tools Section */}
        {password && (
          <div className="pt-8 space-y-8">
            <BreachCheck password={password} />
            
            <div className="border-t border-slate/10 pt-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-left font-medium text-slate hover:bg-slate/5 p-2 rounded transition-colors"
              >
                <span>Advanced: Secure Hash Visualization</span>
                <span className="text-xl transform transition-transform duration-200" style={{ rotate: showAdvanced ? '180deg' : '0deg' }}>
                  ⌄
                </span>
              </button>
              
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <HashingVisualizer password={password} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
}
