interface RoleBadgeProps {
  role: string;
  variant?: 'default' | 'active';
  className?: string;
}

const RoleBadge = ({ role, variant = 'default', className = '' }: RoleBadgeProps) => {
  const variantClasses = {
    default: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
    active: 'bg-accent-500 text-white'
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