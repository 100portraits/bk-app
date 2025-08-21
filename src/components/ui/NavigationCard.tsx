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
    primary: 'bg-accent-500 text-white',
    secondary: 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700',
    border: 'bg-accent-50 dark:bg-accent-950 text-zinc-700 dark:text-zinc-300 border-2 border-accent-500'
  };

  const iconColor = variant === 'primary' ? 'text-accent-200' : 'text-zinc-400 dark:text-zinc-500';

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
        ${variant === 'primary' ? 'hover:bg-accent-600' : 'hover:bg-zinc-50 dark:hover:bg-zinc-700'}
        ${className}
      `}
    >
      <div className={iconColor}>
        {icon || <IconSquare size={24} />}
      </div>
      
      <div className="flex-1">
        <div className="font-medium text-base">{title}</div>
        <div className={`text-sm ${variant === 'primary' ? 'text-accent-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
          {subtitle}
        </div>
      </div>
      
      {showChevron && (
        <IconChevronRight 
          size={24} 
          className={variant === 'primary' ? 'text-accent-200' : 'text-zinc-400 dark:text-zinc-500'} 
        />
      )}
    </button>
  );
};

export default NavigationCard;