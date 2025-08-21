interface AvatarProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar = ({ variant = 'primary', size = 'md', className = '' }: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-xl'
  };

  const variantClasses = {
    primary: 'bg-accent-500 text-white',
    secondary: 'bg-accent-100 dark:bg-accent-900 text-accent-500 dark:text-accent-400'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        font-medium
        ${className}
      `}
    >
      A
    </div>
  );
};

export default Avatar;