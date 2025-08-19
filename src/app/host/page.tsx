'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import ToggleSelector from '@/components/ui/ToggleSelector';
import TextInput from '@/components/ui/TextInput';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function HostPage() {
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showWalkInDialog, setShowWalkInDialog] = useState(false);
  const [isCommunityMember, setIsCommunityMember] = useState('No');
  const [amountPaid, setAmountPaid] = useState('');
  const router = useRouter();

  const handleWalkInSubmit = () => {
    setShowWalkInDialog(false);
    setAmountPaid('');
    setIsCommunityMember('No');
  };

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
              onClick={() => setShowWalkInDialog(true)}
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

      <BottomSheetDialog
        isOpen={showWalkInDialog}
        onClose={() => setShowWalkInDialog(false)}
        title="Add Walk-In"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Community Member?
              </label>
              <ToggleSelector
                options={[
                  { label: 'Yes', value: 'Yes' },
                  { label: 'No', value: 'No' }
                ]}
                value={isCommunityMember}
                onChange={setIsCommunityMember}
              />
            </div>

            {isCommunityMember === 'No' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount paid
                </label>
                <TextInput
                  placeholder="Value"
                  value={amountPaid}
                  onChange={setAmountPaid}
                  fullWidth
                />
              </div>
            )}
          </div>

          <PrimaryButton
            onClick={handleWalkInSubmit}
            fullWidth
            disabled={isCommunityMember === 'No' && !amountPaid}
          >
            Submit
          </PrimaryButton>
        </div>
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        title="Help with the host app"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help with host functions? Describe any issues or questions you have:
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