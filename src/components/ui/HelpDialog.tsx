'use client';

import { useState } from 'react';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { HelpMessagesAPI } from '@/lib/help-messages/api';
import { IconLoader2, IconCheck } from '@tabler/icons-react';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pageName: string;
  title?: string;
}

export default function HelpDialog({ 
  isOpen, 
  onClose, 
  pageName, 
  title 
}: HelpDialogProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const helpMessagesAPI = new HelpMessagesAPI();

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await helpMessagesAPI.createHelpMessage({
        page_name: pageName,
        message: message.trim()
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        setMessage('');
        setIsSuccess(false);
        onClose();
      }, 4000);
    } catch (error) {
      console.error('Error submitting help message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setMessage('');
      setIsSuccess(false);
      onClose();
    }
  };

  const defaultTitle = `Help with ${pageName.toLowerCase()}`;

  return (
    <BottomSheetDialog
      isOpen={isOpen}
      onClose={handleClose}
      title={title || defaultTitle}
    >
      {isSuccess ? (
        <div className="py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-full">
            <IconCheck size={32} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Message Sent!</h3>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your feedback. I'll look into it.
          </p>
          <p className='text-gray-500'>- sahir</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help with {pageName.toLowerCase()}? Describe any issues or questions you have:
          </p>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg resize-none"
            rows={4}
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
          />
          <PrimaryButton
            onClick={handleSubmit}
            fullWidth
            disabled={isSubmitting || !message.trim()}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <IconLoader2 className="animate-spin" size={20} />
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </PrimaryButton>
        </div>
      )}
    </BottomSheetDialog>
  );
}