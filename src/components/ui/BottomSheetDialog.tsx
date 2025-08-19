import { ReactNode } from 'react';
import { Modal } from '@mantine/core';
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
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content
          className={`
                   bg-white 
                   flex 
                   flex-col 
                   rounded-t-[10px] 
                   h-fit 
                   mt-24 
                   fixed 
                   bottom-0 
                   left-0 
                   right-0 
                   z-50
                   outline-none
                   ${scrollable ? '' : ''}
                   ${className}
                 `}
          style={scrollable ? { maxHeight } : {}}
        >
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4 mt-4" />

          {title && (
            <div className="px-6 pb-2">
              <Drawer.Title className="text-4xl font-semibold text-gray-900">
                {title}
              </Drawer.Title>
            </div>
          )}

          <div className={`
            px-6 pb-12 pt-2 flex-1
            ${scrollable ? 'overflow-y-auto overflow-x-hidden' : 'overflow-auto'}
          `}>
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