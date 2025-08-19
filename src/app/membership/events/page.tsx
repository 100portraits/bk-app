'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import EventCard from '@/components/ui/EventCard';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { mockEvents } from '@/lib/placeholderData';

export default function EventCalendarPage() {
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);

  const handleEventClick = (event: typeof mockEvents[0]) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  return (
    <AppLayout title="Member Info">
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Event Calendar</h2>
          <p className="text-gray-600 mb-6">August</p>
          
          <div className="space-y-6">
            {mockEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                subtitle={event.subtitle}
                date={event.date}
                dayOfWeek={event.dayOfWeek}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </div>
        </section>

        <HelpButton
          text="I have a question about an event"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <BottomSheetDialog
        isOpen={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        title="Event Details"
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                {selectedEvent.title} - {selectedEvent.subtitle}
              </h3>
              <p className="text-gray-600">
                {selectedEvent.dayOfWeek}, {selectedEvent.date} {selectedEvent.month}
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="w-full h-48 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <h4 className="font-bold text-purple-900 text-xl mb-2">
                    {selectedEvent.title} Waterland
                  </h4>
                  <p className="text-purple-700 text-sm mb-2">w/ bike kitchen uva</p>
                  <p className="text-purple-800 text-sm">
                    {selectedEvent.time} @ {selectedEvent.location}
                  </p>
                  <div className="mt-4 w-16 h-16 bg-white rounded mx-auto flex items-center justify-center">
                    <div className="text-xs text-purple-900">QR</div>
                  </div>
                </div>
              </div>
            </div>

            {selectedEvent.whatsappGroup && (
              <PrimaryButton fullWidth>
                Join WhatsApp group
              </PrimaryButton>
            )}
          </div>
        )}
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        title="I have a question about an event"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Have a question about an event? Describe any issues or questions you have:
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