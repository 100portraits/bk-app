import Avatar from './Avatar';
import StatusIndicator from './StatusIndicator';

interface InfoCardProps {
  name: string;
  time?: string;
  details: string;
  status?: 'completed' | 'no-show' | 'pending' | 'active';
  onClick?: () => void;
  className?: string;
  showStatus?: boolean;
}

const InfoCard = ({ 
  name, 
  time, 
  details, 
  status = 'pending',
  onClick, 
  className = '',
  showStatus = true
}: InfoCardProps) => {
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
        <Avatar 
          variant={isActive ? 'secondary' : 'primary'} 
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{name}</span>
            <span className={`text-sm ${isActive ? 'text-accent-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
              {time}
            </span>
          </div>
          <div className={`text-sm ${isActive ? 'text-accent-100' : 'text-zinc-600 dark:text-zinc-400'}`}>
            {details}
          </div>
        </div>
        
        {showStatus && (
          <StatusIndicator status={status} />
        )}
      </div>
    </button>
  );
};

export default InfoCard;