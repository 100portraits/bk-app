import { ReactNode } from 'react';
import { Drawer } from 'vaul'

interface BottomSheetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
  maxHeight?: string;
}

const BottomSheetDialog = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  scrollable = false,
  maxHeight = '80vh'
}: BottomSheetDialogProps) => {
  return (
    <Drawer.Root 
      open={isOpen} 
      onOpenChange={onClose}
      modal
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content
          className={`
                  bg-zinc-50 dark:bg-zinc-900
                   flex 
                   flex-col 
                   rounded-t-[10px] 
                   fixed 
                   bottom-0 
                   left-0 
                   right-0 
                   z-50
                   outline-none
                   ${className}
                 `}
          style={{
            maxHeight: '80vh',
            height: 'auto',
            WebkitTransform: 'translate3d(0, 0, 0)',
            transform: 'translate3d(0, 0, 0)'
          }}
        >
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600 mb-4 mt-4" />

          {title && (
            <div className={`px-6  pb-6 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900`}>
              <Drawer.Title className="text-4xl font-semibold text-zinc-900 dark:text-white">
                {title}
              </Drawer.Title>
            </div>
          )}

          <div className={`
            px-6 pb-12 flex-1 bg-white dark:bg-zinc-800 pt-6
            overflow-y-auto overflow-x-hidden -webkit-overflow-scrolling-touch
          `}
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}>
            <div>
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default BottomSheetDialog;