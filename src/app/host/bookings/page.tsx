'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import BookingListItem from '@/components/ui/BookingListItem';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { IconCheck, IconX, IconLoader2, IconUser, IconClock, IconTools, IconChevronLeft, IconChevronRight, IconCalendarEvent, IconEdit } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRequireRole } from '@/hooks/useAuthorization';
import { BookingsAPI } from '@/lib/bookings/api';
import { ShiftsAPI } from '@/lib/shifts/api';
import { Booking } from '@/types/bookings';
import { Shift } from '@/types/shifts';
import { format, parseISO, isToday, addDays, subDays } from 'date-fns';

export default function UpcomingBookingsPage() {
  const { user } = useAuth();
  const { authorized, loading: authLoading } = useRequireRole(['mechanic', 'host', 'admin']);
  const bookingsAPI = new BookingsAPI();
  const shiftsAPI = new ShiftsAPI();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editStatus, setEditStatus] = useState<'confirmed' | 'completed' | 'no_show'>('confirmed');

  useEffect(() => {
    if (authorized) {
      loadBookingsForDate(currentDate);
    }
  }, [authorized, currentDate]);

  const loadBookingsForDate = async (date: Date) => {
    setLoading(true);
    try {
      // Get shifts for the selected date
      const shifts = await shiftsAPI.getShifts(date, date);
      
      if (shifts.length > 0) {
        setCurrentShift(shifts[0]);
        // Get bookings for this shift
        const shiftBookings = await bookingsAPI.getShiftBookings(shifts[0].id);
        setBookings(shiftBookings);
      } else {
        setCurrentShift(null);
        setBookings([]);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setCurrentDate(current => 
      direction === 'next' ? addDays(current, 1) : subDays(current, 1)
    );
  };

  const handleStatusChange = async (bookingId: string, status: 'confirmed' | 'completed' | 'no_show') => {
    setUpdatingStatus(true);
    try {
      await bookingsAPI.updateBookingStatus(bookingId, status);
      await loadBookingsForDate(currentDate);
      setShowBookingDetails(false);
      setSelectedBooking(null);
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
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Upcoming Bookings</h2>
          
          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-6 p-4 bg-white border border-gray-200 rounded-lg">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <IconChevronLeft size={20} />
            </button>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {format(currentDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              {isToday(currentDate) && (
                <span className="text-sm text-green-600 font-medium">Today</span>
              )}
              {currentShift && (
                <p className="text-sm text-gray-600 mt-1">
                  Shift: {currentShift.start_time.slice(0, 5)} - {currentShift.end_time.slice(0, 5)}
                </p>
              )}
            </div>
            
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <IconChevronRight size={20} />
            </button>
          </div>

          {!currentShift ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <IconCalendarEvent size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No shift scheduled for this date</p>
              <p className="text-sm text-gray-400 mt-2">Navigate to another day to see bookings</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <IconTools size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No bookings for this date</p>
              <p className="text-sm text-gray-400 mt-2">Enjoy a quieter shift!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <BookingListItem
                  key={booking.id}
                  customerName={booking.user?.email || 'Unknown'}
                  time={booking.slot_time.slice(0, 5)}
                  repairDetails={`${getRepairTypeDisplay(booking.repair_type)} (${booking.duration_minutes} min)`}
                  status={getStatusColor(booking.status)}
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
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedBooking.slot_time.slice(0, 5)} - {getRepairTypeDisplay(selectedBooking.repair_type)}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <IconUser size={16} />
                <span>{selectedBooking.user?.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <IconClock size={16} />
                <span>Duration: {selectedBooking.duration_minutes} minutes</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Repair Details:</h4>
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
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
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">Notes:</span> {selectedBooking.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <p className="font-medium capitalize">{selectedBooking.status}</p>
                </div>
                {(selectedBooking.status === 'completed' || selectedBooking.status === 'no_show') && !editingStatus && (
                  <button
                    onClick={() => {
                      setEditingStatus(true);
                      setEditStatus(selectedBooking.status as 'completed' | 'no_show');
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit status"
                  >
                    <IconEdit size={18} />
                  </button>
                )}
              </div>

              {editingStatus && (
                <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700">Change Status:</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'confirmed' | 'completed' | 'no_show')}
                    className="w-full p-2 border border-gray-200 rounded-lg"
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
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  No-show
                </SecondaryButton>
              </div>
            )}
          </div>
        )}
      </BottomSheetDialog>

      {/* Help Dialog */}
      <BottomSheetDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        title="Help with bookings"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help with managing bookings? Describe any issues or questions you have:
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