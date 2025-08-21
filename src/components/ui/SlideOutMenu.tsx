'use client';

import { IconX, IconLock } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useMenu } from '@/contexts/MenuContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface SlideOutMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

interface MenuItem {
  label: string;
  path: string;
  requireMember?: boolean;
  allowedRoles?: UserRole[];
  requireNonMember?: boolean;
}

const menuItems: MenuItem[] = [
  { label: 'Home', path: '/home' },
  { label: 'Booking', path: '/booking' },
  { label: 'Host App', path: '/host', allowedRoles: ['host', 'mechanic', 'admin'] },
  { label: 'Membership', path: '/membership', requireMember: true },
  { label: 'Admin', path: '/admin', allowedRoles: ['admin'] },
  { label: 'Become a member', path: '/become-member', requireNonMember: true }
];

const SlideOutMenu = ({ isOpen, currentPath }: SlideOutMenuProps) => {
  const router = useRouter();
  const { closeMenu } = useMenu();
  const { user, isMember, role } = useAuth();

  const handleNavigation = (path: string) => {
    // Navigate immediately for snappy UX
    router.push(path);
    // Close menu immediately - context will persist the transition
    closeMenu();
  };

  // Check if user can access a menu item
  const canAccessItem = (item: MenuItem): boolean => {
    if (!user) return false;
    
    // Check non-member requirement
    if (item.requireNonMember && isMember) return false;
    
    // Check member requirement
    if (item.requireMember && !isMember) return false;
    
    // Check role requirement
    if (item.allowedRoles && item.allowedRoles.length > 0) {
      if (!item.allowedRoles.includes(role)) return false;
    }
    
    return true;
  };

  // Sort menu items: accessible first, then inaccessible
  const sortedMenuItems = [...menuItems].sort((a, b) => {
    const aAccessible = canAccessItem(a);
    const bAccessible = canAccessItem(b);
    
    if (aAccessible && !bAccessible) return -1;
    if (!aAccessible && bAccessible) return 1;
    return 0;
  });

  // Separate accessible and inaccessible items
  const accessibleItems = sortedMenuItems.filter(item => canAccessItem(item));
  const inaccessibleItems = sortedMenuItems.filter(item => !canAccessItem(item));

  return (
    <>
      <div 
        className={`
          fixed 
          inset-0 
          bg-black 
          transition-all
          duration-300 
          ease-in-out
          ${isOpen 
            ? 'opacity-50 pointer-events-auto visible' 
            : 'opacity-0 pointer-events-none invisible'
          } 
          z-40
        `}
        onClick={closeMenu}
      />
      
      <div 
        className={`
          fixed 
          top-0 
          left-0 
          h-full 
          w-80 
          bg-zinc-50
          rounded-r-2xl
          z-50 
          transform 
          transition-all
          duration-300 
          ease-in-out
          ${isOpen ? 'translate-x-0 ' : '-translate-x-full '}
        `}
      >
        <div className="p-4 pr-8 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-semibold text-zinc-900">Menu</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={closeMenu}
                className="p-2 -mr-4 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <IconX size={24} className="text-zinc-700" />
              </button>
            </div>
          </div>
          
          {/* Accessible items */}
          {accessibleItems.length > 0 && (
            <div className="space-y-3 mb-6 border-t border-zinc-200 pt-4">
              {accessibleItems.map((item) => {
                // Check if current path matches exactly or starts with the item path
                const isActive = currentPath === item.path || currentPath?.startsWith(item.path + '/');
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full 
                      p-4 
                      rounded-lg 
                      text-left 
                      font-medium 
                      transition-colors
                      min-h-[56px]
                      ${isActive 
                        ? 'bg-purple-500 text-white border border-purple-600 hover:bg-purple-600' 
                        : 'bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Inaccessible items */}
          {inaccessibleItems.length > 0 && (
            <>
              <div className="border-t border-zinc-200 pt-4 mb-3">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                  <IconLock size={14} />
                  Restricted Access
                </p>
              </div>
              <div className="space-y-3">
                {inaccessibleItems.map((item) => {
                  // Check if current path matches exactly or starts with the item path
                  const isActive = currentPath === item.path || currentPath?.startsWith(item.path + '/');
                  
                  // Determine why access is restricted
                  let restrictionReason = '';
                  if (item.requireNonMember && isMember) {
                    restrictionReason = 'Non-members only';
                  } else if (item.requireMember && !isMember) {
                    restrictionReason = 'Members only';
                  } else if (item.allowedRoles && item.allowedRoles.length > 0) {
                    if (item.allowedRoles.length === 1) {
                      restrictionReason = `${item.allowedRoles[0]} only`;
                    } else {
                      const roles = item.allowedRoles.join(', ');
                      restrictionReason = `Requires: ${roles}`;
                    }
                  }
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        w-full 
                        p-4 
                        rounded-lg 
                        text-left 
                        transition-colors
                        min-h-[56px]
                        relative
                        ${isActive 
                          ? 'bg-purple-300 text-purple-900 opacity-75' 
                          : 'bg-white text-zinc-900 hover:bg-zinc-100 opacity-60 border border-zinc-200'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {item.label}
                            <IconLock size={16} className="opacity-50" />
                          </div>
                          {restrictionReason && (
                            <div className="text-xs mt-1 opacity-75">
                              {restrictionReason}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SlideOutMenu;