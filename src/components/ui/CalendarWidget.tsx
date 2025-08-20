import { useState } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface CalendarWidgetProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  availableDates?: Date[];
  highlightedDates?: Date[];
  className?: string;
}

const CalendarWidget = ({ 
  selectedDate, 
  onDateSelect, 
  availableDates = [],
  highlightedDates = [],
  className = '' 
}: CalendarWidgetProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);
    
    while (days.length < 42) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const isDateAvailable = (date: Date) => {
    return availableDates.length === 0 || availableDates.some(d => isSameDate(d, date));
  };

  const isDateHighlighted = (date: Date) => {
    return highlightedDates.some(d => isSameDate(d, date));
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date) => {
    return isSameDate(date, new Date());
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigateMonth('prev')}
          className="p-1 rounded hover:bg-gray-100"
        >
          <IconChevronLeft size={20} />
        </button>
        
        <h3 className="font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button 
          onClick={() => navigateMonth('next')}
          className="p-1 rounded hover:bg-gray-100"
        >
          <IconChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div key={`weekday-${index}`} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isSelected = selectedDate && isSameDate(day, selectedDate);
          const isAvailable = isDateAvailable(day);
          const isHighlighted = isDateHighlighted(day);
          const inCurrentMonth = isCurrentMonth(day);
          const todayDate = isToday(day);

          return (
            <div key={index} className='flex justify-center items-center'>
            <button
              onClick={() => isAvailable && inCurrentMonth && onDateSelect?.(day)}
              disabled={!isAvailable || !inCurrentMonth}
              className={`
                w-10 
                h-10 
                rounded-full 
                text-sm 
                font-medium 
                transition-colors
                ${!inCurrentMonth 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : isSelected
                    ? 'bg-purple-500 text-white'
                    : isHighlighted
                      ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                      : todayDate
                        ? 'bg-purple-50 text-purple-600 border border-purple-200'
                        : isAvailable
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'text-gray-300 cursor-not-allowed'
                }
              `}
            >
              {day.getDate()}
            </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWidget;