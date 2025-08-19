import { useState } from 'react';

interface RepairTypeSelectorProps {
  options?: string[];
  value?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
}

const defaultOptions = ['Tire/Tube', 'Chain', 'Brakes', 'Gears', 'Other'];

const RepairTypeSelector = ({ 
  options = defaultOptions, 
  value = [], 
  onChange, 
  className = '' 
}: RepairTypeSelectorProps) => {
  const handleToggle = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange?.(newValue);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = value.includes(option);
        
        return (
          <button
            key={option}
            onClick={() => handleToggle(option)}
            className={`
              px-4 
              py-2 
              rounded-lg 
              font-medium 
              transition-colors
              min-h-[44px]
              ${isSelected 
                ? 'bg-purple-500 text-white' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
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