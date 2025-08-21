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
          ? 'bg-purple-500 text-white border-purple-500' 
          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
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
                  ? 'bg-purple-400 text-white' 
                  : 'bg-purple-100 text-purple-700'
              }`}>
                Member
              </span>
            )}

          </div>
          <div className={`text-sm ${isActive ? 'text-purple-100' : 'text-zinc-600'}`}>
            {repairDetails}
          </div>
                      <span className={`text-lg ${isActive ? 'text-purple-100' : 'text-zinc-500'}`}>
              {time}
            </span>
        </div>
         
        <StatusIndicator status={status} size='lg' className='mr-2' />
      </div>
    </button>
  );
};

export default BookingListItem;