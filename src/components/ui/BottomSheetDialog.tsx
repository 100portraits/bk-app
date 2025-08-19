import { ReactNode } from 'react';
import { Modal } from '@mantine/core';
import { Drawer } from 'vaul'

interface BottomSheetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

const BottomSheetDialog = ({
  isOpen,
  onClose,
  title,
  children,
  className = ''
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
                   ${className}
                 `}
        >
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4 mt-4" />

          <div className="px-4 pb-12 pt-6 flex-1 overflow-auto">
            {title && (
              <div className="flex items-center justify-between py-2  mb-4">
                <Drawer.Title className="text-4xl font-semibold text-gray-900">
                  {title}
                </Drawer.Title>

              </div>
            )}

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