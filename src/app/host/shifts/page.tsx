'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CalendarWidget from '@/components/ui/CalendarWidget';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import PillButton from '@/components/ui/PillButton';
import { mockShifts } from '@/lib/placeholderData';

export default function ShiftCalendarPage() {
  const [showShiftDetails, setShowShiftDetails] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [selectedShift, setSelectedShift] = useState<typeof mockShifts[0] | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({
    toAdd: [] as string[],
    toRemove: [] as string[]
  });

  const shiftDates = [
    new Date('2025-08-03'),
    new Date('2025-08-10'),
    new Date('2025-08-17'),
    new Date('2025-08-24')
  ];

  const availableDates = ['20 Aug', '27 Aug'];
  const currentShifts = ['3 Aug', '10 Aug'];

  const handleShiftClick = (shift: typeof mockShifts[0]) => {
    setSelectedShift(shift);
    setShowShiftDetails(true);
  };

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
    <AppLayout title="Host App">
      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-bold text-gray-900">Shift Calendar</h2>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="text-purple-600 font-medium"
            >
              {isEditMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          <CalendarWidget
            highlightedDates={shiftDates}
          />
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your upcoming shifts:</h3>
          <div className="space-y-2">
            {mockShifts.map((shift) => (
              <button
                key={shift.id}
                onClick={() => handleShiftClick(shift)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{shift.date}</span>
              </button>
            ))}
          </div>
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
                {currentShifts.map((date) => (
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
          text="Help with the shift calendar"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <BottomSheetDialog
        isOpen={showShiftDetails}
        onClose={() => setShowShiftDetails(false)}
        title="My Shift Details"
      >
        {selectedShift && (
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">Shift Date:</span>
              <p className="font-medium">{selectedShift.date}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Shift Time:</span>
              <p className="font-medium">{selectedShift.startTime} - {selectedShift.endTime}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Mechanic:</span>
              <div className="mt-1">
                <PillButton selected>{selectedShift.mechanic}</PillButton>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Hosts:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedShift.hosts.map((host) => (
                  <PillButton key={host}>{host}</PillButton>
                ))}
              </div>
            </div>
          </div>
        )}
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        title="Help with the shift calendar"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help with the shift calendar? Describe any issues or questions you have:
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