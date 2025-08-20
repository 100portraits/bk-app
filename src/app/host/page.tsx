'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import HelpButton from '@/components/ui/HelpButton';
import HelpDialog from '@/components/ui/HelpDialog';
import { useDialog } from '@/contexts/DialogContext';

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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Links</h2>
          <div className="space-y-3">
            <NavigationCard
              title="Today's Bookings"
              subtitle="Manage appointments"
              variant="primary"
              onClick={() => router.push('/host/bookings')}
            />
            <NavigationCard
              title="Record walk-in"
              subtitle=""
              variant="secondary"
              onClick={() => openDialog('record-walkin-dialog')}
            />
            <NavigationCard
              title="See Walk-ins"
              subtitle="View and manage walk-in customers"
              variant="secondary"
              onClick={() => router.push('/host/walk-ins')}
            />
            <NavigationCard
              title="Shift Calendar"
              subtitle="View and edit your shifts"
              variant="secondary"
              onClick={() => router.push('/host/shifts')}
            />
            <NavigationCard
              title="Inventory"
              subtitle="Manage workshop inventory"
              variant="secondary"
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