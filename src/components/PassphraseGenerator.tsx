/**
 * Passphrase Generator Component
 * Allow users to generate high-entropy passphrases
 * Features:
 * - Customize word count (3-8)
 * - Customize separator (hyphen, space, period, underscore)
 * - Show entropy of generated phrase
 * - Copy to clipboard functionality
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { generatePassphrase, calculatePassphraseEntropy } from '../core/passphraseGenerator';

interface PassphraseGeneratorProps {
  onSelect: (passphrase: string) => void;
}

export default function PassphraseGenerator({ onSelect }: PassphraseGeneratorProps) {
  const [passphrase, setPassphrase] = useState('');
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [includeNumber, setIncludeNumber] = useState(false);
  const [capitalize, setCapitalize] = useState(true);
  const [copied, setCopied] = useState(false);

  const entropy = calculatePassphraseEntropy(wordCount);

  const handleGenerate = () => {
    const newPassphrase = generatePassphrase({
      wordCount,
      separator,
      capitalize,
      includeNumber,
    });
    setPassphrase(newPassphrase);
    setCopied(false);
  };

  const handleCopy = () => {
    if (passphrase) {
      navigator.clipboard.writeText(passphrase);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onSelect(passphrase);
    }
  };

  return (
    <div className="bg-white border-2 border-slate/10 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate">Passphrase Generator</h3>
        <span className="text-xs font-mono bg-slate/10 px-2 py-1 rounded text-slate/70">
          ~{Math.round(entropy)} bits entropy
        </span>
      </div>

      <div className="space-y-4">
        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate/50 mb-1">
              Words: {wordCount}
            </label>
            <input
              type="range"
              min="3"
              max="8"
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="w-full accent-slate cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate/50 mb-1">
              Separator
            </label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="w-full p-1 bg-stone rounded text-sm text-slate border-none focus:ring-0 cursor-pointer"
            >
              <option value="-">Hyphen (-)</option>
              <option value=" ">Space ( )</option>
              <option value=".">Period (.)</option>
              <option value="_">Underscore (_)</option>
              <option value="">None</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumber}
              onChange={(e) => setIncludeNumber(e.target.checked)}
              className="rounded text-slate focus:ring-slate"
            />
            <span className="text-sm text-slate/70">Add Number</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={capitalize}
              onChange={(e) => setCapitalize(e.target.checked)}
              className="rounded text-slate focus:ring-slate"
            />
            <span className="text-sm text-slate/70">Capitalize</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            className="flex-1 bg-slate text-white py-2 rounded-lg font-medium hover:bg-slate/90 transition-colors"
          >
            Generate
          </button>
        </div>

        {/* Result Area */}
        {passphrase && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="p-4 bg-stone rounded-lg font-mono text-lg text-slate break-all text-center">
              {passphrase}
            </div>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 text-slate/50 hover:text-slate bg-white/50 rounded hover:bg-white transition-all"
              title="Copy to clipboard"
            >
              {copied ? '✓' : '📋'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
