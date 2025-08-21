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
        <div className="text-sm font-medium text-zinc-600 mb-2">
          {dayOfWeek} {date}
        </div>
      )}
      
      <div
        onClick={onClick}
        className="w-full p-4 bg-white border border-zinc-200 rounded-lg text-left hover:bg-zinc-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Avatar variant="secondary" />
          
          <div className="flex-1">
            <div className="font-medium text-zinc-900">{title}</div>
            {subtitle && (
              <div className="text-sm text-zinc-600">{subtitle}</div>
            )}
          </div>
          
          {showEditIcon && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <IconEdit size={18} className="text-zinc-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;