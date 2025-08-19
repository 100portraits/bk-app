'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">Links</h2>
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

      <BottomSheetDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        title="Help with bookings"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help with bookings? Describe any issues or questions you have:
          </p>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg resize-none"
            rows={4}
            placeholder="Write your message here..."
          />
          <button className="w-full bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors">
            Send Message
          </button>
        </div>
      </BottomSheetDialog>
    </AppLayout>
  );
}