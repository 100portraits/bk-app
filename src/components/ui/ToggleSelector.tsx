interface ToggleSelectorProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const ToggleSelector = ({ options, value, onChange, className = '' }: ToggleSelectorProps) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => onChange?.(option.value)}
            className={`
              px-4 
              py-2 
              rounded-lg 
              font-medium 
              transition-colors
              min-h-[44px]
              ${isSelected 
                ? 'bg-accent-500 text-white' 
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default ToggleSelector;