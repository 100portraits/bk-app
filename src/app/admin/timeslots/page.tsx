'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CalendarWidget from '@/components/ui/CalendarWidget';
import HelpButton from '@/components/ui/HelpButton';
import HelpDialog from '@/components/ui/HelpDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import TextInput from '@/components/ui/TextInput';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import { useRequireAdmin } from '@/hooks/useAuthorization';
import { useShifts } from '@/hooks/useShifts';
import { Shift, DayOfWeek, DAY_NAMES, DAY_LABELS } from '@/types/shifts';
import { 
  format, 
  eachDayOfInterval,
  getDay,
  isSameDay,
  startOfToday,
  addWeeks,
  parseISO,
} from 'date-fns';
import { IconLoader2, IconPlus, IconTrash, IconClock, IconCalendar } from '@tabler/icons-react';

export default function ManageTimeslotsPage() {
  const { authorized, loading: authLoading } = useRequireAdmin();
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<string | null>(null);
  const { 
    getShifts, 
    toggleShift,
    createShift,
    deleteShift,
  } = useShifts();
  const [loading, setLoading] = useState(false);
  const [pageShifts, setPageShifts] = useState<Shift[]>([]);
  
  // New shift form state
  const [newShiftDate, setNewShiftDate] = useState('');
  const [newShiftDay, setNewShiftDay] = useState<DayOfWeek>('monday');
  const [newShiftStart, setNewShiftStart] = useState('14:00');
  const [newShiftEnd, setNewShiftEnd] = useState('18:00');
  const [newShiftNotes, setNewShiftNotes] = useState('');
  
  // Date range for viewing
  const today = startOfToday();
  const eightWeeksFromNow = addWeeks(today, 8);
  
  useEffect(() => {
    if (authorized) {
      loadShifts();
    }
  }, [authorized]);

  const loadShifts = async () => {
    setLoading(true);
    try {
      const data = await getShifts(today, eightWeeksFromNow);
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

  const handleToggleShift = async (shiftId: string) => {
    const shift = pageShifts.find(s => s.id === shiftId);
    if (!shift) return;
    
    setLoading(true);
    try {
      await toggleShift(
        new Date(shift.date), 
        shift.day_of_week, 
        shift.start_time
      );
      await loadShifts();
    } catch (error) {
      console.error('Error toggling shift:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (shiftId: string) => {
    setShiftToDelete(shiftId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!shiftToDelete) return;
    
    setLoading(true);
    try {
      await deleteShift(shiftToDelete);
      await loadShifts();
    } catch (error) {
      console.error('Error deleting shift:', error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setShiftToDelete(null);
    }
  };

  const handleAddNewShift = async () => {
    if (!newShiftDate || !newShiftStart || !newShiftEnd) {
      alert('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const date = parseISO(newShiftDate);
      const dayNum = getDay(date);
      const dayOfWeek = DAY_NAMES[dayNum === 0 ? 6 : dayNum - 1]; // Convert Sunday=0 to Sunday=6
      
      await createShift({
        date: newShiftDate,
        day_of_week: dayOfWeek,
        start_time: `${newShiftStart}:00`,
        end_time: `${newShiftEnd}:00`,
        is_open: true,
        notes: newShiftNotes || undefined,
      });
      
      await loadShifts();
      setShowAddDialog(false);
      // Reset form
      setNewShiftDate('');
      setNewShiftStart('14:00');
      setNewShiftEnd('18:00');
      setNewShiftNotes('');
    } catch (error) {
      console.error('Error creating shift:', error);
      alert('Failed to create timeslot');
    } finally {
      setLoading(false);
    }
  };

  // Group shifts by date for display
  const shiftsByDate = pageShifts.reduce((acc, shift) => {
    const date = shift.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(shift);
    return acc;
  }, {} as Record<string, Shift[]>);

  if (authLoading) {
    return (
      <AppLayout title="Manage Timeslots">
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="animate-spin" size={32} />
        </div>
      </AppLayout>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <AppLayout title="Manage Timeslots">
      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">Manage Timeslots</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddDialog(true)}
                className="px-4 py-2 bg-accent-600 dark:bg-accent-700 text-white font-medium hover:bg-accent-700 dark:hover:bg-accent-600 rounded-lg transition-colors flex items-center gap-2"
                disabled={loading}
              >
                <IconPlus size={20} />
                Add Timeslot
              </button>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
              className="px-4 py-2 text-accent-600 dark:text-accent-400 font-medium hover:bg-accent-50 dark:hover:bg-accent-950 rounded-lg transition-colors"
                disabled={loading}
              >
              {isEditMode ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Showing timeslots from today to 8 weeks ahead
            </p>
          </div>
          
          <CalendarWidget
            highlightedDates={getOpenShiftDates()}
          />
        </section>

        {/* Add New Timeslot Dialog */}
        <BottomSheetDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          title="Add New Timeslot"
          scrollable={true}
        >
          <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newShiftDate}
                    onChange={(e) => setNewShiftDate(e.target.value)}
                    min={format(today, 'yyyy-MM-dd')}
                    max={format(eightWeeksFromNow, 'yyyy-MM-dd')}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={newShiftStart}
                      onChange={(e) => setNewShiftStart(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      End Time *
                    </label>
                    <input
                      type="time"
                      value={newShiftEnd}
                      onChange={(e) => setNewShiftEnd(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={newShiftNotes}
                    onChange={(e) => setNewShiftNotes(e.target.value)}
                    placeholder="e.g., Special workshop, Limited tools available, etc."
                    rows={3}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  />
                </div>
          </div>

          <div className="flex gap-2 mt-6">
            <PrimaryButton
              onClick={handleAddNewShift}
              fullWidth
              disabled={loading || !newShiftDate || !newShiftStart || !newShiftEnd}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <IconLoader2 className="animate-spin" size={20} />
                  Creating...
                </span>
              ) : (
                'Create Timeslot'
              )}
            </PrimaryButton>
            
            <SecondaryButton
              onClick={() => setShowAddDialog(false)}
              fullWidth
              disabled={loading}
            >
              Cancel
            </SecondaryButton>
          </div>
        </BottomSheetDialog>

        {/* Timeslots List */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">All Timeslots</h3>
          
          {Object.keys(shiftsByDate).length === 0 ? (
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-8 text-center">
              <IconCalendar size={48} className="mx-auto mb-2 text-zinc-400 dark:text-zinc-500" />
              <p className="text-zinc-600 dark:text-zinc-400">No timeslots scheduled</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Click "Add Timeslot" to create one</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(shiftsByDate)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, shifts]) => {
                  const dateObj = parseISO(date);
                  return (
                    <div key={date} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                      <div className="font-medium text-zinc-900 dark:text-white mb-3">
                        {format(dateObj, 'EEEE, MMMM d, yyyy')}
                      </div>
                      
                      <div className="space-y-2">
                        {shifts.sort((a, b) => a.start_time.localeCompare(b.start_time)).map(shift => (
                          <div
                            key={shift.id}
                            className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                              shift.is_open 
                                ? 'bg-accent-50 dark:bg-accent-950 border-accent-300 dark:border-accent-700' 
                                : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <IconClock size={20} className="text-zinc-600 dark:text-zinc-400" />
                              <div>
                                <div className="font-medium text-zinc-900 dark:text-white">
                                  {shift.start_time.substring(0, 5)} - {shift.end_time.substring(0, 5)}
                                </div>
                                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                  Status: <span className={shift.is_open ? 'text-accent-700 dark:text-accent-400 font-medium' : 'text-zinc-700 dark:text-zinc-400'}>
                                    {shift.is_open ? 'OPEN' : 'CLOSED'}
                                  </span>
                                </div>
                                {shift.notes && (
                                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                    Note: {shift.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {isEditMode && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleToggleShift(shift.id)}
                                  className={`px-3 py-1 rounded-lg font-medium text-sm transition-colors ${
                                    shift.is_open
                                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
                                      : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                                  }`}
                                  disabled={loading}
                                >
                                  {shift.is_open ? 'Close' : 'Open'}
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(shift.id)}
                                  className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                                  disabled={loading}
                                  title="Delete timeslot"
                                >
                                  <IconTrash size={20} />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </section>

        {/* Delete Confirmation Dialog */}
        <BottomSheetDialog
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setShiftToDelete(null);
          }}
          title="Delete Timeslot?"
        >
          <div className="space-y-4">
            <p className="text-zinc-700 dark:text-zinc-300">
              Are you sure you want to delete this timeslot? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="
                  w-full
                  bg-red-600 dark:bg-red-700 
                  text-white 
                  rounded-lg 
                  font-medium 
                  flex 
                  items-center 
                  justify-center 
                  gap-2
                  transition-colors
                  hover:bg-red-700 dark:hover:bg-red-600 
                  disabled:bg-zinc-300 
                  disabled:cursor-not-allowed
                  min-h-[44px]
                  px-6 py-3 text-base
                "
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <IconLoader2 className="animate-spin" size={20} />
                    Deleting...
                  </span>
                ) : (
                  'Delete Timeslot'
                )}
              </button>
              <SecondaryButton
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setShiftToDelete(null);
                }}
                fullWidth
                disabled={loading}
              >
                Cancel
              </SecondaryButton>
            </div>
          </div>
        </BottomSheetDialog>

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