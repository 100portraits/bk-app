'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import HelpButton from '@/components/ui/HelpButton';
import HelpDialog from '@/components/ui/HelpDialog';
import { useRequireMember } from '@/hooks/useAuthorization';
import { useDialog } from '@/contexts/DialogContext';
import { IconLoader2 } from '@tabler/icons-react';

export default function MembershipPage() {
  const { authorized, loading: authLoading } = useRequireMember();
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const router = useRouter();
  const { openDialog } = useDialog();

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
              onClick={() => openDialog('manage-membership-dialog')}
            />
          </div>
        </section>

        <HelpButton
          text="I have a question about my membership"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <HelpDialog 
        isOpen={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)} 
        pageName="Membership" 
      />
    </AppLayout>
  );
}