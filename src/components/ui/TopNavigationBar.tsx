'use client';

import { useState, useRef, useEffect } from 'react';
import { IconMenu2, IconUser, IconSearch, IconLogout, IconCrown, IconShieldCheck, IconTool, IconMessage, IconArrowLeft } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import MessagesDialog from '@/components/ui/MessagesDialog';

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
  const [showMessagesDialog, setShowMessagesDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, profile, signOut, isMember, role } = useAuth();
  const router = useRouter();
  
  const getRoleIcon = () => {
    switch (role) {
      case 'admin':
        return <IconShieldCheck size={16} className="text-purple-600" />;
      case 'mechanic':
        return <IconTool size={16} className="text-blue-600" />;
      case 'host':
        return <IconCrown size={16} className="text-yellow-600" />;
      default:
        return null;
    }
  };

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

  const path = usePathname();
  const isSubPage = path.split('/').length > 2;
  const isWelcomePage = path === '/become-member/welcome';
  const shouldShowBackButton = isSubPage && !isWelcomePage;

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
        
        sticky
        top-0
        z-30 
        shadow-sm
        ${className}
      `}
    >
      {shouldShowBackButton ?
       (<button className='hover:bg-purple-100 rounded-lg transition-colors p-2'>
        <IconArrowLeft 
          size={24} 
          className="text-zinc-700 " 
          onClick={() => router.back()}
       />
       </button>  

       )
       : 
       (<button 
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-lg hover:bg-purple-100 transition-colors"
      >
        <IconMenu2 size={24} className="text-zinc-700" />
      </button>
      )}

      
      <h1 className="text-xl font-semibold text-zinc-900 flex-1 text-center">
        {title}
      </h1>
      
      <div className="flex items-center gap-2">
        {showSearchIcon && (
          <button 
            className="p-2 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <IconSearch size={24} className="text-zinc-700" />
          </button>
        )}
        {showUserIcon && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className="p-2 -mr-2 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <IconUser size={24} className="text-zinc-700" />
            </button>
            
            {showDropdown && user && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg border border-zinc-200 z-50">
                <div className="p-4 border-b border-zinc-100">
                  <p className="text-sm text-zinc-500">Signed in as</p>
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {profile?.name || user.email}
                  </p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p>
                  
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        isMember ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {isMember ? 'Member' : 'Non-member'}
                      </span>
                    </div>
                    
                    {role && (
                      <div className="flex items-center gap-1.5">
                        {getRoleIcon()}
                        <span className="text-xs font-medium text-zinc-700 capitalize">
                          {role}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowMessagesDialog(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
                  >
                    <IconMessage size={18} />
                    <span>Messages</span>
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
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
      
      <MessagesDialog
        isOpen={showMessagesDialog}
        onClose={() => setShowMessagesDialog(false)}
      />
    </header>
  );
};

export default TopNavigationBar;