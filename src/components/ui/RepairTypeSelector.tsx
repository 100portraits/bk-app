
interface RepairTypeSelectorProps {
  options?: string[];
  value?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
  singleSelect?: boolean;
  disabled?: boolean;
}

const defaultOptions = ['Tire/Tube', 'Chain', 'Brakes', 'Gears', 'Wheel', 'Other'];

const RepairTypeSelector = ({ 
  options = defaultOptions, 
  value = [], 
  onChange, 
  className = '',
  singleSelect = false,
  disabled = false
}: RepairTypeSelectorProps) => {
  const handleToggle = (option: string) => {
    if (disabled) return;
    
    if (singleSelect) {
      // In single select mode, only allow one selection
      const newValue = value.includes(option) ? [] : [option];
      onChange?.(newValue);
    } else {
      // Multiple selection mode
      const newValue = value.includes(option)
        ? value.filter(v => v !== option)
        : [...value, option];
      onChange?.(newValue);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = value.includes(option);
        
        return (
          <button
            key={option}
            onClick={() => handleToggle(option)}
            disabled={disabled}
            className={`
              px-4 
              py-2 
              rounded-lg 
              font-medium 
              transition-colors
              min-h-[44px]
              ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
              ${isSelected 
                ? 'bg-accent-500 text-white' 
                : disabled
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
              }
            `}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default RepairTypeSelector;