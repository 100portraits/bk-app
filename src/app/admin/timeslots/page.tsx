'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CalendarWidget from '@/components/ui/CalendarWidget';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import HelpDialog from '@/components/ui/HelpDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import PillButton from '@/components/ui/PillButton';
import { useRequireAdmin } from '@/hooks/useAuthorization';
import { useShifts } from '@/hooks/useShifts';
import { Shift, DayOfWeek, DEFAULT_SHIFTS } from '@/types/shifts';
import { 
  format, 
  eachDayOfInterval,
  getDay,
  isSameDay,
  startOfToday,
  addWeeks,
  isAfter,
  isBefore
} from 'date-fns';
import { IconLoader2 } from '@tabler/icons-react';

export default function ManageTimeslotsPage() {
  const { authorized, loading: authLoading } = useRequireAdmin();
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { 
    shifts, 
    loading: shiftsLoading, 
    error: shiftsError, 
    getShifts, 
    toggleShift 
  } = useShifts();
  const [loading, setLoading] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<{
    toToggle: { date: Date; dayOfWeek: DayOfWeek; startTime: string }[];
  }>({ toToggle: [] });

  // Hook handles shifts loading automatically
  const today = startOfToday();
  const fourWeeksFromNow = addWeeks(today, 4);

  // Load shifts on mount
  const [pageShifts, setPageShifts] = useState<Shift[]>([]);
  
  useEffect(() => {
    if (authorized) {
      loadShifts();
    }
  }, [authorized]);

  const loadShifts = async () => {
    setLoading(true);
    try {
      const data = await getShifts(today, fourWeeksFromNow);
      setPageShifts(data);
    } catch (error) {
      console.error('Error loading shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get which dates have open shifts for the calendar
  const getOpenShiftDates = (): Date[] => {
    return pageShifts
      .filter(shift => shift.is_open)
      .map(shift => new Date(shift.date));
  };

  // Get possible shift days (Monday, Wednesday, Thursday) within the next 4 weeks
  const getPossibleShiftDays = (): { date: Date; dayOfWeek: DayOfWeek; hasShift: boolean; isOpen: boolean }[] => {
    const days = eachDayOfInterval({ start: today, end: fourWeeksFromNow });
    
    const possibleDays: { date: Date; dayOfWeek: DayOfWeek; hasShift: boolean; isOpen: boolean }[] = [];
    
    days.forEach(day => {
      const dayNum = getDay(day);
      let dayOfWeek: DayOfWeek | null = null;
      
      if (dayNum === 1) dayOfWeek = 'monday';
      else if (dayNum === 3) dayOfWeek = 'wednesday';
      else if (dayNum === 4) dayOfWeek = 'thursday';
      
      if (dayOfWeek) {
        const shift = pageShifts.find(s => 
          isSameDay(new Date(s.date), day) && 
          s.day_of_week === dayOfWeek
        );
        
        possibleDays.push({
          date: day,
          dayOfWeek,
          hasShift: !!shift,
          isOpen: shift?.is_open || false
        });
      }
    });
    
    return possibleDays;
  };

  const toggleShiftInChanges = (date: Date, dayOfWeek: DayOfWeek) => {
    const startTime = DEFAULT_SHIFTS[dayOfWeek].start + ':00';
    
    setPendingChanges(prev => {
      const existingIndex = prev.toToggle.findIndex(
        item => isSameDay(item.date, date) && item.dayOfWeek === dayOfWeek
      );
      
      if (existingIndex >= 0) {
        // Remove from pending changes
        return {
          toToggle: prev.toToggle.filter((_, index) => index !== existingIndex)
        };
      } else {
        // Add to pending changes
        return {
          toToggle: [...prev.toToggle, { date, dayOfWeek, startTime }]
        };
      }
    });
  };

  const saveChanges = async () => {
    setLoading(true);
    try {
      // Apply all pending changes
      for (const change of pendingChanges.toToggle) {
        await toggleShift(change.date, change.dayOfWeek, change.startTime);
      }
      
      // Reload shifts
      await loadShifts();
      
      // Reset state
      setIsEditMode(false);
      setPendingChanges({ toToggle: [] });
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPendingToggle = (date: Date, dayOfWeek: DayOfWeek): boolean => {
    return pendingChanges.toToggle.some(
      item => isSameDay(item.date, date) && item.dayOfWeek === dayOfWeek
    );
  };

  if (authLoading) {
    return (
      <AppLayout title="Admin Panel">
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="animate-spin" size={32} />
        </div>
      </AppLayout>
    );
  }

  if (!authorized) {
    return null;
  }

  const possibleShiftDays = getPossibleShiftDays();

  return (
    <AppLayout title="Admin Panel">
      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-bold text-gray-900">Manage Timeslots</h2>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="px-4 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-colors"
              disabled={loading}
            >
              {isEditMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Workshop Schedule: Monday 14:00-18:00 | Wednesday 12:00-16:00 | Thursday 16:00-20:00
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Showing dates from today to 4 weeks ahead
            </p>
          </div>
          
          <CalendarWidget
            highlightedDates={getOpenShiftDates()}
          />
        </section>

        {isEditMode && (
          <section className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Click on dates to toggle their open/closed status. Changes will be saved when you click Save.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Available Workshop Days (Next 4 Weeks):
              </h4>
              <div className="flex flex-wrap gap-2">
                {possibleShiftDays.map((day) => {
                  const willToggle = isPendingToggle(day.date, day.dayOfWeek);
                  const currentState = day.hasShift ? day.isOpen : false;
                  const willBeOpen = willToggle ? !currentState : currentState;
                  
                  return (
                    <button
                      key={`${format(day.date, 'yyyy-MM-dd')}-${day.dayOfWeek}`}
                      onClick={() => toggleShiftInChanges(day.date, day.dayOfWeek)}
                      className={`
                        px-4 py-2 rounded-lg border-2 transition-all font-medium text-sm
                        ${willBeOpen 
                          ? willToggle 
                            ? 'bg-green-100 border-green-400 text-green-800' 
                            : 'bg-green-50 border-green-300 text-green-700'
                          : willToggle
                            ? 'bg-red-100 border-red-400 text-red-800'
                            : 'bg-gray-50 border-gray-300 text-gray-600'
                        }
                        hover:scale-105
                      `}
                    >
                      <div>{format(day.date, 'EEE, MMM d')}</div>
                      <div className="text-xs mt-0.5 opacity-75">
                        {willBeOpen ? 'OPEN' : 'CLOSED'}
                        {willToggle && ' (pending)'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {pendingChanges.toToggle.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 font-medium">
                  {pendingChanges.toToggle.length} change(s) pending
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Remember to save your changes!
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <PrimaryButton
                onClick={saveChanges}
                fullWidth
                disabled={loading || pendingChanges.toToggle.length === 0}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <IconLoader2 className="animate-spin" size={20} />
                    Saving...
                  </span>
                ) : (
                  `Save Changes (${pendingChanges.toToggle.length})`
                )}
              </PrimaryButton>
              
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setPendingChanges({ toToggle: [] });
                }}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </section>
        )}

        <HelpButton
          text="Help with managing timeslots"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <HelpDialog 
        isOpen={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)} 
        pageName="Timeslots" 
      />
    </AppLayout>
  );
}