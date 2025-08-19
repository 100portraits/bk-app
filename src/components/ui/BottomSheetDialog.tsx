import { ReactNode } from 'react';
import { Modal } from '@mantine/core';

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
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={title}
      position="bottom"
      size="lg"
      radius="lg"
      classNames={{
        modal: `!mt-auto !mb-0 !max-h-[80vh] ${className}`,
        header: 'border-b border-gray-200 pb-3',
        title: 'font-semibold text-lg',
        body: 'pt-4'
      }}
      withCloseButton={false}
    >
      <div className="relative">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
        
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        )}
        
        <div>
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default BottomSheetDialog;