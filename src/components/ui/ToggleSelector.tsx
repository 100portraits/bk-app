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
                ? 'bg-purple-500 text-white' 
                : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
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