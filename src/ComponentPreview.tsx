/**
 * ComponentPreview
 * Demo component to showcase all UI components with mocked data
 * This helps visualize the components before full integration
 */

import { useState } from 'react';
import Dashboard from './components/Dashboard';
import PasswordInput from './components/PasswordInput';
import StrengthMeter from './components/StrengthMeter';
import InfoTiles from './components/InfoTiles';

export default function ComponentPreview() {
  const [password, setPassword] = useState('');
  const [demoStrength, setDemoStrength] = useState<
    'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong' | 'none'
  >('none');

  // Mock data for different strength levels
  const mockData = {
    'none': {
      crackTime: 'N/A',
      entropy: 0,
      patternsDetected: false,
      patternsCount: 0,
    },
    'very-weak': {
      crackTime: 'instant',
      entropy: 18.5,
      patternsDetected: true,
      patternsCount: 3,
    },
    'weak': {
      crackTime: '2 minutes',
      entropy: 32.8,
      patternsDetected: true,
      patternsCount: 1,
    },
    'fair': {
      crackTime: '3 hours',
      entropy: 45.6,
      patternsDetected: false,
      patternsCount: 0,
    },
    'strong': {
      crackTime: '2.5 years',
      entropy: 68.2,
      patternsDetected: false,
      patternsCount: 0,
    },
    'very-strong': {
      crackTime: '5 centuries',
      entropy: 95.7,
      patternsDetected: false,
      patternsCount: 0,
    },
  };

  const currentMockData = mockData[demoStrength];

  return (
    <Dashboard>
      {/* Component Preview Controls */}
      <div className="mb-6 p-4 bg-slate/5 rounded-lg border border-slate/10">
        <h3 className="text-sm font-semibold text-slate mb-3">
          Component Preview Mode
        </h3>
        <div className="flex flex-wrap gap-2">
          {(['none', 'very-weak', 'weak', 'fair', 'strong', 'very-strong'] as const).map(
            (strength) => (
              <button
                key={strength}
                onClick={() => setDemoStrength(strength)}
                className={`
                  px-3 py-1 text-xs font-medium rounded-lg
                  transition-colors duration-200
                  ${
                    demoStrength === strength
                      ? 'bg-slate text-white'
                      : 'bg-stone text-slate hover:bg-slate/10'
                  }
                `}
              >
                {strength.replace('-', ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {/* Password Input */}
      <div className="mb-6">
        <PasswordInput
          value={password}
          onChange={setPassword}
          isVeryWeak={demoStrength === 'very-weak'}
          placeholder="Enter password to test components"
        />
      </div>

      {/* Strength Meter */}
      <div className="mb-6">
        <StrengthMeter strength={demoStrength} />
      </div>

      {/* Info Tiles */}
      <div className="mb-6">
        <InfoTiles
          crackTime={currentMockData.crackTime}
          entropy={currentMockData.entropy}
          patternsDetected={currentMockData.patternsDetected}
          patternsCount={currentMockData.patternsCount}
        />
      </div>

      {/* Component Info */}
      <div className="mt-8 p-4 bg-cloud rounded-lg">
        <h4 className="text-sm font-semibold text-slate mb-2">
          Current Mock Data:
        </h4>
        <pre className="text-xs text-slate/70 overflow-x-auto">
          {JSON.stringify(
            {
              strength: demoStrength,
              ...currentMockData,
            },
            null,
            2
          )}
        </pre>
      </div>
    </Dashboard>
  );
}
