'use client';

import { useState, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';

type ColorTheme = 'purple' | 'green' | 'blue' | 'slate' | 'zinc' | 'yellow' | 'red';

interface DismissableCardProps {
  id: string; // Unique ID for localStorage persistence
  title?: string;
  children: React.ReactNode;
  className?: string;
  color?: ColorTheme;
  onDismiss?: () => void;
}

const colorStyles: Record<ColorTheme, {
  background: string;
  border: string;
  text: string;
  buttonText: string;
  buttonHover: string;
}> = {
  purple: {
    background: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-900',
    buttonText: 'text-purple-400',
    buttonHover: 'hover:text-purple-600'
  },
  green: {
    background: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
    buttonText: 'text-green-400',
    buttonHover: 'hover:text-green-600'
  },
  blue: {
    background: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    buttonText: 'text-blue-400',
    buttonHover: 'hover:text-blue-600'
  },
  slate: {
    background: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-900',
    buttonText: 'text-slate-400',
    buttonHover: 'hover:text-slate-600'
  },
  zinc: {
    background: 'bg-zinc-50',
    border: 'border-zinc-200',
    text: 'text-zinc-900',
    buttonText: 'text-zinc-400',
    buttonHover: 'hover:text-zinc-600'
  },
  yellow: {
    background: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-900',
    buttonText: 'text-yellow-400',
    buttonHover: 'hover:text-yellow-600'
  },
  red: {
    background: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-900',
    buttonText: 'text-red-400',
    buttonHover: 'hover:text-red-600'
  }
};

export default function DismissableCard({
  id,
  title,
  children,
  className = '',
  color = 'purple',
  onDismiss
}: DismissableCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const styles = colorStyles[color];

  useEffect(() => {
    // Check if card has been dismissed before
    const isDismissed = localStorage.getItem(`dismissed-card-${id}`);
    setIsVisible(!isDismissed);
  }, [id]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`dismissed-card-${id}`, 'true');
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className={`relative ${styles.background} border ${styles.border} rounded-lg p-6 ${className}`}>
      <button
        onClick={handleDismiss}
        className={`absolute top-4 right-4 ${styles.buttonText} ${styles.buttonHover} transition-colors`}
        aria-label="Dismiss"
      >
        <IconX size={20} />
      </button>
      
      {title && (
        <h3 className="text-4xl font-semibold text-zinc-900 mb-3 pr-8">
          {title}
        </h3>
      )}
      
      <div className={`text-md ${styles.text}`}>
        {children}
      </div>
    </div>
  );
}