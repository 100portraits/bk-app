import { IconCheck, IconX, IconUser } from '@tabler/icons-react';

interface StatusIndicatorProps {
  status: 'completed' | 'no-show' | 'pending' | 'active';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusIndicator = ({ status, size = 'md', className = '' }: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          bgColor: 'bg-green-500',
          icon: <IconCheck size={iconSizes[size]} />
        };
      case 'no-show':
        return {
          bgColor: 'bg-red-500',
          icon: <IconX size={iconSizes[size]} />
        };
      case 'pending':
        return {
          bgColor: 'bg-purple-500',
          icon: <IconUser size={iconSizes[size]} />
        };
      case 'active':
        return {
          bgColor: 'bg-purple-400',
          icon: <IconUser size={iconSizes[size]} />
        };
      default:
        return {
          bgColor: 'bg-gray-400',
          icon: <IconUser size={iconSizes[size]} />
        };
    }
  };

  const { bgColor, icon } = getStatusConfig();

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${bgColor} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        text-white
        ${className}
      `}
    >
      {icon}
    </div>
  );
};

export default StatusIndicator;