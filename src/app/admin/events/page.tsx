'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import EventCard from '@/components/ui/EventCard';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import TextInput from '@/components/ui/TextInput';
import { IconPaperclip, IconEdit, IconTrash } from '@tabler/icons-react';
import { mockEvents } from '@/lib/placeholderData';

export default function ManageEventsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
  
  const [eventForm, setEventForm] = useState({
    title: '',
    subtitle: '',
    date: '',
    whatsappLink: ''
  });

  const handleEventClick = (event: typeof mockEvents[0]) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleEditClick = (event: typeof mockEvents[0]) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      subtitle: event.subtitle,
      date: `${event.date} ${event.month}`,
      whatsappLink: event.whatsappGroup || ''
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      subtitle: '',
      date: '',
      whatsappLink: ''
    });
  };

  const handleCreateSubmit = () => {
    setShowCreateDialog(false);
    resetForm();
  };

  const handleEditSubmit = () => {
    setShowEditDialog(false);
    resetForm();
    setSelectedEvent(null);
  };

  return (
    <AppLayout title="Admin Panel">
      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-bold text-gray-900">Manage Events</h2>
            <PrimaryButton
              onClick={() => setShowCreateDialog(true)}
              size="sm"
            >
              Create new event
            </PrimaryButton>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Upcoming events</h3>
          <p className="text-gray-600 mb-4">August</p>
          
          <div className="space-y-6">
            {mockEvents.map((event) => (
              <EventCard
                key={event.id}
                title={`${event.title} - ${event.subtitle}`}
                date={event.date}
                dayOfWeek={event.dayOfWeek}
                onClick={() => handleEventClick(event)}
                onEdit={() => handleEditClick(event)}
                showEditIcon={true}
              />
            ))}
          </div>
        </section>

        <HelpButton
          text="Help with event management"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <BottomSheetDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        title="Create event"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <TextInput
                placeholder="Value"
                value={eventForm.title}
                onChange={(value) => setEventForm(prev => ({ ...prev, title: value }))}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <TextInput
                placeholder="Value"
                value={eventForm.subtitle}
                onChange={(value) => setEventForm(prev => ({ ...prev, subtitle: value }))}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <TextInput
                placeholder="Value"
                value={eventForm.date}
                onChange={(value) => setEventForm(prev => ({ ...prev, date: value }))}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp link (optional)</label>
              <TextInput
                placeholder="Value"
                value={eventForm.whatsappLink}
                onChange={(value) => setEventForm(prev => ({ ...prev, whatsappLink: value }))}
                fullWidth
              />
            </div>

            <PrimaryButton
              icon={<IconPaperclip size={18} />}
              fullWidth
              className="justify-start"
            >
              📎 Attach Poster
            </PrimaryButton>
          </div>

          <PrimaryButton
            onClick={handleCreateSubmit}
            fullWidth
          >
            Post Event
          </PrimaryButton>
        </div>
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Edit event"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <TextInput
                placeholder="Value"
                value={eventForm.title}
                onChange={(value) => setEventForm(prev => ({ ...prev, title: value }))}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <TextInput
                placeholder="Value"
                value={eventForm.subtitle}
                onChange={(value) => setEventForm(prev => ({ ...prev, subtitle: value }))}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <TextInput
                placeholder="Value"
                value={eventForm.date}
                onChange={(value) => setEventForm(prev => ({ ...prev, date: value }))}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp link (optional)</label>
              <TextInput
                placeholder="Value"
                value={eventForm.whatsappLink}
                onChange={(value) => setEventForm(prev => ({ ...prev, whatsappLink: value }))}
                fullWidth
              />
            </div>
          </div>

          <div className="flex gap-3">
            <PrimaryButton
              icon={<IconEdit size={18} />}
              onClick={handleEditSubmit}
              fullWidth
            >
              ✏ Save
            </PrimaryButton>
            <SecondaryButton
              icon={<IconTrash size={18} />}
              fullWidth
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              🗑 Delete
            </SecondaryButton>
          </div>
        </div>
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        title="Event Preview"
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
        title="Help with event management"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help with event management? Describe any issues or questions you have:
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