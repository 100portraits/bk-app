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
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-white 
        text-gray-700 
        border 
        border-gray-200 
        rounded-lg 
        font-medium 
        flex 
        items-center 
        justify-center 
        gap-2
        transition-colors
        hover:bg-gray-50 
        disabled:bg-gray-100 
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