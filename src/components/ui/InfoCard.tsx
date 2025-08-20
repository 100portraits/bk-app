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
          ? 'bg-purple-500 text-white border-purple-500' 
          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
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
            <span className={`text-sm ${isActive ? 'text-purple-100' : 'text-gray-500'}`}>
              {time}
            </span>
          </div>
          <div className={`text-sm ${isActive ? 'text-purple-100' : 'text-gray-600'}`}>
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