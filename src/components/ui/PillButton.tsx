import { ReactNode } from 'react';

interface PillButtonProps {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const PillButton = ({ 
  children, 
  onClick, 
  selected = false, 
  disabled = false,
  size = 'md',
  className = ''
}: PillButtonProps) => {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base'
  };

  const stateClasses = selected 
    ? 'bg-accent-500 text-white' 
    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-full 
        font-medium 
        transition-colors
        min-h-[36px]
        ${sizeClasses[size]}
        ${stateClasses}
        ${selected ? 'hover:bg-accent-600' : 'hover:bg-zinc-50 dark:hover:bg-zinc-700'}
        disabled:opacity-50 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default PillButton;