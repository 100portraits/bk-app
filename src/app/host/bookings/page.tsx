'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import BookingListItem from '@/components/ui/BookingListItem';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import HelpDialog from '@/components/ui/HelpDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { IconCheck, IconX, IconLoader2, IconUser, IconClock, IconTools, IconChevronLeft, IconChevronRight, IconCalendarEvent, IconEdit } from '@tabler/icons-react';
import { useRequireRole } from '@/hooks/useAuthorization';
import { useBookings } from '@/hooks/useBookings';
import { useShifts } from '@/hooks/useShifts';
import { Booking } from '@/types/bookings';
import { Shift } from '@/types/shifts';
import { format, isToday } from 'date-fns';

export default function UpcomingBookingsPage() {
  const { authorized, loading: authLoading } = useRequireRole(['mechanic', 'host', 'admin']);
  const { 
    updateBookingStatus, 
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
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editStatus, setEditStatus] = useState<'confirmed' | 'completed' | 'no_show'>('confirmed');

  useEffect(() => {
    if (authorized) {
      loadUpcomingShifts();
    }
  }, [authorized]);

  const loadUpcomingShifts = async () => {
    setLoading(true);
    try {
      // Get shifts for 30 days in the past and 30 days in the future
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
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

  const navigateShift = (direction: 'prev' | 'next') => {
    if (availableShifts.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      if (currentShiftIndex >= availableShifts.length - 1) return;
      newIndex = currentShiftIndex + 1;
    } else {
      if (currentShiftIndex <= 0) return;
      newIndex = currentShiftIndex - 1;
    }

    const newShift = availableShifts[newIndex];
    setCurrentShiftIndex(newIndex);
    setCurrentShift(newShift);
    setCurrentDate(new Date(newShift.date));
    loadBookingsForShift(newShift);
  };

  const handleStatusChange = async (bookingId: string, status: 'confirmed' | 'completed' | 'no_show') => {
    setUpdatingStatus(true);
    try {
      await updateBookingStatus(bookingId, status);
      if (currentShift) {
        await loadBookingsForShift(currentShift);
      }
      setShowBookingDetails(false);
      setSelectedBooking(null);
      setEditingStatus(false);
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
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
        return 'pending';
      case 'completed':
        return 'completed';
      case 'no_show':
        return 'no-show';
      default:
        return 'pending';
    }
  };

  if (authLoading || loading) {
    return (
      <AppLayout title="Upcoming Bookings">
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
    <AppLayout title="Upcoming Bookings">
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-6">Upcoming Bookings</h2>
          
          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
            <button
              onClick={() => navigateShift('prev')}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
              disabled={availableShifts.length === 0 || currentShiftIndex === 0}
            >
              <IconChevronLeft size={20} className='text-zinc-500 dark:text-zinc-400' />
            </button>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                {format(currentDate, 'EEE, MMM do')}
                {isToday(currentDate) && (
                  <span className="ml-2 text-green-600 dark:text-green-400">Today</span>
                )}
              </h3>
            </div>
            
            <button
              onClick={() => navigateShift('next')}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
              disabled={availableShifts.length === 0 || currentShiftIndex === availableShifts.length - 1}
            >
              <IconChevronRight size={20} className='text-zinc-500 dark:text-zinc-400' />
            </button>
          </div>

          {!currentShift ? (
            <div className="text-center py-12 bg-zinc-50 rounded-lg dark:bg-zinc-800">
              <IconCalendarEvent size={48} className="mx-auto text-zinc-400 mb-2" />
              <p className="text-zinc-500">No upcoming shifts scheduled</p>
              <p className="text-sm text-zinc-400 mt-2">Check back later for new shifts</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-zinc-50 rounded-lg dark:bg-zinc-800">
              <IconTools size={48} className="mx-auto text-zinc-500 mb-2 dark:text-zinc-400" />
              <p className="text-zinc-500 dark:text-zinc-400">No bookings for this date</p>
              <p className="text-sm text-zinc-500 mt-2 dark:text-zinc-400">Enjoy a quieter shift!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <BookingListItem
                  key={booking.id}
                  customerName={booking.name || booking.user?.name || booking.user?.email || 'Unknown'}
                  time={booking.slot_time.slice(0, 5)}
                  repairDetails={`${getRepairTypeDisplay(booking.repair_type)} (${booking.duration_minutes} min)`}
                  status={getStatusColor(booking.status)}
                  isMember={booking.is_member}
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowBookingDetails(true);
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <HelpButton
          text="Help with bookings"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      {/* Booking Details Dialog */}
      <BottomSheetDialog
        isOpen={showBookingDetails}
        onClose={() => {
          setShowBookingDetails(false);
          setEditingStatus(false);
        }}
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                {selectedBooking.slot_time.slice(0, 5)} - {getRepairTypeDisplay(selectedBooking.repair_type)}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-sm text-zinc-600">
                <IconUser size={16} />
                <div className="flex flex-col">
                  {selectedBooking.name && (
                    <span className="font-medium text-zinc-900 dark:text-white">{selectedBooking.name}</span>
                  )}
                  <span className="text-zinc-500 dark:text-zinc-400">{selectedBooking.user?.email || selectedBooking.email}</span>
                </div>
                {selectedBooking.is_member && (
                  <span className="px-2 py-0.5 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 text-xs rounded-full">
                    Member
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                <IconClock size={16} />
                <span >Duration: {selectedBooking.duration_minutes} minutes</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">Repair Details:</h4>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-sm text-zinc-600 dark:text-zinc-300">
                <p><span className="font-medium">Type:</span> {getRepairTypeDisplay(selectedBooking.repair_type)}</p>
                {selectedBooking.repair_details?.bikeType && (
                  <p><span className="font-medium">Bike:</span> {selectedBooking.repair_details.bikeType === 'city' ? 'City bike' : 'Road/Mountain/Touring'}</p>
                )}
                {selectedBooking.repair_details?.wheelPosition && (
                  <p><span className="font-medium">Position:</span> {selectedBooking.repair_details.wheelPosition}</p>
                )}
                {selectedBooking.repair_details?.brakeType && (
                  <p><span className="font-medium">Brake Type:</span> {selectedBooking.repair_details.brakeType}</p>
                )}
              </div>
              
              {selectedBooking.notes && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <span className="font-medium">Notes:</span> {selectedBooking.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">Current Status:</span>
                  <p className="font-medium capitalize text-zinc-900 dark:text-zinc-100">{selectedBooking.status}</p>
                </div>
                {(selectedBooking.status === 'completed' || selectedBooking.status === 'no_show') && !editingStatus && (
                  <button
                    onClick={() => {
                      setEditingStatus(true);
                      setEditStatus(selectedBooking.status as 'completed' | 'no_show');
                    }}
                    className="p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-950 rounded-lg transition-colors"
                    title="Edit status"
                  >
                    <IconEdit size={18} />
                  </button>
                )}
              </div>

              {editingStatus && (
                <div className="space-y-2 p-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Change Status:</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'confirmed' | 'completed' | 'no_show')}
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="no_show">No Show</option>
                  </select>
                  <div className="flex gap-2 mt-3">
                    <SecondaryButton
                      onClick={() => setEditingStatus(false)}
                      size="sm"
                      fullWidth
                    >
                      Cancel
                    </SecondaryButton>
                    <PrimaryButton
                      onClick={async () => {
                        await handleStatusChange(selectedBooking.id, editStatus as 'completed' | 'no_show');
                        setEditingStatus(false);
                      }}
                      size="sm"
                      fullWidth
                      disabled={updatingStatus}
                    >
                      {updatingStatus ? (
                        <span className="flex items-center justify-center gap-2">
                          <IconLoader2 className="animate-spin" size={16} />
                          Saving...
                        </span>
                      ) : (
                        'Save'
                      )}
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </div>

            {selectedBooking.status === 'confirmed' && !editingStatus && (
              <div className="flex gap-3">
                <PrimaryButton
                  icon={<IconCheck size={18} />}
                  onClick={() => handleStatusChange(selectedBooking.id, 'completed')}
                  fullWidth
                  disabled={updatingStatus}
                >
                  {updatingStatus ? (
                    <span className="flex items-center gap-2">
                      <IconLoader2 className="animate-spin" size={18} />
                      Updating...
                    </span>
                  ) : (
                    'Mark Completed'
                  )}
                </PrimaryButton>
                <SecondaryButton
                  icon={<IconX size={18} />}
                  onClick={() => handleStatusChange(selectedBooking.id, 'no_show')}
                  fullWidth
                  disabled={updatingStatus}
                  className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  No-show
                </SecondaryButton>
              </div>
            )}
          </div>
        )}
      </BottomSheetDialog>

      <HelpDialog 
        isOpen={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)} 
        pageName="Bookings Management" 
      />
    </AppLayout>
  );
}