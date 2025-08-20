'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import { IconLoader2, IconCalendarEvent, IconClock, IconUser, IconTrash, IconAlertCircle, IconChevronLeft, IconChevronRight, IconEdit } from '@tabler/icons-react';
import { useRequireRole } from '@/hooks/useAuthorization';
import { useBookings } from '@/hooks/useBookings';
import { useShifts } from '@/hooks/useShifts';
import { Booking } from '@/types/bookings';
import { Shift } from '@/types/shifts';
import { format } from 'date-fns';

export default function ManageAppointmentsPage() {
  const { authorized, loading: authLoading } = useRequireRole(['admin']);
  const { 

    updateBookingStatus, 
    cancelBooking, 
    getShiftBookings 
  } = useBookings();
  const { 
    getShifts 
  } = useShifts();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [availableShifts, setAvailableShifts] = useState<Shift[]>([]);
  const [currentShiftIndex, setCurrentShiftIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editStatus, setEditStatus] = useState<Booking['status']>('confirmed');

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
        setCurrentShift(shifts[index]);
        setCurrentDate(new Date(shifts[index].date));
        
        // Load bookings for the first shift
        const shiftBookings = await getShiftBookings(shifts[index].id);
        setBookings(shiftBookings);
      } else {
        setAvailableShifts([]);
        setCurrentShift(null);
        setBookings([]);
      }
    } catch (error) {
      console.error('Error loading shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookingsForShift = async (shift: Shift) => {
    try {
      const shiftBookings = await getShiftBookings(shift.id);
      setBookings(shiftBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;
    
    setDeleting(true);
    try {
      await cancelBooking(selectedBooking.id);
      if (currentShift) {
        await loadBookingsForShift(currentShift);
      }
      setShowDeleteDialog(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking) return;
    
    setUpdating(true);
    try {
      await updateBookingStatus(selectedBooking.id, editStatus);
      if (currentShift) {
        await loadBookingsForShift(currentShift);
      }
      setShowEditDialog(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking. Please try again.');
    } finally {
      setUpdating(false);
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
    setCurrentShift(newShift);
    setCurrentDate(new Date(newShift.date));
    loadBookingsForShift(newShift);
  };

  const getRepairTypeDisplay = (repairType: string) => {
    const mapping: Record<string, string> = {
      'tire_tube': 'Tire/Tube',
      'chain': 'Chain',
      'brakes': 'Brakes',
      'gears': 'Gears',
      'wheel': 'Wheel',
      'other': 'Other'
    };
    return mapping[repairType] || repairType;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  return (
    <AppLayout title="Admin Panel">
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Manage Appointments</h2>
          
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

          {/* Bookings List */}
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <IconLoader2 className="animate-spin" size={24} />
            </div>
          ) : !currentShift ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <IconCalendarEvent size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No upcoming shifts scheduled</p>
              <p className="text-sm text-gray-400 mt-2">Check back later for new shifts</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <IconCalendarEvent size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No bookings for this date</p>
              <p className="text-sm text-gray-400 mt-2">Shift is scheduled but no appointments booked</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">
                          {booking.slot_time.slice(0, 5)} - {getRepairTypeDisplay(booking.repair_type)}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <IconUser size={16} />
                          <span>{booking.user?.email || 'Unknown user'}</span>
                          {booking.is_member && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                              Member
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <IconClock size={16} />
                          <span>Duration: {booking.duration_minutes} minutes</span>
                        </div>
                      </div>
                      
                      {booking.notes && (
                        <p className="text-sm text-gray-500 italic">Note: {booking.notes}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setEditStatus(booking.status);
                          setShowEditDialog(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit status"
                      >
                        <IconEdit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDeleteDialog(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete booking"
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Edit Status Dialog */}
      <BottomSheetDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Edit Booking Status"
      >
        <div className="space-y-4">
          {selectedBooking && (
            <>
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <p className="font-medium text-gray-900">
                  {getRepairTypeDisplay(selectedBooking.repair_type)} - {selectedBooking.slot_time.slice(0, 5)}
                </p>
                <p className="text-gray-600 mt-1">
                  {selectedBooking.user?.email}
                  {selectedBooking.is_member && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                      Member
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Booking['status'])}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="no_show">No Show</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3">
                <SecondaryButton
                  onClick={() => setShowEditDialog(false)}
                  fullWidth
                  disabled={updating}
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  onClick={handleUpdateStatus}
                  fullWidth
                  disabled={updating}
                >
                  {updating ? (
                    <span className="flex items-center justify-center gap-2">
                      <IconLoader2 className="animate-spin" size={20} />
                      Updating...
                    </span>
                  ) : (
                    'Update Status'
                  )}
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      </BottomSheetDialog>

      {/* Delete Confirmation Dialog */}
      <BottomSheetDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Booking"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <IconAlertCircle className="text-red-600 mt-0.5" size={20} />
              <div>
                <p className="text-red-900 font-medium">Are you sure you want to delete this booking?</p>
                <p className="text-red-700 text-sm mt-1">
                  This action cannot be undone. The customer will need to book again if needed.
                </p>
              </div>
            </div>
          </div>

          {selectedBooking && (
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-1">
                {getRepairTypeDisplay(selectedBooking.repair_type)} Repair
              </p>
              <p>Time: {selectedBooking.slot_time.slice(0, 5)}</p>
              <p>Customer: {selectedBooking.user?.email}</p>
            </div>
          )}

          <div className="flex gap-3">
            <SecondaryButton
              onClick={() => setShowDeleteDialog(false)}
              fullWidth
              disabled={deleting}
            >
              Keep Booking
            </SecondaryButton>
            <PrimaryButton
              onClick={handleDeleteBooking}
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
                'Delete Booking'
              )}
            </PrimaryButton>
          </div>
        </div>
      </BottomSheetDialog>
    </AppLayout>
  );
}