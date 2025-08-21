import StatusIndicator from './StatusIndicator';

interface BookingListItemProps {
  customerName: string;
  time: string;
  repairDetails: string;
  status: 'completed' | 'no-show' | 'pending' | 'active';
  isMember?: boolean;
  onClick?: () => void;
  className?: string;
}

const BookingListItem = ({ 
  customerName, 
  time, 
  repairDetails, 
  status,
  isMember = false,
  onClick, 
  className = ''
}: BookingListItemProps) => {
  const isActive = status === 'active';

  return (
    <button
      onClick={onClick}
      className={`
        w-full 
        p-4 
        rounded-lg 
        text-left 
        transition-colors
        border
        ${isActive 
          ? 'bg-accent-500 text-white border-accent-500' 
          : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
        }
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{customerName}</span>
            {isMember && (
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                isActive 
                  ? 'bg-accent-400 text-white' 
                  : 'bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300'
              }`}>
                Member
              </span>
            )}

          </div>
          <div className={`text-sm ${isActive ? 'text-accent-100' : 'text-zinc-600 dark:text-zinc-400'}`}>
            {repairDetails}
          </div>
                      <span className={`text-lg ${isActive ? 'text-accent-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
              {time}
            </span>
        </div>
         
        <StatusIndicator status={status} size='lg' className='mr-2' />
      </div>
    </button>
  );
};

export default BookingListItem;