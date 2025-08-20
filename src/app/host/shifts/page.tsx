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
  eachDayOfInterval,
  getDay,
  isSameDay,
  startOfToday,
  addWeeks
} from 'date-fns';
import { IconLoader2, IconUserPlus, IconUserMinus } from '@tabler/icons-react';

export default function ShiftCalendarPage() {
  const { authorized, loading: authLoading } = useRequireRole(['host', 'mechanic', 'admin']);
  const { user, profile, role } = useAuth();
  const { 
    shifts, 
    loading, 
    error, 
    getShifts, 
    toggleShiftSignup, 
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
          await toggleShiftSignup(
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
      <AppLayout title="Host App">
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
  
  // Determine which role section to show based on user's role
  const canSignUpAsMechanic = role === 'mechanic' || role === 'admin';
  const canSignUpAsHost = role === 'host' || role === 'mechanic' || role === 'admin';

  return (
    <AppLayout title="Host App">
      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-bold text-gray-900">Shift Calendar</h2>
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
              Your shifts are highlighted. Click Edit to sign up for shifts.
            </p>
          </div>
          
          <CalendarWidget
            highlightedDates={highlightedDates}
          />
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your upcoming shifts:</h3>
          {userShifts.length === 0 ? (
            <p className="text-gray-500">You haven't signed up for any shifts yet.</p>
          ) : (
            <div className="space-y-2">
              {userShifts.map((shift) => (
                <button
                  key={shift.id}
                  onClick={() => handleShiftClick(shift)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900">
                        {format(new Date(shift.date), 'EEEE, MMM d')}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {shift.mechanics?.some(m => m.id === user?.id) && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Mechanic
                        </span>
                      )}
                      {shift.hosts?.some(h => h.id === user?.id) && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Click on shifts to sign up or remove yourself. Green means you're signed up, gray means you're not.
              </p>
            </div>

            {canSignUpAsMechanic && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
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
                              ? 'bg-green-100 border-green-400' 
                              : 'bg-green-50 border-green-300'
                            : hasPending
                              ? 'bg-red-100 border-red-400'
                              : 'bg-gray-50 border-gray-200'
                          }
                          hover:scale-[1.02]
                        `}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">
                              {format(new Date(shift.date), 'EEE, MMM d')}
                            </span>
                            <span className="text-sm text-gray-600 ml-2">
                              {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                            </span>
                            {shift.mechanics && shift.mechanics.length > 0 && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({shift.mechanics.length} mechanic{shift.mechanics.length !== 1 ? 's' : ''})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {willBeSignedUp ? (
                              <>
                                <IconUserMinus size={20} />
                                <span className="text-sm font-medium">Signed up</span>
                              </>
                            ) : (
                              <>
                                <IconUserPlus size={20} />
                                <span className="text-sm font-medium">Sign up</span>
                              </>
                            )}
                            {hasPending && (
                              <span className="text-xs text-yellow-600">(pending)</span>
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
                <h4 className="font-medium text-gray-900 mb-3">
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
                              ? 'bg-green-100 border-green-400' 
                              : 'bg-green-50 border-green-300'
                            : hasPending
                              ? 'bg-red-100 border-red-400'
                              : 'bg-gray-50 border-gray-200'
                          }
                          hover:scale-[1.02]
                        `}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">
                              {format(new Date(shift.date), 'EEE, MMM d')}
                            </span>
                            <span className="text-sm text-gray-600 ml-2">
                              {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                            </span>
                            {shift.hosts && shift.hosts.length > 0 && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({shift.hosts.length} host{shift.hosts.length !== 1 ? 's' : ''})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {willBeSignedUp ? (
                              <>
                                <IconUserMinus size={20} />
                                <span className="text-sm font-medium">Signed up</span>
                              </>
                            ) : (
                              <>
                                <IconUserPlus size={20} />
                                <span className="text-sm font-medium">Sign up</span>
                              </>
                            )}
                            {hasPending && (
                              <span className="text-xs text-yellow-600">(pending)</span>
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
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 font-medium">
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
                className="px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
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
              <span className="text-sm text-gray-600">Date:</span>
              <p className="font-medium">{format(new Date(selectedShift.date), 'EEEE, MMMM d, yyyy')}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Time:</span>
              <p className="font-medium">
                {selectedShift.start_time.slice(0, 5)} - {selectedShift.end_time.slice(0, 5)}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Mechanics ({selectedShift.mechanics?.length || 0}):</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedShift.mechanics?.length ? (
                  selectedShift.mechanics.map((mechanic) => (
                    <span 
                      key={mechanic.id}
                      className={`px-3 py-1 rounded-full text-sm ${
                        mechanic.id === user?.id 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {mechanic.name}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No mechanics signed up</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Hosts ({selectedShift.hosts?.length || 0}):</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedShift.hosts?.length ? (
                  selectedShift.hosts.map((host) => (
                    <span 
                      key={host.id}
                      className={`px-3 py-1 rounded-full text-sm ${
                        host.id === user?.id 
                          ? 'bg-green-500 text-white' 
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {host.name}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No hosts signed up</span>
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