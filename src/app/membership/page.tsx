'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import HelpDialog from '@/components/ui/HelpDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { useRequireMember } from '@/hooks/useAuthorization';
import { IconLoader2, IconAlertCircle } from '@tabler/icons-react';
import { useMembership } from '@/hooks/useMembership';

export default function MembershipPage() {
  const { authorized, loading: authLoading } = useRequireMember();
  const { profile, refreshProfile } = useAuth();
  const [showManageMembership, setShowManageMembership] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();
  const { cancelMembership } = useMembership();

  if (authLoading) {
    return (
      <AppLayout title="Member Info">
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="animate-spin" size={32} />
        </div>
      </AppLayout>
    );
  }

  if (!authorized) {
    return null;
  }

  const handleCancelMembership = () => {
    // Navigate to goodbye page with a query parameter to indicate cancellation
    router.push('/goodbye?cancel=true');
  };

  return (
    <AppLayout 
      title="Member Info"
      showUserRoles={true}
      userRoles={['Member']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Links</h2>
          <div className="space-y-3">
            <NavigationCard
              title="Event Calendar"
              subtitle="See this month's plan"
              variant="primary"
              onClick={() => router.push('/membership/events')}
            />
            <NavigationCard
              title="Manage Membership"
              subtitle=""
              variant="secondary"
              onClick={() => setShowManageMembership(true)}
            />
          </div>
        </section>

        <HelpButton
          text="I have a question about my membership"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <BottomSheetDialog
        isOpen={showManageMembership}
        onClose={() => setShowManageMembership(false)}
        title="Manage Membership"
      >
        <div className="space-y-6">
          <div>
            <p className="text-gray-700 mb-2">
              Account: <span className="font-medium">{profile?.email || 'Loading...'}</span>
            </p>
            <p className="text-gray-700 mb-6">
              Status: <span className="font-medium text-green-600">Active Member</span>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Cancel monthly contribution</h3>
            <div className="space-y-3 text-sm text-gray-600">
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

      <BottomSheetDialog
        isOpen={showCancelConfirmation}
        onClose={() => !isCancelling && setShowCancelConfirmation(false)}
        title="Important Notice"
      >
        <div className="space-y-6">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <IconAlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="text-yellow-900 font-medium">This button does not actually cancel your membership!</p>
                <p className="text-yellow-700 text-sm mt-2">
                  You need to cancel your membership by emailing universiteitsfonds@uva.nl as mentioned before.
                </p>
                <p className="text-yellow-700 text-sm mt-2">
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

      <HelpDialog 
        isOpen={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)} 
        pageName="Membership" 
      />
    </AppLayout>
  );
}