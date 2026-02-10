/**
 * InfoTile Component
 * Reusable tile for displaying analysis information
 * Features:
 * - Label (12px, uppercase, tracking +1px)
 * - Value (bold, Slate Blue)
 * - Responsive for mobile
 */

import React from 'react';
import { motion } from 'framer-motion';

interface InfoTileProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: 'default' | 'warning' | 'error' | 'success';
}

export default function InfoTile({
  label,
  value,
  icon,
  variant = 'default',
}: InfoTileProps) {
  // Determine color based on variant
  const getVariantColor = () => {
    switch (variant) {
      case 'warning':
        return 'text-orange';
      case 'error':
        return 'text-terracotta';
      case 'success':
        return 'text-slate';
      default:
        return 'text-slate';
    }
  };

  return (
    <motion.div
      className="bg-stone/50 rounded-lg p-4 space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Label */}
      <div className="flex items-center gap-2">
        {icon && <span className="text-slate/60">{icon}</span>}
        <span className="text-label text-slate/70">{label}</span>
      </div>

      {/* Value */}
      <motion.div
        className={`text-2xl font-bold ${getVariantColor()}`}
        key={value} // Re-animate when value changes
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {value}
      </motion.div>
    </motion.div>
  );
}
