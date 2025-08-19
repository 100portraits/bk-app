import { ReactNode } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import Avatar from './Avatar';

interface NavigationCardProps {
  title: string;
  subtitle: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
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
    secondary: 'bg-white text-gray-700 border border-gray-200'
  };

  const avatarVariant = variant === 'primary' ? 'primary' : 'secondary';

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
      {icon || <Avatar variant={avatarVariant === 'primary' ? 'secondary' : 'primary'} />}
      
      <div className="flex-1">
        <div className="font-medium text-base">{title}</div>
        <div className={`text-sm ${variant === 'primary' ? 'text-purple-100' : 'text-gray-500'}`}>
          {subtitle}
        </div>
      </div>
      
      {showChevron && (
        <IconChevronRight 
          size={20} 
          className={variant === 'primary' ? 'text-purple-200' : 'text-gray-400'} 
        />
      )}
    </button>
  );
};

export default NavigationCard;