'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import HelpButton from '@/components/ui/HelpButton';
import HelpDialog from '@/components/ui/HelpDialog';
import { useDialog } from '@/contexts/DialogContext';
import { IconCalendarEvent, IconUserPlus, IconEye, IconCalendar, IconPackage } from '@tabler/icons-react';

export default function HostPage() {
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const router = useRouter();
  const { openDialog } = useDialog();

  return (
    <AppLayout 
      title="Host App"
      showUserRoles={true}
      userRoles={['Mechanic', 'Host', 'Admin']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-zinc-900 mb-4">Links</h2>
          <div className="space-y-3">
            <NavigationCard
              title="Today's Bookings"
              subtitle="Manage appointments"
              variant="border"
              icon={<IconCalendarEvent size={24} />}
              onClick={() => router.push('/host/bookings')}
            />
            <NavigationCard
              title="Record walk-in"
              subtitle=""
              variant="secondary"
              icon={<IconUserPlus size={24} />}
              onClick={() => openDialog('record-walkin-dialog')}
            />
            <NavigationCard
              title="See Walk-ins"
              subtitle="View and manage walk-in customers"
              variant="secondary"
              icon={<IconEye size={24} />}
              onClick={() => router.push('/host/walk-ins')}
            />
            <NavigationCard
              title="Shift Calendar"
              subtitle="View and edit your shifts"
              variant="secondary"
              icon={<IconCalendar size={24} />}
              onClick={() => router.push('/host/shifts')}
            />
            <NavigationCard
              title="Inventory"
              subtitle="Manage workshop inventory"
              variant="secondary"
              icon={<IconPackage size={24} />}
              onClick={() => router.push('/host/inventory')}
            />
            
          </div>
        </section>

        <HelpButton
          text="Help with the host app"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <HelpDialog 
        isOpen={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)} 
        pageName="Host App" 
      />
    </AppLayout>
  );
}