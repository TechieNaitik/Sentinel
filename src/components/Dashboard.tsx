/**
 * Dashboard Component
 * Main container for the password analyzer
 * Features:
 * - Centered single-column layout (max-width: 600px)
 * - Cloud White background (#f4f5f6)
 * - White card with Stone Grey border
 * - 16px border radius
 * - Flat design (no shadows)
 * - Responsive for mobile devices
 */

import React from 'react';

interface DashboardProps {
  children: React.ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  return (
    <div className="min-h-screen bg-cloud flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Main Container */}
      <div className="w-full max-w-[600px]">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-logo text-slate mb-2">
            🛡️ SENTINEL
          </h1>
          <p className="text-body text-slate/70">
            Password Strength & Hygiene Analyzer
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-white border-2 border-stone rounded-xl p-6 sm:p-8">
          {children}
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center">
          <p className="text-label text-slate/50">
            Zero-Knowledge • Client-Side Only • No Data Transmitted
          </p>
        </footer>
      </div>
    </div>
  );
}
