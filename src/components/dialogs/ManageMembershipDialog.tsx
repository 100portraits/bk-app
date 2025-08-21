'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { IconLoader2, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMembership } from '@/hooks/useMembership';

interface ManageMembershipDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageMembershipDialog({ isOpen, onClose }: ManageMembershipDialogProps) {
  const { profile } = useAuth();
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();
  const { cancelMembership } = useMembership();

  const handleCancelMembership = async () => {
    setIsCancelling(true);
    
    try {
      // Cancel the membership
      await cancelMembership();
      
      // Close the dialog first
      onClose();
      setShowCancelConfirmation(false);
      
      // Then navigate to the goodbye page
      setTimeout(() => {
        router.push('/goodbye');
      }, 100);
    } catch (error) {
      console.error('Error cancelling membership:', error);
      alert('Failed to cancel membership. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleClose = () => {
    if (!showCancelConfirmation) {
      onClose();
    }
  };

  if (showCancelConfirmation) {
    return (
      <BottomSheetDialog
        isOpen={isOpen}
        onClose={() => !isCancelling && setShowCancelConfirmation(false)}
        title="Important Notice"
      >
        <div className="space-y-6">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <div className="flex items-start gap-2">
              <IconAlertCircle className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="text-yellow-900 dark:text-yellow-100 font-medium">This button does not actually cancel your membership!</p>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-2">
                  You need to cancel your membership by emailing universiteitsfonds@uva.nl as mentioned before.
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-2">
                  Once you have done that, then go ahead and confirm below.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <SecondaryButton
              onClick={() => setShowCancelConfirmation(false)}
              fullWidth
              disabled={isCancelling}
            >
              Go Back
            </SecondaryButton>
            <PrimaryButton
              onClick={handleCancelMembership}
              fullWidth
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelling ? (
                <span className="flex items-center justify-center gap-2">
                  <IconLoader2 className="animate-spin" size={20} />
                  Updating...
                </span>
              ) : (
                'I understand, cancel my access'
              )}
            </PrimaryButton>
          </div>
        </div>
      </BottomSheetDialog>
    );
  }

  return (
    <BottomSheetDialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage Membership"
    >
      <div className="space-y-6">
        <div>
          <p className="text-zinc-700 dark:text-zinc-300 mb-2">
            Account: <span className="font-medium">{profile?.email || 'Loading...'}</span>
          </p>
          <p className="text-zinc-700 dark:text-zinc-300 mb-6">
            Status: <span className="font-medium text-green-600">Active Member</span>
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-zinc-900 dark:text-white">Cancel monthly contribution</h3>
          <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              If you want to cancel your monthly contribution to the Bike Kitchen, 
              mail universiteitsfonds@uva.nl.
            </p>
            <p>
              Don't forget to mention 'cancel Bike Kitchen contribution' in the e-mail.
            </p>
          </div>
          
          <PrimaryButton 
            fullWidth
            onClick={() => setShowCancelConfirmation(true)}
          >
            I've cancelled my membership
          </PrimaryButton>
        </div>
      </div>
    </BottomSheetDialog>
  );
}