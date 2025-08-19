import { ReactNode } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  icon?: ReactNode;
}

const PrimaryButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  fullWidth = false,
  size = 'md',
  className = '',
  type = 'button',
  icon
}: PrimaryButtonProps) => {
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
        bg-purple-500 
        text-white 
        rounded-lg 
        font-medium 
        flex 
        items-center 
        justify-center 
        gap-2
        transition-colors
        hover:bg-purple-600 
        disabled:bg-gray-300 
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

export default PrimaryButton;