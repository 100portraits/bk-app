'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function AdminPage() {
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const router = useRouter();

  return (
    <AppLayout 
      title="Admin Panel"
      showUserRoles={true}
      userRoles={['Admin']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Links</h2>
          <div className="space-y-3">
            <NavigationCard
              title="Manage Timeslots"
              subtitle="Open shifts for bookings"
              variant="primary"
              onClick={() => router.push('/admin/timeslots')}
            />
            <NavigationCard
              title="Manage Events"
              subtitle=""
              variant="secondary"
              onClick={() => router.push('/admin/events')}
            />
            <NavigationCard
              title="Manage team"
              subtitle="Change roles/access"
              variant="secondary"
              onClick={() => router.push('/admin/team')}
            />
          </div>
        </section>

        <HelpButton
          text="Help with the admin panel"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <BottomSheetDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        title="Help with the admin panel"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help with admin functions? Describe any issues or questions you have:
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