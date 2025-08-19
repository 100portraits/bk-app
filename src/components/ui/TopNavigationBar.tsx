import { IconMenu2, IconUser, IconSearch } from '@tabler/icons-react';

interface TopNavigationBarProps {
  title: string;
  onMenuClick?: () => void;
  onUserClick?: () => void;
  showUserIcon?: boolean;
  showSearchIcon?: boolean;
  className?: string;
}

const TopNavigationBar = ({ 
  title, 
  onMenuClick, 
  onUserClick,
  showUserIcon = true,
  showSearchIcon = false,
  className = ''
}: TopNavigationBarProps) => {
  return (
    <header 
      className={`
        bg-purple-50 
        border-b 
        border-purple-100 
        px-4 
        py-3 
        flex 
        items-center 
        justify-between
        min-h-[60px]
        ${className}
      `}
    >
      <button 
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-lg hover:bg-purple-100 transition-colors"
      >
        <IconMenu2 size={24} className="text-gray-700" />
      </button>
      
      <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center">
        {title}
      </h1>
      
      <div className="flex items-center gap-2">
        {showSearchIcon && (
          <button 
            className="p-2 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <IconSearch size={24} className="text-gray-700" />
          </button>
        )}
        {showUserIcon && (
          <button 
            onClick={onUserClick}
            className="p-2 -mr-2 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <IconUser size={24} className="text-gray-700" />
          </button>
        )}
      </div>
    </header>
  );
};

export default TopNavigationBar;