/**
 * PasswordInput Component
 * Password input field with show/hide toggle
 * Features:
 * - 80px height
 * - Stone Grey background (#e9e4e1)
 * - Slate Blue text (#303a47)
 * - Masked input (• characters) by default
 * - Eye icon toggle to show/hide password
 * - Focus state (2px solid Slate Blue border)
 * - Placeholder with 40% opacity
 * - 32px font size (Medium weight)
 * - Real-time onChange handler
 * - Framer Motion shake animation for very weak passwords
 */

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  isVeryWeak?: boolean; // Trigger shake animation
  placeholder?: string;
}

export default function PasswordInput({
  value,
  onChange,
  isVeryWeak = false,
  placeholder = 'Enter your password',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Shake animation variants
  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    normal: {
      x: 0,
    },
  };

  return (
    <div className="relative">
      <motion.div
        animate={isVeryWeak ? 'shake' : 'normal'}
        variants={shakeVariants}
      >
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full
            h-20
            px-6
            bg-stone
            text-slate
            text-input
            rounded-xl
            border-2
            border-transparent
            focus:border-slate
            focus:outline-none
            transition-colors
            duration-200
            placeholder:text-slate/40
          "
          aria-label="Password input"
        />
      </motion.div>

      {/* Show/Hide Toggle Button */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          p-2
          text-slate/60
          hover:text-slate
          transition-colors
          duration-200
          focus:outline-none
          focus:ring-2
          focus:ring-slate/20
          rounded-lg
        "
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          // Eye Slash Icon (Hide)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
        ) : (
          // Eye Icon (Show)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
