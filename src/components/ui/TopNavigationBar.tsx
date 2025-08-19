'use client';

import { useState, useRef, useEffect } from 'react';
import { IconMenu2, IconUser, IconSearch, IconLogout } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const toggleDropdown = () => {
    if (onUserClick) {
      onUserClick();
    } else {
      setShowDropdown(!showDropdown);
    }
  };

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
        relative
        ${className}
      `}
    >
      <button 
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-lg hover:bg-purple-100 transition-colors"
      >
        <IconMenu2 size={24} className="text-gray-700" />
      </button>
      
      <h1 className="text-xl font-semibold text-gray-900 flex-1 text-center">
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
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className="p-2 -mr-2 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <IconUser size={24} className="text-gray-700" />
            </button>
            
            {showDropdown && user && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <IconLogout size={18} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNavigationBar;