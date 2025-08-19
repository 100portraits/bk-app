'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { mockUser } from '@/lib/placeholderData';

export default function MembershipPage() {
  const [showManageMembership, setShowManageMembership] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const router = useRouter();

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
        title={`Hi, ${mockUser.name}`}
      >
        <div className="space-y-6">
          <div>
            <p className="text-gray-700 mb-6">
              You have been a member since {mockUser.memberSince}.
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
            
            <PrimaryButton fullWidth>
              I've cancelled my membership
            </PrimaryButton>
          </div>
        </div>
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        title="I have a question about my membership"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Have a question about your membership? Describe any issues or questions you have:
          </p>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg resize-none"
            rows={4}
            placeholder="Write your message here..."
          />
          <PrimaryButton fullWidth>
            Send Message
          </PrimaryButton>
        </div>
      </BottomSheetDialog>
    </AppLayout>
  );
}