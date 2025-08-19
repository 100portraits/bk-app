'use client';

import { usePathname } from 'next/navigation';
import { useMenu } from '@/contexts/MenuContext';
import TopNavigationBar from '../ui/TopNavigationBar';
import RoleBadge from '../ui/RoleBadge';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  showUserRoles?: boolean;
  userRoles?: string[];
  showBackButton?: boolean;
  showSearchIcon?: boolean;
}

const AppLayout = ({ 
  children, 
  title, 
  showUserRoles = false,
  userRoles = [],
  showBackButton = false,
  showSearchIcon = false
}: AppLayoutProps) => {
  const { openMenu } = useMenu();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigationBar
        title={title}
        onMenuClick={openMenu}
        showSearchIcon={showSearchIcon}
      />
      
      <main className="pb-20">
        {showUserRoles && userRoles.length > 0 && (
          <div className="px-4 py-3 bg-white border-b border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Connected roles:</div>
            <div className="flex flex-wrap gap-2">
              {userRoles.map((role) => (
                <RoleBadge key={role} role={role} />
              ))}
            </div>
          </div>
        )}
        
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;