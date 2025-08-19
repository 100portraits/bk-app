'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import { IconLoader2, IconCalendarEvent, IconClock, IconMapPin, IconAlertCircle, IconX, IconCheck, IconBike } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { BookingsAPI } from '@/lib/bookings/api';
import { Booking } from '@/types/bookings';
import { format, parseISO, isPast, isFuture } from 'date-fns';

export default function ManageBookingsPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const bookingsAPI = new BookingsAPI();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingsAPI.getUserBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    setCancelling(true);
    try {
      await bookingsAPI.cancelBooking(selectedBooking.id);
      await loadBookings();
      setShowCancelDialog(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
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

  // Separate upcoming and past bookings
  const upcomingBookings = bookings.filter(b => 
    b.shift && isFuture(parseISO(`${b.shift.date}T${b.slot_time}`)) && b.status === 'confirmed'
  );
  const pastBookings = bookings.filter(b => 
    b.shift && (isPast(parseISO(`${b.shift.date}T${b.slot_time}`)) || b.status !== 'confirmed')
  );

  if (loading) {
    return (
      <AppLayout title="My Bookings">
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="animate-spin" size={32} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="My Bookings">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold text-gray-900">My Bookings</h2>
          <PrimaryButton
            onClick={() => router.push('/booking/new')}
            size="sm"
          >
            New Booking
          </PrimaryButton>
        </div>

        {/* Upcoming Bookings */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming</h3>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <IconBike size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No upcoming bookings</p>
              <p className="text-sm text-gray-400 mt-2">Ready to fix your bike?</p>
              <PrimaryButton
                onClick={() => router.push('/booking/new')}
                size="sm"
                className="mt-4"
              >
                Book an Appointment
              </PrimaryButton>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">
                          {getRepairTypeDisplay(booking.repair_type)} Repair
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <IconCalendarEvent size={16} />
                          <span>
                            {booking.shift && format(parseISO(booking.shift.date), 'EEEE, MMMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconClock size={16} />
                          <span>
                            {booking.slot_time.slice(0, 5)} ({booking.duration_minutes} minutes)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBooking(booking);
                        setShowCancelDialog(true);
                      }}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <IconX size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Past Bookings</h3>
            <div className="space-y-3">
              {pastBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-75"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-700">
                        {getRepairTypeDisplay(booking.repair_type)} Repair
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <IconCalendarEvent size={16} />
                        <span>
                          {booking.shift && format(parseISO(booking.shift.date), 'EEEE, MMMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconClock size={16} />
                        <span>
                          {booking.slot_time.slice(0, 5)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Booking Details Dialog */}
      <BottomSheetDialog
        isOpen={selectedBooking !== null && !showCancelDialog}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {getRepairTypeDisplay(selectedBooking.repair_type)} Repair
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                {selectedBooking.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <IconCalendarEvent size={16} />
                <span>
                  {selectedBooking.shift && format(parseISO(selectedBooking.shift.date), 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <IconClock size={16} />
                <span>
                  {selectedBooking.slot_time.slice(0, 5)} - Duration: {selectedBooking.duration_minutes} minutes
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <IconMapPin size={16} />
                <span>
                  Bike Kitchen UvA, Roeterseiland Campus
                </span>
              </div>
            </div>

            {selectedBooking.notes && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{selectedBooking.notes}</p>
              </div>
            )}

            {selectedBooking.status === 'confirmed' && isFuture(parseISO(`${selectedBooking.shift?.date}T${selectedBooking.slot_time}`)) && (
              <SecondaryButton
                onClick={() => setShowCancelDialog(true)}
                fullWidth
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Cancel Booking
              </SecondaryButton>
            )}
          </div>
        )}
      </BottomSheetDialog>

      {/* Cancel Confirmation Dialog */}
      <BottomSheetDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        title="Cancel Booking"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <IconAlertCircle className="text-red-600 mt-0.5" size={20} />
              <div>
                <p className="text-red-900 font-medium">Are you sure you want to cancel this booking?</p>
                <p className="text-red-700 text-sm mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {selectedBooking && (
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-1">
                {getRepairTypeDisplay(selectedBooking.repair_type)} Repair
              </p>
              <p>
                {selectedBooking.shift && format(parseISO(selectedBooking.shift.date), 'EEEE, MMMM d')} at {selectedBooking.slot_time.slice(0, 5)}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <SecondaryButton
              onClick={() => setShowCancelDialog(false)}
              fullWidth
              disabled={cancelling}
            >
              Keep Booking
            </SecondaryButton>
            <PrimaryButton
              onClick={handleCancelBooking}
              fullWidth
              disabled={cancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {cancelling ? (
                <span className="flex items-center justify-center gap-2">
                  <IconLoader2 className="animate-spin" size={20} />
                  Cancelling...
                </span>
              ) : (
                'Cancel Booking'
              )}
            </PrimaryButton>
          </div>
        </div>
      </BottomSheetDialog>
    </AppLayout>
  );
}