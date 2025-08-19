import { IconX, IconMenu2 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface SlideOutMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

const menuItems = [
  { label: 'Home', path: '/home' },
  { label: 'Booking', path: '/booking' },
  { label: 'Host App', path: '/host' },
  { label: 'Membership', path: '/membership' },
  { label: 'Admin', path: '/admin' },
  { label: 'Become a member', path: '/become-member' }
];

const SlideOutMenu = ({ isOpen, onClose, currentPath }: SlideOutMenuProps) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      <div 
        className={`
          fixed 
          top-0 
          left-0 
          h-full 
          w-80 
          bg-purple-100 
          z-50 
          transform 
          transition-transform 
          duration-300 
          ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-semibold text-gray-900">Menu</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <IconX size={24} className="text-gray-700" />
              </button>
              <button className="p-2 rounded-lg hover:bg-purple-200 transition-colors">
                <IconMenu2 size={24} className="text-gray-700" />
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {menuItems.map((item) => {
              const isActive = currentPath === item.path;
              
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
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SlideOutMenu;