'use client';

import { usePathname } from 'next/navigation';
import { useMenu } from '@/contexts/MenuContext';
import SlideOutMenu from '@/components/ui/SlideOutMenu';

const GlobalMenu = () => {
  const { isMenuOpen, closeMenu } = useMenu();
  const pathname = usePathname();

  return (
    <SlideOutMenu 
      isOpen={isMenuOpen}
      onClose={closeMenu}
      currentPath={pathname}
    />
  );
};

export default GlobalMenu;