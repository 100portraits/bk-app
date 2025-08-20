'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import Avatar from '@/components/ui/Avatar';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import { IconExternalLink, IconAlertCircle, IconLoader2 } from '@tabler/icons-react';
import { useMembership } from '@/hooks/useMembership';
import { useAuth } from '@/contexts/AuthContext';

export default function BecomeMemberPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const { becomeMember, loading } = useMembership();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleJoinCommunity = () => {
    window.open('https://doneren.auf.nl/bike-kitchen', '_blank');
  };

  const handleAlreadyMember = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmMembership = async () => {
    setIsUpdating(true);
    try {
      await becomeMember();
      router.push('/become-member/welcome');
    } catch (error) {
      console.error('Error updating membership status:', error);
      alert('Failed to update membership status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AppLayout title="Become a Member">
      <div className="space-y-8">
        <section className="">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Great that you want to join!
          </h1>
          
          <div className="text-left space-y-4">
            <p className="text-xl font-medium text-gray-900">
              For €4/month, you get:
            </p>
            
            <ul className="space-y-2 text-gray-700">
              <li>• unlimited access to the BK space</li>
              <li>• join monthly workshops</li>
              <li>• join monthly community borrels</li>
              <li>• be part of a repair-enthusiast community</li>
              <li>• support our goal - we are run on donations</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">How to join:</h2>
          <ol className="space-y-2 text-gray-700">
            <li>1. go to "Join the Community" </li>
            <li>2. choose 'I donate → monthly' → €4 (or more)</li>
            <li>3. fill in your details</li>
            <li>4. Done! Return to this page and select 'I became a member already'</li>
          </ol>
        </section>

        <section className="space-y-4">
          <SecondaryButton
            onClick={handleJoinCommunity}
            fullWidth
            
          >
            <span className="font-medium">Join the community</span>
            <a href='https://doneren.auf.nl/bike-kitchen' target='_blank' rel='noopener noreferrer'>
              <IconExternalLink className="inline -mt-1" size={16} />
            </a>
          </SecondaryButton>
          
          <PrimaryButton
            onClick={handleAlreadyMember}
            fullWidth
          >
            <span className="font-bold text-xl">I became a member already!</span>
          </PrimaryButton>
        </section>
      </div>

      <BottomSheetDialog
        isOpen={showConfirmDialog}
        onClose={() => !isUpdating && setShowConfirmDialog(false)}
        title="Important Notice"
      >
        <div className="space-y-6">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <IconAlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="text-yellow-900 font-medium">This button does not actually sign you up as a member!</p>
                <p className="text-yellow-700 text-sm mt-2">
                  You need to sign up on the AUF website as mentioned before.
                </p>
                <p className="text-yellow-700 text-sm mt-2">
                  Once you have done that and set up your €4/month donation, then go ahead and confirm below.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <SecondaryButton
              onClick={() => setShowConfirmDialog(false)}
              fullWidth
              disabled={isUpdating}
            >
              Go Back
            </SecondaryButton>
            <PrimaryButton
              onClick={handleConfirmMembership}
              fullWidth
              disabled={isUpdating}
            >
              {isUpdating ? (
                <span className="flex items-center justify-center gap-2">
                  <IconLoader2 className="animate-spin" size={20} />
                  Updating...
                </span>
              ) : (
                'I understand, activate my membership'
              )}
            </PrimaryButton>
          </div>
        </div>
      </BottomSheetDialog>
    </AppLayout>
  );
}