/**
 * StrengthMeter Component
 * Visual strength indicator with discrete blocks
 * Features:
 * - 4 discrete blocks with 4px gap
 * - 8px height
 * - 4px border radius (pill shape)
 * - Color-coded based on strength:
 *   - Weak: 1 block filled (Terracotta #755556)
 *   - Fair: 2 blocks filled (Burnt Orange #e48037)
 *   - Strong: 4 blocks filled (Slate Blue #303a47)
 * - Smooth transitions (0.3s ease-out)
 * - Integrates with entropy calculation results
 */

import { motion } from 'framer-motion';

type StrengthLevel = 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong' | 'none';

interface StrengthMeterProps {
  strength: StrengthLevel;
  label?: string;
}

export default function StrengthMeter({ strength, label }: StrengthMeterProps) {
  // Determine how many blocks to fill and what color
  const getStrengthConfig = (level: StrengthLevel) => {
    switch (level) {
      case 'very-weak':
        return { blocks: 1, color: 'bg-terracotta', label: 'Very Weak' };
      case 'weak':
        return { blocks: 1, color: 'bg-terracotta', label: 'Weak' };
      case 'fair':
        return { blocks: 2, color: 'bg-orange', label: 'Fair' };
      case 'strong':
        return { blocks: 4, color: 'bg-slate', label: 'Strong' };
      case 'very-strong':
        return { blocks: 4, color: 'bg-slate', label: 'Very Strong' };
      default:
        return { blocks: 0, color: 'bg-stone', label: 'Enter Password' };
    }
  };

  const config = getStrengthConfig(strength);
  const displayLabel = label || config.label;

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <span className="text-label text-slate/70">Password Strength</span>
        <span
          className={`
            text-sm font-medium
            ${strength === 'very-weak' || strength === 'weak' ? 'text-terracotta' : ''}
            ${strength === 'fair' ? 'text-orange' : ''}
            ${strength === 'strong' || strength === 'very-strong' ? 'text-slate' : ''}
            ${strength === 'none' ? 'text-slate/40' : ''}
          `}
        >
          {displayLabel}
        </span>
      </div>

      {/* Meter Blocks */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((block) => (
          <motion.div
            key={block}
            className={`
              flex-1
              h-2
              rounded-sm
              transition-colors
              duration-300
              ease-out
              ${block <= config.blocks ? config.color : 'bg-stone'}
            `}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 0.3,
              delay: block * 0.05,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
