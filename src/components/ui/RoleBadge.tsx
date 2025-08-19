interface RoleBadgeProps {
  role: string;
  variant?: 'default' | 'active';
  className?: string;
}

const RoleBadge = ({ role, variant = 'default', className = '' }: RoleBadgeProps) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    active: 'bg-purple-500 text-white'
  };

  return (
    <span 
      className={`
        inline-block 
        px-3 
        py-1 
        rounded-full 
        text-sm 
        font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {role}
    </span>
  );
};

export default RoleBadge;