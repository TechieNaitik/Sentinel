/**
 * InfoTiles Component
 * Container for displaying password analysis metrics
 * Features:
 * - 3-column grid layout (responsive)
 * - Time to Crack tile
 * - Entropy tile (display in bits)
 * - Patterns tile (Safe/Warning messages)
 * - Real-time updates
 */

import InfoTile from './InfoTile';

interface InfoTilesProps {
  crackTime?: string;
  entropy?: number;
  patternsDetected?: boolean;
  patternsCount?: number;
}

export default function InfoTiles({
  crackTime = 'instant',
  entropy = 0,
  patternsDetected = false,
  patternsCount = 0,
}: InfoTilesProps) {
  // Icons for each tile
  const ClockIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const ShieldIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );

  const AlertIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );

  // Determine pattern status
  const patternStatus = patternsDetected
    ? `${patternsCount} found`
    : 'Safe';
  const patternVariant = patternsDetected ? 'warning' : 'success';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Time to Crack Tile */}
      <InfoTile
        label="Time to Crack"
        value={crackTime}
        icon={ClockIcon}
        variant={
          crackTime === 'instant' || crackTime.includes('second')
            ? 'error'
            : crackTime.includes('minute') || crackTime.includes('hour')
            ? 'warning'
            : 'success'
        }
      />

      {/* Entropy Tile */}
      <InfoTile
        label="Entropy"
        value={entropy > 0 ? `${entropy.toFixed(1)} bits` : '0 bits'}
        icon={ShieldIcon}
        variant={
          entropy < 28
            ? 'error'
            : entropy < 60
            ? 'warning'
            : 'success'
        }
      />

      {/* Patterns Tile */}
      <InfoTile
        label="Patterns"
        value={patternStatus}
        icon={AlertIcon}
        variant={patternVariant}
      />
    </div>
  );
}
