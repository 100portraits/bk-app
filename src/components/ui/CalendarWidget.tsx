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

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - mondayOffset);

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
    return availableDates.some(d => isSameDate(d, date));
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
    <div className={`bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigateMonth('prev')}
          className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700"
        >
          <IconChevronLeft size={20} className='text-zinc-500 dark:text-zinc-400' />
        </button>
        
        <h3 className="font-semibold text-zinc-900 dark:text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button 
          onClick={() => navigateMonth('next')}
          className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700"
        >
          <IconChevronRight size={20} className='text-zinc-500 dark:text-zinc-400' />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div key={`weekday-${index}`} className="text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 py-2">
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
              onClick={() => (isAvailable || isHighlighted) && inCurrentMonth && onDateSelect?.(day)}
              disabled={!inCurrentMonth}
              className={`
                w-10 
                h-10 
                rounded-full 
                text-sm 
                font-medium 
                transition-colors
                ${!inCurrentMonth 
                  ? 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed' 
                  : isSelected
                    ? 'bg-accent-500 text-white'
                    : isHighlighted
                      ? 'bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 border-2 border-accent-500'
                      : isAvailable
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-2 border-dashed border-yellow-400 dark:border-yellow-600'
                      : todayDate
                        ? 'bg-accent-50 dark:bg-accent-950 text-accent-600 dark:text-accent-400 border border-accent-200 dark:border-accent-700'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
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