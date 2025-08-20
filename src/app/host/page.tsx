'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import HelpDialog from '@/components/ui/HelpDialog';
import ToggleSelector from '@/components/ui/ToggleSelector';
import TextInput from '@/components/ui/TextInput';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { IconLoader2, IconCheck } from '@tabler/icons-react';
import { WalkInsAPI } from '@/lib/walk-ins/api';

export default function HostPage() {
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showWalkInDialog, setShowWalkInDialog] = useState(false);
  const [isCommunityMember, setIsCommunityMember] = useState('No');
  const [amountPaid, setAmountPaid] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const walkInsAPI = new WalkInsAPI();

  const handleWalkInSubmit = async () => {
    setIsSubmitting(true);
    try {
      await walkInsAPI.createWalkIn({
        is_community_member: isCommunityMember === 'Yes',
        amount_paid: isCommunityMember === 'No' ? parseFloat(amountPaid) : undefined,
        notes: notes.trim() || undefined
      });
      
      // Show success state
      setShowSuccess(true);
      setTimeout(() => {
        setShowWalkInDialog(false);
        setShowSuccess(false);
        setAmountPaid('');
        setNotes('');
        setIsCommunityMember('No');
      }, 1500);
    } catch (error) {
      console.error('Error recording walk-in:', error);
      alert('Failed to record walk-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        onClose={() => {
          if (!isSubmitting) {
            setShowWalkInDialog(false);
            setAmountPaid('');
            setNotes('');
            setIsCommunityMember('No');
            setShowSuccess(false);
          }
        }}
        title="Add Walk-In"
      >
        {showSuccess ? (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-full">
              <IconCheck size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Walk-in Recorded!</h3>
            <p className="mt-2 text-sm text-gray-600">
              {isCommunityMember === 'Yes' 
                ? 'Community member visit recorded' 
                : `Payment of €${amountPaid} recorded`}
            </p>
          </div>
        ) : (
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
                    Amount paid (€)
                  </label>
                  <TextInput
                    type="number"
                    placeholder="0.00"
                    value={amountPaid}
                    onChange={setAmountPaid}
                    fullWidth
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none"
                  rows={3}
                  placeholder="Any additional information..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <PrimaryButton
              onClick={handleWalkInSubmit}
              fullWidth
              disabled={isSubmitting || (isCommunityMember === 'No' && !amountPaid)}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <IconLoader2 className="animate-spin" size={20} />
                  Recording...
                </span>
              ) : (
                'Submit'
              )}
            </PrimaryButton>
          </div>
        )}
      </BottomSheetDialog>

      <HelpDialog 
        isOpen={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)} 
        pageName="Host App" 
      />
    </AppLayout>
  );
}