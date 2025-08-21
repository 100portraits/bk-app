import { ReactNode } from 'react';

interface SecondaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  icon?: ReactNode;
}

const SecondaryButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  fullWidth = false,
  size = 'md',
  className = '',
  type = 'button',
  icon
}: SecondaryButtonProps) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-xl'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-white dark:bg-zinc-800 
        text-zinc-700 dark:text-zinc-300 
        border 
        border-zinc-200 dark:border-zinc-700 
        rounded-lg 
        font-medium 
        flex 
        items-center 
        justify-center 
        gap-2
        transition-colors
        hover:bg-zinc-50 dark:hover:bg-zinc-700 
        disabled:bg-zinc-100 dark:disabled:bg-zinc-900 
        disabled:cursor-not-allowed
        min-h-[44px]
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default SecondaryButton;