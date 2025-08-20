import { ReactNode } from 'react';
import { IconChevronRight, IconSquare } from '@tabler/icons-react';

interface NavigationCardProps {
  title: string;
  subtitle: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'border';
  icon?: ReactNode;
  showChevron?: boolean;
  className?: string;
}

const NavigationCard = ({ 
  title, 
  subtitle, 
  onClick, 
  variant = 'primary',
  icon,
  showChevron = true,
  className = ''
}: NavigationCardProps) => {
  const variantClasses = {
    primary: 'bg-purple-500 text-white',
    secondary: 'bg-white text-gray-700 border border-gray-200',
    border: 'bg-purple-50 text-gray-700 border-2 border-purple-500'
  };

  const iconColor = variant === 'primary' ? 'text-purple-200' : 'text-gray-400';

  return (
    <button
      onClick={onClick}
      className={`
        w-full 
        p-4 
        rounded-lg 
        flex 
        items-center 
        gap-3 
        text-left
        transition-colors
        min-h-[80px]
        ${variantClasses[variant]}
        ${variant === 'primary' ? 'hover:bg-purple-600' : 'hover:bg-gray-50'}
        ${className}
      `}
    >
      <div className={iconColor}>
        {icon || <IconSquare size={24} />}
      </div>
      
      <div className="flex-1">
        <div className="font-medium text-base">{title}</div>
        <div className={`text-sm ${variant === 'primary' ? 'text-purple-100' : 'text-gray-500'}`}>
          {subtitle}
        </div>
      </div>
      
      {showChevron && (
        <IconChevronRight 
          size={24} 
          className={variant === 'primary' ? 'text-purple-200' : 'text-gray-400'} 
        />
      )}
    </button>
  );
};

export default NavigationCard;