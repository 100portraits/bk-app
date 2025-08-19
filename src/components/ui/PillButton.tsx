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
    ? 'bg-purple-500 text-white' 
    : 'bg-white text-gray-700 border border-gray-200';

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
        ${selected ? 'hover:bg-purple-600' : 'hover:bg-gray-50'}
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