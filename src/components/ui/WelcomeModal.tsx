import { Modal } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size="lg"
      centered
      withCloseButton={false}
      classNames={{
        modal: 'bg-purple-500 text-white',
        body: 'p-6'
      }}
    >
      <div className="relative">
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 p-2 text-white hover:bg-purple-600 rounded-lg transition-colors"
        >
          <IconX size={24} />
        </button>
        
        <div className="pr-12">
          <h2 className="text-2xl font-bold mb-4">
            Welcome to the new Bike Kitchen app!
          </h2>
          
          <div className="space-y-3 text-purple-50">
            <p>There may be bugs! Sorry, I'm a team of one :)</p>
            
            <p>
              At the bottom of each page you'll find a 'Help' button. 
              You can write anything to me here.
            </p>
            
            <p>
              Broken link, incorrect data, something not loading, or you just don't like it? 
              Let me know. I'll try and fix it ASAP. Thanks!
            </p>
            
            <p className="font-medium">- sahir</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;