'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import BookingListItem from '@/components/ui/BookingListItem';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import RoleBadge from '@/components/ui/RoleBadge';
import { IconCheck, IconX, IconEdit } from '@tabler/icons-react';
import { mockBookings } from '@/lib/placeholderData';

export default function TodaysBookingsPage() {
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);
  const [bookingStatuses, setBookingStatuses] = useState<Record<string, 'pending' | 'completed' | 'no-show' | 'active'>>({
    '1': 'pending',
    '2': 'active'
  });

  const todaysBookings = mockBookings.map(booking => ({
    ...booking,
    status: bookingStatuses[booking.id] || booking.status
  }));

  const handleBookingClick = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const handleStatusChange = (bookingId: string, status: 'completed' | 'no-show') => {
    setBookingStatuses(prev => ({
      ...prev,
      [bookingId]: status
    }));
  };

  return (
    <AppLayout title="Host App">
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Today's Bookings</h2>
          <div className="space-y-3">
            {todaysBookings.map((booking) => (
              <BookingListItem
                key={booking.id}
                customerName={booking.customerName}
                time={booking.time}
                repairDetails={`${booking.repairType}, ${booking.bikeType}`}
                status={bookingStatuses[booking.id] || booking.status}
                onClick={() => handleBookingClick(booking)}
              />
            ))}
          </div>
        </section>

        <HelpButton
          text="Help with today's bookings"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <BottomSheetDialog
        isOpen={showBookingDetails}
        onClose={() => setShowBookingDetails(false)}
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedBooking.customerName} - {selectedBooking.time}
              </h3>
              <RoleBadge role="Community Member" className="mt-2" />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Booking Information:</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Repair type:</span>
                  <p className="font-medium">{selectedBooking.repairType}, {selectedBooking.bikeType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Experience level:</span>
                  <p className="font-medium">{selectedBooking.experienceLevel}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <p className="font-medium capitalize">{bookingStatuses[selectedBooking.id] || selectedBooking.status}</p>
                </div>
              </div>
            </div>

            {(bookingStatuses[selectedBooking.id] === 'pending' || !bookingStatuses[selectedBooking.id]) && (
              <div className="flex gap-3">
                <PrimaryButton
                  icon={<IconCheck size={18} />}
                  onClick={() => {
                    handleStatusChange(selectedBooking.id, 'completed');
                    setShowBookingDetails(false);
                  }}
                  fullWidth
                >
                  Mark Completed
                </PrimaryButton>
                <SecondaryButton
                  icon={<IconX size={18} />}
                  onClick={() => {
                    handleStatusChange(selectedBooking.id, 'no-show');
                    setShowBookingDetails(false);
                  }}
                  fullWidth
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  No-show
                </SecondaryButton>
              </div>
            )}

            {(bookingStatuses[selectedBooking.id] === 'completed' || bookingStatuses[selectedBooking.id] === 'no-show') && (
              <PrimaryButton
                icon={<IconEdit size={18} />}
                fullWidth
              >
                Edit
              </PrimaryButton>
            )}
          </div>
        )}
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        title="Help with today's bookings"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help with managing today's bookings? Describe any issues or questions you have:
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