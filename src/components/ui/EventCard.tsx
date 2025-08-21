import { IconEdit } from '@tabler/icons-react';
import Avatar from './Avatar';

interface EventCardProps {
  title: string;
  subtitle?: string;
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
  date,
  dayOfWeek,
  onClick, 
  onEdit,
  showEditIcon = false,
  className = ''
}: EventCardProps) => {
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
          <Avatar variant="secondary" />
          
          <div className="flex-1">
            <div className="font-medium text-zinc-900 dark:text-white">{title}</div>
            {subtitle && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</div>
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