'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import HelpDialog from '@/components/ui/HelpDialog';
import { mockUser } from '@/lib/placeholderData';

export default function BookingPage() {
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const router = useRouter();

  return (
    <AppLayout 
      title="Booking"
      showUserRoles={true}
      userRoles={['Member', 'Participant']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Links</h2>
          <div className="space-y-3">
            <NavigationCard
              title="Booking form"
              subtitle="Make an appointment"
              variant="primary"
              onClick={() => router.push('/booking/new')}
            />
            <NavigationCard
              title="Manage bookings"
              subtitle="See upcoming and previous appointments"
              variant="secondary"
              onClick={() => router.push('/booking/manage')}
            />
          </div>
        </section>

        <HelpButton
          text="Help with bookings"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <HelpDialog 
        isOpen={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)} 
        pageName="Booking" 
      />
    </AppLayout>
  );
}