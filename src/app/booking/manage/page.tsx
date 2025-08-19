'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import InfoCard from '@/components/ui/InfoCard';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { IconEdit, IconX } from '@tabler/icons-react';
import { mockBookings } from '@/lib/placeholderData';

export default function ManageBookingsPage() {
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);

  const upcomingBookings = mockBookings.filter(b => b.isUpcoming);
  const previousBookings = mockBookings.filter(b => !b.isUpcoming);

  const handleBookingClick = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  return (
    <AppLayout 
      title="Manage Bookings"
      showUserRoles={true}
      userRoles={['Member', 'Participant']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming:</h2>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <InfoCard
                  key={booking.id}
                  name={booking.customerName}
                  time={`${booking.dayOfWeek}, ${booking.date} - ${booking.time}`}
                  details={`${booking.repairType}, ${booking.bikeType}`}
                  status={booking.status}
                  onClick={() => handleBookingClick(booking)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
              No upcoming bookings
            </div>
          )}
        </section>

        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Previous:</h2>
          {previousBookings.length > 0 ? (
            <div className="space-y-3">
              {previousBookings.map((booking) => (
                <InfoCard
                  key={booking.id}
                  name={booking.customerName}
                  time={`${booking.dayOfWeek}, ${booking.date} - ${booking.time}`}
                  details={`${booking.repairType}, ${booking.bikeType}`}
                  status={booking.status}
                  onClick={() => handleBookingClick(booking)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
              No previous bookings
            </div>
          )}
        </section>

        <HelpButton
          text="Help with managing bookings"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <BottomSheetDialog
        isOpen={showBookingDetails}
        onClose={() => setShowBookingDetails(false)}
        title={selectedBooking?.isUpcoming ? "Your Appointment" : "View Details"}
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Repair type:</span>
                <p className="font-medium">{selectedBooking.repairType}, {selectedBooking.bikeType}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Date:</span>
                <p className="font-medium">{selectedBooking.date} ({selectedBooking.dayOfWeek})</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Mechanic:</span>
                <p className="font-medium">{selectedBooking.mechanic}</p>
              </div>
            </div>

            {selectedBooking.isUpcoming && (
              <div className="flex gap-3">
                <PrimaryButton
                  icon={<IconEdit size={18} />}
                  fullWidth
                >
                  Edit
                </PrimaryButton>
                <SecondaryButton
                  icon={<IconX size={18} />}
                  fullWidth
                >
                  Cancel
                </SecondaryButton>
              </div>
            )}
          </div>
        )}
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        title="Help with managing bookings"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help with managing your bookings? Describe any issues or questions you have:
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