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
    background: 'bg-accent-50 dark:bg-accent-950',
    border: 'border-accent-200 dark:border-accent-700',
    text: 'text-accent-900 dark:text-accent-100',
    buttonText: 'text-accent-400 dark:text-accent-500',
    buttonHover: 'hover:text-accent-600 dark:hover:text-accent-300'
  },
  green: {
    background: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-700',
    text: 'text-green-900 dark:text-green-100',
    buttonText: 'text-green-400 dark:text-green-500',
    buttonHover: 'hover:text-green-600 dark:hover:text-green-300'
  },
  blue: {
    background: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-700',
    text: 'text-blue-900 dark:text-blue-100',
    buttonText: 'text-blue-400 dark:text-blue-500',
    buttonHover: 'hover:text-blue-600 dark:hover:text-blue-300'
  },
  slate: {
    background: 'bg-slate-50 dark:bg-slate-950',
    border: 'border-slate-200 dark:border-slate-700',
    text: 'text-slate-900 dark:text-slate-100',
    buttonText: 'text-slate-400 dark:text-slate-500',
    buttonHover: 'hover:text-slate-600 dark:hover:text-slate-300'
  },
  zinc: {
    background: 'bg-zinc-50 dark:bg-zinc-900',
    border: 'border-zinc-200 dark:border-zinc-700',
    text: 'text-zinc-900 dark:text-zinc-100',
    buttonText: 'text-zinc-400 dark:text-zinc-500',
    buttonHover: 'hover:text-zinc-600 dark:hover:text-zinc-300'
  },
  yellow: {
    background: 'bg-yellow-50 dark:bg-yellow-950',
    border: 'border-yellow-200 dark:border-yellow-700',
    text: 'text-yellow-900 dark:text-yellow-100',
    buttonText: 'text-yellow-400 dark:text-yellow-500',
    buttonHover: 'hover:text-yellow-600 dark:hover:text-yellow-300'
  },
  red: {
    background: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-700',
    text: 'text-red-900 dark:text-red-100',
    buttonText: 'text-red-400 dark:text-red-500',
    buttonHover: 'hover:text-red-600 dark:hover:text-red-300'
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
        <h3 className="text-4xl font-semibold text-zinc-900 dark:text-white mb-3 pr-8">
          {title}
        </h3>
      )}
      
      <div className={`text-md ${styles.text}`}>
        {children}
      </div>
    </div>
  );
}