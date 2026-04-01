import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, actions }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 hover:bg-surface-variant rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-secondary" />
          </button>
        )}
        <h1 className="text-xl font-display font-semibold tracking-tight text-primary">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {actions}
      </div>
    </header>
  );
};
