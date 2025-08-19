import { useState } from 'react';

interface ExperienceSliderProps {
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}

const ExperienceSlider = ({ value = 0, onChange, className = '' }: ExperienceSliderProps) => {
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);

  const handleDotClick = (dotValue: number) => {
    onChange?.(dotValue);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Array.from({ length: 10 }, (_, index) => {
        const dotValue = index + 1;
        const isFilled = dotValue <= value;
        const isHovered = hoveredDot !== null && dotValue <= hoveredDot;
        
        return (
          <button
            key={dotValue}
            onClick={() => handleDotClick(dotValue)}
            onMouseEnter={() => setHoveredDot(dotValue)}
            onMouseLeave={() => setHoveredDot(null)}
            className={`
              w-4 
              h-4 
              rounded-full 
              border-2 
              transition-colors
              hover:scale-110
              transform
              ${isFilled || isHovered
                ? 'bg-purple-500 border-purple-500' 
                : 'bg-gray-200 border-gray-300'
              }
            `}
            aria-label={`Experience level ${dotValue}`}
          />
        );
      })}
    </div>
  );
};

export default ExperienceSlider;