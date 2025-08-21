'use client';

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
  showSearchIcon = false
}: AppLayoutProps) => {
  const { openMenu } = useMenu();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <TopNavigationBar
        title={title}
        onMenuClick={openMenu}
        showSearchIcon={showSearchIcon}
      />
      
      <main className="pb-20">
        {showUserRoles && userRoles.length > 0 && (
          <div className="px-6 py-3 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Connected roles:</div>
            <div className="flex flex-wrap gap-2">
              {userRoles.map((role) => (
                <RoleBadge key={role} role={role} />
              ))}
            </div>
          </div>
        )}
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;