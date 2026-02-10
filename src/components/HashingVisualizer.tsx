/**
 * Hashing Visualizer Component
 * Demonstrates secure password storage using PBKDF2 with Salt and Iterations
 * Educational tool to explain why simple hashes are insufficient
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { demonstrateHashing, HashingResult } from '../core/hashing';

interface HashingVisualizerProps {
  password: string;
}

export default function HashingVisualizer({ password }: HashingVisualizerProps) {
  const [isHashing, setIsHashing] = useState(false);
  const [result, setResult] = useState<HashingResult | null>(null);

  const handleHash = async () => {
    if (!password) return;
    setIsHashing(true);
    // Add artificial delay to make it feel like "work" is happening visually
    // The actual hashing takes some time (~10-50ms depending on hardware/iterations)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const hashResult = await demonstrateHashing(password);
    setResult(hashResult);
    setIsHashing(false);
  };

  return (
    <div className="bg-white border-2 border-slate/10 rounded-xl p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate">Secure Hashing Demo</h3>
        <span className="text-xs bg-slate/10 px-2 py-1 rounded text-slate/60 font-mono">
          PBKDF2-HMAC-SHA256
        </span>
      </div>

      <p className="text-sm text-slate/70 mb-4">
        See how your password should be stored securely using a random Salt and 100,000 iterations.
      </p>

      <button
        onClick={handleHash}
        disabled={isHashing || !password}
        className={`
          w-full py-2 rounded-lg font-medium transition-all mb-4
          ${isHashing 
            ? 'bg-slate/50 cursor-wait' 
            : 'bg-stone hover:bg-slate/10 text-slate'}
        `}
      >
        {isHashing ? 'Hashing (100k iterations)...' : 'Generate Secure Hash'}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {/* Salt Display */}
            <div className="bg-slate/5 p-3 rounded-lg border border-slate/10">
              <span className="text-xs uppercase tracking-wider text-slate/50 block mb-1">
                Random Salt (16 bytes)
              </span>
              <code className="text-xs font-mono text-terracotta break-all block">
                {result.salt}
              </code>
            </div>

            {/* Hash Display */}
            <div className="bg-slate/5 p-3 rounded-lg border border-slate/10">
              <span className="text-xs uppercase tracking-wider text-slate/50 block mb-1">
                Derived Key (Hash)
              </span>
              <code className="text-sm font-mono text-slate break-all block">
                {result.hash}
              </code>
            </div>

            {/* Metrics */}
            <div className="flex gap-4 text-xs text-slate/60 pt-2">
              <span>⏱️ Time: {result.timeTaken.toFixed(2)}ms</span>
              <span>🔄 Iterations: {result.iterations.toLocaleString()}</span>
            </div>
            
            <p className="text-xs text-slate/50 italic mt-2">
              Note: The salt ensures identical passwords have different hashes.
              Iterations make it slow for attackers to crack.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
