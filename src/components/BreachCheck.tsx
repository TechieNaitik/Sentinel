/**
 * Breach Check Component
 * Allows users to check if their password has been exposed in data breaches
 * Uses k-Anonymity (client-side hashing + prefix search) for privacy
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkBreach, BreachCheckResult } from '../core/breachCheck';

interface BreachCheckProps {
  password: string;
}

export default function BreachCheck({ password }: BreachCheckProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BreachCheckResult | null>(null);

  const handleCheck = async () => {
    if (!password) return;
    setLoading(true);
    setResult(null);
    
    // API Check
    const checkResult = await checkBreach(password);
    setResult(checkResult);
    setLoading(false);
  };

  if (!password) return null;

  return (
    <div className="mt-8 pt-6 border-t border-slate/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate">Breach Check</h3>
        <span className="text-xs text-slate/50 bg-stone px-2 py-0.5 rounded">
          Privacy-First (k-Anonymity)
        </span>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={handleCheck}
          disabled={loading || !password}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${loading ? 'bg-slate/50 cursor-wait' : 'bg-slate text-white hover:bg-slate/90'}
          `}
        >
          {loading ? 'Checking...' : 'Check HaveIBeenPwned'}
        </button>
        
        <p className="text-xs text-slate/60 flex-1">
          Checks against 600M+ exposed passwords without sending your full password.
        </p>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            {result.error ? (
              <div className="p-4 rounded-lg border bg-orange/10 border-orange/20 text-orange">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">⚠️</span>
                  <div>
                    <h4 className="font-bold">Check Failed</h4>
                    <p className="text-sm mt-1 opacity-90">{result.error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-4 rounded-lg border ${
                result.isBreached 
                  ? 'bg-terracotta/10 border-terracotta/20 text-terracotta' 
                  : 'bg-green-50 border-green-100 text-green-700'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">
                    {result.isBreached ? '⚠️' : '✅'}
                  </span>
                  <div>
                    <h4 className="font-bold">
                      {result.isBreached ? 'Breach Found' : 'No Breaches Found'}
                    </h4>
                    <p className="text-sm mt-1 opacity-90">
                      {result.isBreached
                        ? `This password has appeared in ${result.count.toLocaleString()} known data breaches. You should not use it.`
                        : 'This password has not been found in known data breaches.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
