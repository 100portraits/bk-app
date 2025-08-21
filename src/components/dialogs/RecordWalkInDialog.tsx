'use client';

import { useState } from 'react';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import ToggleSelector from '@/components/ui/ToggleSelector';
import TextInput from '@/components/ui/TextInput';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { IconLoader2, IconCheck, IconCalendar } from '@tabler/icons-react';
import { useWalkIns } from '@/hooks/useWalkIns';
import { format } from 'date-fns';

interface RecordWalkInDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecordWalkInDialog({ isOpen, onClose }: RecordWalkInDialogProps) {
  const [isCommunityMember, setIsCommunityMember] = useState('No');
  const [amountPaid, setAmountPaid] = useState('');
  const [notes, setNotes] = useState('');
  const [recordDate, setRecordDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { createWalkIn } = useWalkIns();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createWalkIn({
        is_community_member: isCommunityMember === 'Yes',
        amount_paid: isCommunityMember === 'No' ? parseFloat(amountPaid) : undefined,
        notes: notes.trim() || undefined,
        date: recordDate // Pass the date in YYYY-MM-DD format
      });

      // Show success state
      setShowSuccess(true);
      setTimeout(() => {
        // Close dialog first, then reset everything
        onClose();
        // Reset form after a small delay to ensure dialog is fully closed
        setTimeout(() => {
          setShowSuccess(false);
          setAmountPaid('');
          setNotes('');
          setIsCommunityMember('No');
          setRecordDate(format(new Date(), 'yyyy-MM-dd'));
        }, 300);
      }, 1500);
    } catch (error) {
      console.error('Error recording walk-in:', error);
      alert('Failed to record walk-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAmountPaid('');
      setNotes('');
      setIsCommunityMember('No');
      setRecordDate(format(new Date(), 'yyyy-MM-dd'));
      setShowSuccess(false);
      onClose();
    }
  };

  return (
    <BottomSheetDialog
      isOpen={isOpen}
      onClose={handleClose}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Walk-in
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Defaults to today. You can select a past date if needed.
              </p>
            </div>

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
            onClick={handleSubmit}
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
  );
}