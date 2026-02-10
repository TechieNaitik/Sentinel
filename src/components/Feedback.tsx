/**
 * Feedback Component
 * Displays actionable feedback and detected weak patterns
 * Features:
 * - Shows specific issues (dictionary words, repeated characters)
 * - Provides improvement tips from zxcvbn
 * - Uses color coding for severity
 * - Animated entry
 */

import { motion, AnimatePresence } from 'framer-motion';
import { DetectedPattern } from '../core/complexity';

interface FeedbackProps {
  patterns: DetectedPattern[];
  zxcvbnFeedback: {
    warning: string;
    suggestions: string[];
  };
  strength: 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong' | 'none';
}

export default function Feedback({ patterns, zxcvbnFeedback, strength }: FeedbackProps) {
  const hasIssues = patterns.length > 0 || !!zxcvbnFeedback.warning || zxcvbnFeedback.suggestions.length > 0;
  const isStrong = strength === 'strong' || strength === 'very-strong';

  if (strength === 'none' || (!hasIssues && !isStrong)) {
    return null;
  }

  return (
    <div className="space-y-4 mt-6">
      <AnimatePresence>
        {/* Detected Patterns Section */}
        {patterns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h3 className="text-label text-slate/70 mb-2">Security Risks Detected</h3>
            <ul className="space-y-2">
              {patterns.map((pattern, index) => (
                <motion.li
                  key={`pattern-${index}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    flex items-start gap-2 p-3 rounded-lg text-sm
                    ${pattern.severity === 'high' ? 'bg-terracotta/10 text-terracotta' : 'bg-orange/10 text-orange'}
                  `}
                >
                  <span className="mt-0.5">
                    {pattern.severity === 'high' ? '⚠️' : 'wv'}
                  </span>
                  <div>
                    <span className="font-medium block mb-0.5">
                      {pattern.description}
                    </span>
                    {pattern.match && (
                      <span className="text-xs opacity-75 font-mono bg-white/50 px-1 rounded">
                        Match: "{pattern.match}"
                      </span>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Improved Suggestions Section (zxcvbn) */}
        {(zxcvbnFeedback.warning || zxcvbnFeedback.suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate/5 rounded-lg p-4 border border-slate/10"
          >
            <h3 className="text-label text-slate/70 mb-3">Recommendations</h3>
            
            {zxcvbnFeedback.warning && (
              <div className="mb-3 text-terracotta font-medium flex items-center gap-2">
                <span>🚫</span>
                {zxcvbnFeedback.warning}
              </div>
            )}

            <ul className="space-y-2">
              {zxcvbnFeedback.suggestions.map((suggestion, index) => (
                <motion.li
                  key={`suggestion-${index}`}
                  className="flex items-start gap-2 text-slate/80 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                >
                  <span className="text-slate mt-0.5">💡</span>
                  {suggestion}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Positive Reinforcement for Strong Passwords */}
        {strength === 'strong' || strength === 'very-strong' ? (
           <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="text-center p-4 bg-green-50 text-green-700 rounded-lg border border-green-100"
           >
             <span className="text-2xl block mb-1">🎉</span>
             <p className="font-medium">Excellent password! This is hard to crack.</p>
           </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
