import { IconEdit, IconLink, IconBike, IconTool, IconGlass, IconRecycle, IconCalendarEvent } from '@tabler/icons-react';
import { EventType } from '@/types/events';

interface EventCardProps {
  title: string;
  subtitle?: string;
  link?: string;
  eventType?: EventType;
  date?: string;
  dayOfWeek?: string;
  onClick?: () => void;
  onEdit?: () => void;
  showEditIcon?: boolean;
  className?: string;
}

const EventCard = ({ 
  title, 
  subtitle, 
  link,
  eventType = 'other',
  date,
  dayOfWeek,
  onClick, 
  onEdit,
  showEditIcon = false,
  className = ''
}: EventCardProps) => {
  // Get icon based on event type
  const getEventIcon = () => {
    switch(eventType) {
      case 'ride_out':
        return <IconBike size={24} className="text-accent-600 dark:text-accent-400" />;
      case 'workshop':
        return <IconTool size={24} className="text-blue-600 dark:text-blue-400" />;
      case 'borrel':
        return <IconGlass size={24} className="text-purple-600 dark:text-purple-400" />;
      case 'upcycling':
        return <IconRecycle size={24} className="text-green-600 dark:text-green-400" />;
      default:
        return <IconCalendarEvent size={24} className="text-zinc-600 dark:text-zinc-400" />;
    }
  };

  // Get background color based on event type
  const getIconBackground = () => {
    switch(eventType) {
      case 'ride_out':
        return 'bg-accent-100 dark:bg-accent-900/30';
      case 'workshop':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'borrel':
        return 'bg-purple-100 dark:bg-purple-900/30';
      case 'upcycling':
        return 'bg-green-100 dark:bg-green-900/30';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800';
    }
  };

  return (
    <div className={`${className}`}>
      {date && dayOfWeek && (
        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
          {dayOfWeek} {date}
        </div>
      )}
      
      <div
        onClick={onClick}
        className="w-full p-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-left hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg ${getIconBackground()} flex items-center justify-center`}>
            {getEventIcon()}
          </div>
          
          <div className="flex-1">
            <div className="font-medium text-zinc-900 dark:text-white">{title}</div>
            {link && (
              <div className="text-sm text-accent-600 dark:text-accent-400 flex items-center gap-1 mt-1">
                <IconLink size={14} />
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline hover:text-accent-700 dark:hover:text-accent-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  More Info
                </a>
              </div>
            )}
            {subtitle && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{subtitle}</div>
            )}
          </div>
          
          {showEditIcon && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <IconEdit size={18} className="text-zinc-500 dark:text-zinc-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;