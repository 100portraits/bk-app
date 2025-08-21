'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import HelpButton from '@/components/ui/HelpButton';
import HelpDialog from '@/components/ui/HelpDialog';
import { IconCalendarEvent, IconClipboardList } from '@tabler/icons-react';

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
          <h2 className="text-4xl font-bold text-zinc-900 mb-4">Links</h2>
          <div className="space-y-3">
            <NavigationCard
              title="Booking form"
              subtitle="Make an appointment"
              variant="border"
              icon={<IconCalendarEvent size={24} />}
              onClick={() => router.push('/booking/new')}
            />
            <NavigationCard
              title="Manage bookings"
              subtitle="See upcoming and previous appointments"
              variant="secondary"
              icon={<IconClipboardList size={24} />}
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