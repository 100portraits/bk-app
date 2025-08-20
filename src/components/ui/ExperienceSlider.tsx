import { useState } from 'react';
import { IconGripVertical } from '@tabler/icons-react';
import { clamp, useMove } from '@mantine/hooks';

interface ExperienceSliderProps {
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

const ExperienceSlider = ({ value = 1, onChange, className = '', disabled = false }: ExperienceSliderProps) => {
  // Convert 1-5 range to 0-1 for internal calculations
  const normalizedValue = (value - 1) / 4;
  
  const { ref } = useMove(({ x }) => {
    if (disabled) return;
    const clampedX = clamp(x, 0, 1);
    // Convert back to 1-5 stepped values
    const steppedValue = Math.round(clampedX * 4) + 1;
    onChange?.(steppedValue);
  });

  const labelFloating = false

  return (
    <div className={`${className}`}>
      <div 
        className={`relative h-12 bg-gray-100 rounded-lg select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        style={{
          '--thumb-width': '12px',
          '--thumb-offset': '4px'
        } as React.CSSProperties}
        ref={ref}
      >
        {/* Filled track */}
        <div
          className="absolute top-0 left-0 h-full bg-purple-500 rounded-l-lg flex items-center justify-center"
          style={{
            width: `calc(${normalizedValue * 100}% `,
          }}
        >
          <span 
            className={`text-white font-medium text-sm transition-opacity ${
              labelFloating ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {value}
          </span>
        </div>

        {/* Empty track */}
        <div
          className="absolute top-0 right-0 h-full bg-gray-100 rounded-r-lg flex items-center justify-center"
          style={{
            width: `calc(${(1 - normalizedValue) * 100}% - var(--thumb-width) / 2 - var(--thumb-offset) / 2)`,
          }}
        >
          
        </div>

        {/* Thumb */}
        <div
          className={`absolute top-0 w-4 h-12 bg-white border-2 border-purple-500 rounded-lg flex items-center justify-center shadow-lg transition-shadow ${disabled ? '' : 'hover:shadow-xl cursor-grab active:cursor-grabbing'}`}
          style={{ 
            left: `calc(${normalizedValue * 100}% - var(--thumb-width) / 2)` 
          }}
        >
          {labelFloating && (
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs font-medium px-2 py-1 rounded">
              {value}
            </span>
          )}
          <IconGripVertical size={16} className="text-purple-500" stroke={1.5} />
        </div>

        {/* Step indicators */}
        <div className="absolute top-full mt-2 w-full flex justify-between text-xs text-gray-500">
          {[1, 2, 3, 4, 5].map((step) => (
            <span key={step} className="text-center">
              {step}
            </span>
          ))}
        </div>
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-600 mt-8">
        <span>Beginner</span>
        <span>Expert</span>
      </div>
    </div>
  );
};

export default ExperienceSlider;