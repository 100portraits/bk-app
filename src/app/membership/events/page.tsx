'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import EventCard from '@/components/ui/EventCard';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useRequireMember } from '@/hooks/useAuthorization';
import { EventsAPI } from '@/lib/events/api';
import { Event } from '@/types/events';
import { format, parseISO } from 'date-fns';
import { IconLoader2, IconCalendarEvent, IconClock, IconMapPin, IconUsers, IconBrandWhatsapp } from '@tabler/icons-react';

export default function EventCalendarPage() {
  const { authorized, loading: authLoading } = useRequireMember();
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const eventsAPI = new EventsAPI();

  // Load events on mount
  useEffect(() => {
    if (authorized) {
      loadEvents();
    }
  }, [authorized]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      // Members can only see published events
      const data = await eventsAPI.getUpcomingEvents(20, true);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  if (authLoading) {
    return (
      <AppLayout title="Member Info">
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="animate-spin" size={32} />
        </div>
      </AppLayout>
    );
  }

  if (!authorized) {
    return null;
  }

  // Group events by month
  const eventsByMonth = events.reduce((acc, event) => {
    const monthKey = format(parseISO(event.event_date), 'MMMM yyyy');
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <AppLayout title="Member Info">
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Event Calendar</h2>
          
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <IconLoader2 className="animate-spin" size={24} />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming events at the moment.</p>
              <p className="text-sm mt-2">Check back later for new events!</p>
            </div>
          ) : (
            Object.entries(eventsByMonth).map(([month, monthEvents]) => (
              <div key={month} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">{month}</h3>
                <div className="space-y-4">
                  {monthEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      subtitle={event.description}
                      date={format(parseISO(event.event_date), 'd')}
                      dayOfWeek={format(parseISO(event.event_date), 'EEE')}
                      onClick={() => handleEventClick(event)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
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
            <div className="">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedEvent.title}
              </h3>
              {selectedEvent.description && (
                <p className="text-gray-600 mb-3">{selectedEvent.description}</p>
              )}
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <IconCalendarEvent size={16} className="inline mr-2" />
                  {format(parseISO(selectedEvent.event_date), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-gray-600">
                  <IconClock size={16} className="inline mr-2" />
                  {selectedEvent.start_time.slice(0, 5)}
                  {selectedEvent.end_time && ` - ${selectedEvent.end_time.slice(0, 5)}`}
                </p>
                {selectedEvent.location && (
                  <p className="text-gray-600">
                    <IconMapPin size={16} className="inline mr-2" />
                    {selectedEvent.location}
                  </p>
                )}
                {selectedEvent.max_capacity && (
                  <p className="text-gray-600">
                    <IconUsers size={16} className="inline mr-2" />
                    Max capacity: {selectedEvent.max_capacity} people
                  </p>
                )}
              </div>
            </div>

            {selectedEvent.poster_url && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <img 
                  src={selectedEvent.poster_url} 
                  alt={selectedEvent.title}
                  className="w-full rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {selectedEvent.whatsapp_link && (
              <a 
                href={selectedEvent.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <PrimaryButton fullWidth>
                  <IconBrandWhatsapp size={20} className="mr-2" />
                  Join WhatsApp Group
                </PrimaryButton>
              </a>
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