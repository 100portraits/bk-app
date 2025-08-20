'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import HelpButton from '@/components/ui/HelpButton';
import HelpDialog from '@/components/ui/HelpDialog';
import { IconClock, IconCalendarEvent, IconUsers, IconClipboardList, IconMessage } from '@tabler/icons-react';

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
              variant="border"
              icon={<IconClock size={24} />}
              onClick={() => router.push('/admin/timeslots')}
            />
            <NavigationCard
              title="Manage Events"
              subtitle=""
              variant="secondary"
              icon={<IconCalendarEvent size={24} />}
              onClick={() => router.push('/admin/events')}
            />
            <NavigationCard
              title="Manage team"
              subtitle="Change roles/access"
              variant="secondary"
              icon={<IconUsers size={24} />}
              onClick={() => router.push('/admin/team')}
            />
            <NavigationCard
              title="Manage Appointments"
              subtitle="View and edit bookings"
              variant="secondary"
              icon={<IconClipboardList size={24} />}
              onClick={() => router.push('/admin/appointments')}
            />
            <NavigationCard
              title="Messages"
              subtitle="Respond to user help requests"
              variant="secondary"
              icon={<IconMessage size={24} />}
              onClick={() => router.push('/admin/messages')}
            />
          </div>
        </section>

        <HelpButton
          text="Help with the admin panel"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <HelpDialog 
        isOpen={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)} 
        pageName="Admin Dashboard" 
      />
    </AppLayout>
  );
}