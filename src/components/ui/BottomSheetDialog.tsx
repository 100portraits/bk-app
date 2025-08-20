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
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content
          className={`
                   ${scrollable ? 'bg-gray-50' : 'bg-white'}
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
            <div className={`px-6  ${scrollable ? 'pb-6 border-b border-gray-200 bg-gray-50' : 'pb-2'}`}>
              <Drawer.Title className="text-4xl font-semibold text-gray-900">
                {title}
              </Drawer.Title>
            </div>
          )}

          <div className={`
            px-6 pb-12 flex-1 bg-white ${scrollable ? 'pt-6' : 'pt-2'}
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