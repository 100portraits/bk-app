interface AvatarProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar = ({ variant = 'primary', size = 'md', className = '' }: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const variantClasses = {
    primary: 'bg-purple-500 text-white',
    secondary: 'bg-purple-100 text-purple-500'
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