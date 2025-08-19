'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CalendarWidget from '@/components/ui/CalendarWidget';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import PillButton from '@/components/ui/PillButton';
import { mockAvailableDates } from '@/lib/placeholderData';

export default function ManageTimeslotsPage() {
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({
    toAdd: [] as string[],
    toRemove: [] as string[]
  });

  const availableDates = ['20 Aug', '27 Aug'];
  const currentSlots = ['3 Aug', '10 Aug'];

  const toggleDateInChanges = (date: string, type: 'add' | 'remove') => {
    setPendingChanges(prev => {
      if (type === 'add') {
        const isSelected = prev.toAdd.includes(date);
        return {
          ...prev,
          toAdd: isSelected 
            ? prev.toAdd.filter(d => d !== date)
            : [...prev.toAdd, date]
        };
      } else {
        const isSelected = prev.toRemove.includes(date);
        return {
          ...prev,
          toRemove: isSelected 
            ? prev.toRemove.filter(d => d !== date)
            : [...prev.toRemove, date]
        };
      }
    });
  };

  const saveChanges = () => {
    setIsEditMode(false);
    setPendingChanges({ toAdd: [], toRemove: [] });
  };

  return (
    <AppLayout title="Admin Panel">
      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-bold text-gray-900">Manage Timeslots</h2>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="text-purple-600 font-medium"
            >
              {isEditMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          <CalendarWidget
            highlightedDates={mockAvailableDates}
          />
        </section>

        {isEditMode && (
          <section className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Open shifts for booking:</h4>
              <div className="flex flex-wrap gap-2">
                {availableDates.map((date) => (
                  <PillButton
                    key={date}
                    selected={pendingChanges.toAdd.includes(date)}
                    onClick={() => toggleDateInChanges(date, 'add')}
                  >
                    {date}
                  </PillButton>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Close shifts:</h4>
              <div className="flex flex-wrap gap-2">
                {currentSlots.map((date) => (
                  <PillButton
                    key={date}
                    selected={pendingChanges.toRemove.includes(date)}
                    onClick={() => toggleDateInChanges(date, 'remove')}
                  >
                    {date}
                  </PillButton>
                ))}
              </div>
            </div>

            <PrimaryButton
              onClick={saveChanges}
              fullWidth
            >
              Save
            </PrimaryButton>
          </section>
        )}

        <HelpButton
          text="Help with managing timeslots"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <BottomSheetDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        title="Help with managing timeslots"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help with managing timeslots? Describe any issues or questions you have:
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