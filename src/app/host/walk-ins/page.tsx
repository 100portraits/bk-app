'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import HelpDialog from '@/components/ui/HelpDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import ToggleSelector from '@/components/ui/ToggleSelector';
import TextInput from '@/components/ui/TextInput';
import { IconEdit, IconTrash, IconLoader2, IconUsers, IconCurrencyEuro, IconChevronLeft, IconChevronRight, IconAlertCircle } from '@tabler/icons-react';
import { useWalkIns } from '@/hooks/useWalkIns';
import { useShifts } from '@/hooks/useShifts';
import { WalkIn } from '@/types/walk-ins';
import { Shift } from '@/types/shifts';
import { format, parseISO } from 'date-fns';
import { useRequireRole } from '@/hooks/useAuthorization';
import { useAuth } from '@/contexts/AuthContext';

export default function WalkInsPage() {
  const { authorized, loading: authLoading } = useRequireRole(['host', 'mechanic', 'admin']);
  const { profile } = useAuth();
  const { 
    loading: walkInsLoading, 
    error: walkInsError, 
    updateWalkIn, 
    deleteWalkIn, 
    getWalkInsByDate, 
    getWalkInStats 
  } = useWalkIns();
  const { 
    loading: shiftsLoading, 
    error: shiftsError, 
    getShifts 
  } = useShifts();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [walkIns, setWalkIns] = useState<WalkIn[]>([]);
  const [availableShifts, setAvailableShifts] = useState<Shift[]>([]);
  const [currentShiftIndex, setCurrentShiftIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, communityMembers: 0, paidCustomers: 0, totalRevenue: 0 });
  
  const [showWalkInDetails, setShowWalkInDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [selectedWalkIn, setSelectedWalkIn] = useState<WalkIn | null>(null);
  
  const [editAmount, setEditAmount] = useState('');
  const [editIsMember, setEditIsMember] = useState('No');
  const [editNotes, setEditNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (authorized) {
      loadUpcomingShifts();
    }
  }, [authorized]);

  const loadUpcomingShifts = async () => {
    setLoading(true);
    try {
      // Get shifts for the next 30 days
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      
      const shifts = await getShifts(startDate, endDate);
      
      if (shifts.length > 0) {
        setAvailableShifts(shifts);
        // Find today's shift or the next upcoming shift
        const todayStr = new Date().toISOString().split('T')[0];
        const todayIndex = shifts.findIndex(s => s.date >= todayStr);
        const index = todayIndex >= 0 ? todayIndex : 0;
        
        setCurrentShiftIndex(index);
        const shiftDate = new Date(shifts[index].date);
        setCurrentDate(shiftDate);
        
        // Load walk-ins for the first shift date
        await loadWalkInsForDate(shiftDate);
      } else {
        setAvailableShifts([]);
        setWalkIns([]);
        setStats({ total: 0, communityMembers: 0, paidCustomers: 0, totalRevenue: 0 });
      }
    } catch (error) {
      console.error('Error loading shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWalkInsForDate = async (date: Date) => {
    try {
      const [walkInsData, statsData] = await Promise.all([
        getWalkInsByDate(date),
        getWalkInStats(
          new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
          new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
        )
      ]);
      setWalkIns(walkInsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading walk-ins:', error);
    }
  };

  const navigateShift = (direction: 'prev' | 'next') => {
    if (availableShifts.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentShiftIndex + 1) % availableShifts.length;
    } else {
      newIndex = currentShiftIndex === 0 ? availableShifts.length - 1 : currentShiftIndex - 1;
    }
    
    const newShift = availableShifts[newIndex];
    setCurrentShiftIndex(newIndex);
    const shiftDate = new Date(newShift.date);
    setCurrentDate(shiftDate);
    loadWalkInsForDate(shiftDate);
  };

  const handleWalkInClick = (walkIn: WalkIn) => {
    setSelectedWalkIn(walkIn);
    setShowWalkInDetails(true);
  };

  const handleEditClick = () => {
    if (selectedWalkIn) {
      setEditAmount(selectedWalkIn.amount_paid?.toString() || '');
      setEditIsMember(selectedWalkIn.is_community_member ? 'Yes' : 'No');
      setEditNotes(selectedWalkIn.notes || '');
      setShowWalkInDetails(false);
      setShowEditDialog(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedWalkIn) return;
    
    setUpdating(true);
    try {
      await updateWalkIn(selectedWalkIn.id, {
        is_community_member: editIsMember === 'Yes',
        amount_paid: editIsMember === 'No' ? parseFloat(editAmount) : null,
        notes: editNotes.trim() || undefined
      });
      await loadWalkInsForDate(currentDate);
      setShowEditDialog(false);
      setSelectedWalkIn(null);
    } catch (error) {
      console.error('Error updating walk-in:', error);
      alert('Failed to update walk-in. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedWalkIn) return;
    
    setDeleting(true);
    try {
      await deleteWalkIn(selectedWalkIn.id);
      await loadWalkInsForDate(currentDate);
      setShowDeleteDialog(false);
      setShowWalkInDetails(false);
      setSelectedWalkIn(null);
    } catch (error) {
      console.error('Error deleting walk-in:', error);
      alert('Failed to delete walk-in. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <AppLayout title="Walk-ins">
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
    <AppLayout title="Walk-ins">
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Walk-ins</h2>
          
          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-6 p-4 bg-white border border-gray-200 rounded-lg">
            <button
              onClick={() => navigateShift('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={availableShifts.length === 0}
            >
              <IconChevronLeft size={20} />
            </button>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {format(currentDate, 'EEE, MMM do')}
                {format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
                  <span className="ml-2 text-green-600">Today</span>
                )}
              </h3>
            </div>
            
            <button
              onClick={() => navigateShift('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={availableShifts.length === 0}
            >
              <IconChevronRight size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <IconUsers size={20} />
                <span className="text-sm font-medium">Community</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{stats.communityMembers}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <IconCurrencyEuro size={20} />
                <span className="text-sm font-medium">Revenue</span>
              </div>
              <p className="text-2xl font-bold text-green-900">€{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          {/* Walk-ins List */}
          {walkIns.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <IconUsers size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No walk-ins recorded for this date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {walkIns.map((walkIn) => (
                <button
                  key={walkIn.id}
                  onClick={() => handleWalkInClick(walkIn)}
                  className="w-full p-4 bg-white border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {walkIn.is_community_member ? (
                          <span className="flex items-center gap-2">
                            Community Member
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                              Free
                            </span>
                          </span>
                        ) : (
                          <span className="text-lg">€{walkIn.amount_paid?.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Recorded at {format(parseISO(walkIn.created_at), 'HH:mm')}
                        {walkIn.notes && (
                          <span className="ml-2 text-gray-500">• Has notes</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      by {walkIn.creator?.email?.split('@')[0] || 'Unknown'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <HelpButton
          text="Help with recording/editing walk-ins"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      {/* Walk-in Details Dialog */}
      <BottomSheetDialog
        isOpen={showWalkInDetails}
        onClose={() => setShowWalkInDetails(false)}
        title='Walk-in Details'
      >
        {selectedWalkIn && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Type:</span>
                <p className="font-medium">
                  {selectedWalkIn.is_community_member ? 'Community Member' : 'Paid Customer'}
                </p>
              </div>
              {!selectedWalkIn.is_community_member && (
                <div>
                  <span className="text-sm text-gray-600">Payment Amount:</span>
                  <p className="font-medium">€{selectedWalkIn.amount_paid?.toFixed(2)}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-600">Recorded:</span>
                <p className="font-medium">
                  {format(parseISO(selectedWalkIn.created_at), 'MMM d, yyyy at HH:mm')}
                </p>
              </div>
              {selectedWalkIn.notes && (
                <div>
                  <span className="text-sm text-gray-600">Notes:</span>
                  <p className="font-medium">{selectedWalkIn.notes}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-600">Recorded by:</span>
                <p className="font-medium">{selectedWalkIn.creator?.email || 'Unknown'}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <PrimaryButton
                icon={<IconEdit size={18} />}
                onClick={handleEditClick}
                fullWidth
              >
                Edit
              </PrimaryButton>
              {profile?.role === 'admin' && (
                <SecondaryButton
                  icon={<IconTrash size={18} />}
                  onClick={() => {
                    setShowWalkInDetails(false);
                    setShowDeleteDialog(true);
                  }}
                  fullWidth
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete
                </SecondaryButton>
              )}
            </div>
          </div>
        )}
      </BottomSheetDialog>

      {/* Edit Dialog */}
      <BottomSheetDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Edit Walk-In"
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
                value={editIsMember}
                onChange={setEditIsMember}
              />
            </div>

            {editIsMember === 'No' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount paid (€)
                </label>
                <TextInput
                  type="number"
                  placeholder="0.00"
                  value={editAmount}
                  onChange={setEditAmount}
                  fullWidth
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg resize-none"
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Any additional information..."
              />
            </div>
          </div>

          <PrimaryButton
            onClick={handleSaveEdit}
            fullWidth
            disabled={updating || (editIsMember === 'No' && !editAmount)}
          >
            {updating ? (
              <span className="flex items-center justify-center gap-2">
                <IconLoader2 className="animate-spin" size={20} />
                Saving...
              </span>
            ) : (
              'Save'
            )}
          </PrimaryButton>
        </div>
      </BottomSheetDialog>

      {/* Delete Confirmation Dialog */}
      <BottomSheetDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Walk-In"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <IconAlertCircle className="text-red-600 mt-0.5" size={20} />
              <div>
                <p className="text-red-900 font-medium">Are you sure you want to delete this walk-in?</p>
                <p className="text-red-700 text-sm mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <SecondaryButton
              onClick={() => setShowDeleteDialog(false)}
              fullWidth
              disabled={deleting}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={handleDelete}
              fullWidth
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <span className="flex items-center justify-center gap-2">
                  <IconLoader2 className="animate-spin" size={20} />
                  Deleting...
                </span>
              ) : (
                'Delete Walk-In'
              )}
            </PrimaryButton>
          </div>
        </div>
      </BottomSheetDialog>

      <HelpDialog 
        isOpen={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)} 
        pageName="Walk-ins" 
      />
    </AppLayout>
  );
}