'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CalendarWidget from '@/components/ui/CalendarWidget';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import HelpDialog from '@/components/ui/HelpDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { useRequireRole } from '@/hooks/useAuthorization';
import { useShifts } from '@/hooks/useShifts';
import { Shift } from '@/types/shifts';
import { 
  format, 
  startOfToday,
  addWeeks
} from 'date-fns';
import { IconLoader2, IconUserPlus, IconUserMinus } from '@tabler/icons-react';

export default function ShiftCalendarPage() {
  const { authorized, loading: authLoading } = useRequireRole(['host', 'mechanic', 'admin']);
  const { user, profile, role } = useAuth();
  const { 
    loading, 
    getShifts, 
    toggleShiftSignup: toggleShiftSignupAPI, 
    refresh 
  } = useShifts();
  const [showShiftDetails, setShowShiftDetails] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<{
    toToggle: { shiftId: string; role: 'mechanic' | 'host' }[];
  }>({ toToggle: [] });

  const today = startOfToday();
  const fourWeeksFromNow = addWeeks(today, 4);

  // Load additional shifts for date range
  const [rangeShifts, setRangeShifts] = useState<Shift[]>([]);
  
  useEffect(() => {
    if (authorized) {
      loadRangeShifts();
    }
  }, [authorized]);

  const loadRangeShifts = async () => {
    try {
      const data = await getShifts(today, fourWeeksFromNow);
      setRangeShifts(data);
    } catch (error) {
      console.error('Error loading range shifts:', error);
    }
  };

  // Get open shifts only
  const getOpenShifts = (): Shift[] => {
    return rangeShifts.filter(shift => shift.is_open);
  };

  // Get shifts where user is signed up
  const getUserShifts = (): Shift[] => {
    if (!user) return [];
    
    return rangeShifts.filter(shift => {
      const isMechanic = shift.mechanics?.some(m => m.id === user.id);
      const isHost = shift.hosts?.some(h => h.id === user.id);
      return isMechanic || isHost;
    });
  };

  // Check if user is signed up for a shift in a specific role
  const isUserSignedUp = (shift: Shift, shiftRole: 'mechanic' | 'host'): boolean => {
    if (!user) return false;
    const list = shiftRole === 'mechanic' ? shift.mechanics : shift.hosts;
    return list?.some(u => u.id === user.id) || false;
  };

  // Check if a shift has pending changes
  const hasPendingChange = (shiftId: string, shiftRole: 'mechanic' | 'host'): boolean => {
    return pendingChanges.toToggle.some(
      change => change.shiftId === shiftId && change.role === shiftRole
    );
  };

  // Toggle shift signup in pending changes
  const toggleShiftSignup = (shift: Shift, shiftRole: 'mechanic' | 'host') => {
    setPendingChanges(prev => {
      const existingIndex = prev.toToggle.findIndex(
        change => change.shiftId === shift.id && change.role === shiftRole
      );
      
      if (existingIndex >= 0) {
        // Remove from pending changes
        return {
          toToggle: prev.toToggle.filter((_, index) => index !== existingIndex)
        };
      } else {
        // Add to pending changes
        return {
          toToggle: [...prev.toToggle, { shiftId: shift.id, role: shiftRole }]
        };
      }
    });
  };

  // Save all pending changes
  const saveChanges = async () => {
    if (!user || !profile) return;
    
    try {
      // Apply all pending changes
      for (const change of pendingChanges.toToggle) {
        const shift = rangeShifts.find(s => s.id === change.shiftId);
        if (shift) {
          await toggleShiftSignupAPI(
            shift,
            user.id,
            user.email || '',
            profile.email || user.email || 'Unknown',
            change.role
          );
        }
      }
      
      // Reload shifts
      await refresh();
      await loadRangeShifts();
      
      // Reset state
      setIsEditMode(false);
      setPendingChanges({ toToggle: [] });
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleShiftClick = (shift: Shift) => {
    setSelectedShift(shift);
    setShowShiftDetails(true);
  };

  if (authLoading) {
    return (
      <AppLayout title="Shift Calendar">
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="animate-spin" size={32} />
        </div>
      </AppLayout>
    );
  }

  if (!authorized) {
    return null;
  }

  const openShifts = getOpenShifts();
  const userShifts = getUserShifts();
  const highlightedDates = userShifts.map(shift => new Date(shift.date));
  const availableShiftDates = openShifts.map(shift => new Date(shift.date));
  
  // Determine which role section to show based on user's role
  const canSignUpAsMechanic = role === 'mechanic' || role === 'admin';
  const canSignUpAsHost = role === 'host' || role === 'mechanic' || role === 'admin';

  return (
    <AppLayout title="Shift Calendar">
      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">Shift Calendar</h2>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="px-4 py-2 text-accent-600 dark:text-accent-400 font-medium hover:bg-accent-50 dark:hover:bg-accent-950 rounded-lg transition-colors"
              disabled={loading}
            >
              {isEditMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          <div className="mb-4 space-y-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Click Edit to sign up for shifts.
            </p>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-accent-100 dark:bg-accent-900 border-2 border-accent-500"></span>
                <span className="text-zinc-600 dark:text-zinc-400">Your shifts</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-yellow-50 dark:bg-yellow-900/20 border-2 border-dashed border-yellow-400 dark:border-yellow-600"></span>
                <span className="text-zinc-600 dark:text-zinc-400">Available to sign up</span>
              </span>
            </div>
          </div>
          
          <CalendarWidget
            highlightedDates={highlightedDates}
            availableDates={availableShiftDates}
          />
        </section>

        <section>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Your upcoming shifts:</h3>
          {userShifts.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400">You haven't signed up for any shifts yet.</p>
          ) : (
            <div className="space-y-2">
              {userShifts.map((shift) => (
                <button
                  key={shift.id}
                  onClick={() => handleShiftClick(shift)}
                  className="w-full p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-left hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-white">
                        {format(new Date(shift.date), 'EEEE, MMM d')}
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">
                        {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {shift.mechanics?.some(m => m.id === user?.id) && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                          Mechanic
                        </span>
                      )}
                      {shift.hosts?.some(h => h.id === user?.id) && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                          Host
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {isEditMode && (
          <section className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Click on shifts to sign up or remove yourself. Green means you're signed up, zinc means you're not.
              </p>
            </div>

            {canSignUpAsMechanic && (
              <div>
                <h4 className="font-medium text-zinc-900 dark:text-white mb-3">
                  Sign up as Mechanic:
                </h4>
                <div className="space-y-2">
                  {openShifts.map((shift) => {
                    const isSignedUp = isUserSignedUp(shift, 'mechanic');
                    const hasPending = hasPendingChange(shift.id, 'mechanic');
                    const willBeSignedUp = hasPending ? !isSignedUp : isSignedUp;
                    
                    return (
                      <button
                        key={`${shift.id}-mechanic`}
                        onClick={() => toggleShiftSignup(shift, 'mechanic')}
                        className={`
                          w-full p-3 rounded-lg border-2 transition-all text-left
                          ${willBeSignedUp 
                            ? hasPending 
                              ? 'bg-green-100 dark:bg-green-900/50 border-green-400 dark:border-green-600' 
                              : 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700'
                            : hasPending
                              ? 'bg-red-100 dark:bg-red-900/50 border-red-400 dark:border-red-600'
                              : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                          }
                          hover:scale-[1.02]
                        `}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">
                              {format(new Date(shift.date), 'EEE, MMM d')}
                            </span>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400 ml-2">
                              {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                            </span>
                            {shift.mechanics && shift.mechanics.length > 0 && (
                              <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2">
                                ({shift.mechanics.length} mechanic{shift.mechanics.length !== 1 ? 's' : ''})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {willBeSignedUp ? (
                              <>
                                <IconUserMinus size={20} className="text-zinc-700 dark:text-zinc-200" />
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Signed up</span>
                              </>
                            ) : (
                              <>
                                <IconUserPlus size={20} className="text-zinc-700 dark:text-zinc-200" />
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Sign up</span>
                              </>
                            )}
                            {hasPending && (
                              <span className="text-xs text-yellow-600 dark:text-yellow-400">(pending)</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {canSignUpAsHost && (
              <div>
                <h4 className="font-medium text-zinc-900 dark:text-white mb-3">
                  Sign up as Host:
                </h4>
                <div className="space-y-2">
                  {openShifts.map((shift) => {
                    const isSignedUp = isUserSignedUp(shift, 'host');
                    const hasPending = hasPendingChange(shift.id, 'host');
                    const willBeSignedUp = hasPending ? !isSignedUp : isSignedUp;
                    
                    return (
                      <button
                        key={`${shift.id}-host`}
                        onClick={() => toggleShiftSignup(shift, 'host')}
                        className={`
                          w-full p-3 rounded-lg border-2 transition-all text-left
                          ${willBeSignedUp 
                            ? hasPending 
                              ? 'bg-green-100 dark:bg-green-900/50 border-green-400 dark:border-green-600' 
                              : 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700'
                            : hasPending
                              ? 'bg-red-100 dark:bg-red-900/50 border-red-400 dark:border-red-600'
                              : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                          }
                          hover:scale-[1.02]
                        `}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">
                              {format(new Date(shift.date), 'EEE, MMM d')}
                            </span>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400 ml-2">
                              {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                            </span>
                            {shift.hosts && shift.hosts.length > 0 && (
                              <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2">
                                ({shift.hosts.length} host{shift.hosts.length !== 1 ? 's' : ''})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {willBeSignedUp ? (
                              <>
                                <IconUserMinus size={20} className="text-zinc-700 dark:text-zinc-200" />
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Signed up</span>
                              </>
                            ) : (
                              <>
                                <IconUserPlus size={20} className="text-zinc-700 dark:text-zinc-200" />
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Sign up</span>
                              </>
                            )}
                            {hasPending && (
                              <span className="text-xs text-yellow-600 dark:text-yellow-400">(pending)</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {pendingChanges.toToggle.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                  {pendingChanges.toToggle.length} change(s) pending
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
                className="px-6 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
            </div>
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
        title="Shift Details"
      >
        {selectedShift && (
          <div className="space-y-4">
            <div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Date:</span>
              <p className="font-medium text-zinc-800 dark:text-zinc-100">{format(new Date(selectedShift.date), 'EEEE, MMMM d, yyyy')}</p>
            </div>
            <div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Time:</span>
              <p className="font-medium text-zinc-800 dark:text-zinc-100">
                {selectedShift.start_time.slice(0, 5)} - {selectedShift.end_time.slice(0, 5)}
              </p>
            </div>
            <div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Mechanics ({selectedShift.mechanics?.length || 0}):</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedShift.mechanics?.length ? (
                  selectedShift.mechanics.map((mechanic) => (
                    <span 
                      key={mechanic.id}
                      className={`px-3 py-1 rounded-full text-sm ${
                        mechanic.id === user?.id 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      }`}
                    >
                      {mechanic.name}
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-400 dark:text-zinc-500">No mechanics signed up</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Hosts ({selectedShift.hosts?.length || 0}):</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedShift.hosts?.length ? (
                  selectedShift.hosts.map((host) => (
                    <span 
                      key={host.id}
                      className={`px-3 py-1 rounded-full text-sm ${
                        host.id === user?.id 
                          ? 'bg-green-500 text-white' 
                          : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      }`}
                    >
                      {host.name}
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-400 dark:text-zinc-500">No hosts signed up</span>
                )}
              </div>
            </div>
          </div>
        )}
      </BottomSheetDialog>

      <HelpDialog 
        isOpen={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)} 
        pageName="Shift Calendar" 
      />
    </AppLayout>
  );
}