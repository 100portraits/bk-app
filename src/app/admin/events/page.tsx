'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import EventCard from '@/components/ui/EventCard';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import HelpDialog from '@/components/ui/HelpDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import TextInput from '@/components/ui/TextInput';
import { IconTrash, IconLoader2, IconCalendarEvent, IconClock, IconMapPin, IconUsers, IconBrandWhatsapp, IconPhoto, IconEye, IconEyeOff, IconUpload, IconX, IconPlus } from '@tabler/icons-react';
import { useRequireRole } from '@/hooks/useAuthorization';
import { useEvents } from '@/hooks/useEvents';
import { Event, CreateEventInput } from '@/types/events';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import { uploadEventPoster, deleteEventPoster } from '@/lib/supabase/storage';

export default function ManageEventsPage() {
  const { authorized, loading: authLoading } = useRequireRole(['admin']);
  const { 
    events, 
    loading, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
  } = useEvents();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  
  const [eventForm, setEventForm] = useState<CreateEventInput>({
    title: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    whatsapp_link: '',
    poster_url: '',
    max_capacity: undefined,
    is_published: false
  });

  // Events are loaded automatically by the hook

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date,
      start_time: event.start_time.slice(0, 5), // Convert HH:MM:SS to HH:MM
      end_time: event.end_time?.slice(0, 5) || '',
      location: event.location || '',
      whatsapp_link: event.whatsapp_link || '',
      poster_url: event.poster_url || '',
      max_capacity: event.max_capacity,
      is_published: event.is_published
    });
    // Reset poster file state when editing
    setPosterFile(null);
    setPosterPreview(null);
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      event_date: '',
      start_time: '',
      end_time: '',
      location: '',
      whatsapp_link: '',
      poster_url: '',
      max_capacity: undefined,
      is_published: false
    });
    setPosterFile(null);
    setPosterPreview(null);
  };

  const handlePosterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPosterFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPosterPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePoster = () => {
    setPosterFile(null);
    setPosterPreview(null);
    setEventForm(prev => ({ ...prev, poster_url: '' }));
  };

  const handleCreateSubmit = async () => {
    setSaving(true);
    try {
      let posterUrl = eventForm.poster_url;
      
      // Upload poster if selected
      if (posterFile) {
        setUploadingPoster(true);
        const { url, error } = await uploadEventPoster(posterFile);
        setUploadingPoster(false);
        
        if (error) {
          alert(`Failed to upload poster: ${error}`);
          return;
        }
        posterUrl = url || '';
      }
      
      // Convert HH:MM to HH:MM:SS for database
      const formData = {
        ...eventForm,
        poster_url: posterUrl,
        start_time: eventForm.start_time ? `${eventForm.start_time}:00` : '',
        end_time: eventForm.end_time ? `${eventForm.end_time}:00` : undefined,
        is_published: eventForm.is_published || false
      };
      
      await createEvent(formData);
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setSaving(false);
      setUploadingPoster(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedEvent) return;
    
    setSaving(true);
    try {
      let posterUrl = eventForm.poster_url;
      
      // Upload new poster if selected
      if (posterFile) {
        setUploadingPoster(true);
        const { url, error } = await uploadEventPoster(posterFile);
        setUploadingPoster(false);
        
        if (error) {
          alert(`Failed to upload poster: ${error}`);
          return;
        }
        posterUrl = url || '';
        
        // Delete old poster if it exists
        if (selectedEvent.poster_url && selectedEvent.poster_url !== posterUrl) {
          await deleteEventPoster(selectedEvent.poster_url);
        }
      }
      
      // Convert HH:MM to HH:MM:SS for database
      const formData = {
        ...eventForm,
        id: selectedEvent.id,
        poster_url: posterUrl,
        start_time: eventForm.start_time ? `${eventForm.start_time}:00` : '',
        end_time: eventForm.end_time ? `${eventForm.end_time}:00` : undefined
      };
      
      await updateEvent(formData.id, formData);
      setShowEditDialog(false);
      resetForm();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setSaving(false);
      setUploadingPoster(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    setSaving(true);
    try {
      await deleteEvent(selectedEvent.id);
      setShowDeleteConfirm(false);
      setShowEditDialog(false);
      setSelectedEvent(null);
      resetForm();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setSaving(false);
    }
  };

  const togglePublishStatus = async (event: Event) => {
    try {
      await updateEvent(event.id, { is_published: !event.is_published });
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  if (authLoading) {
    return (
      <AppLayout title="Manage Events">
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
    <AppLayout title="Manage Events">
      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-bold text-gray-900">Manage Events</h2>
          </div>
            <PrimaryButton
              onClick={() => setShowCreateDialog(true)}
              size="sm"
              className='w-full'
            >
              <IconPlus></IconPlus>Create new event
            </PrimaryButton>
        </section>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <IconLoader2 className="animate-spin" size={24} />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No events created yet.</p>
            <p className="text-sm mt-2">Click "Create new event" to add your first event.</p>
          </div>
        ) : (
          Object.entries(eventsByMonth).map(([month, monthEvents]) => (
            <section key={month}>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{month}</h3>
              
              <div className="space-y-4">
                {monthEvents.map((event) => (
                  <div key={event.id} className="relative">
                    <EventCard
                      title={event.title}
                      subtitle={event.description}
                      date={format(parseISO(event.event_date), 'd')}
                      dayOfWeek={format(parseISO(event.event_date), 'EEE')}
                      onClick={() => handleEventClick(event)}
                      onEdit={() => handleEditClick(event)}
                      showEditIcon={true}
                    />
                    <button
                      onClick={() => togglePublishStatus(event)}
                      className={`absolute top-2 right-2 p-2 rounded-lg transition-colors ${
                        event.is_published 
                          ? 'bg-green-100 hover:bg-green-200 text-green-700' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                      }`}
                      title={event.is_published ? 'Published' : 'Draft'}
                    >
                      {event.is_published ? <IconEye size={18} /> : <IconEyeOff size={18} />}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}

        <HelpButton
          text="Help with event management"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <BottomSheetDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        title="Create Event"
        scrollable={true}
        maxHeight="85vh"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IconCalendarEvent size={16} className="inline mr-1" />
                Event Title *
              </label>
              <TextInput
                placeholder="e.g. Weekly Ride Out"
                value={eventForm.title}
                onChange={(value) => setEventForm(prev => ({ ...prev, title: value }))}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg resize-none"
                rows={3}
                placeholder="Event details..."
                value={eventForm.description}
                onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IconCalendarEvent size={16} className="inline mr-1" />
                  Date *
                </label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={eventForm.event_date}
                  onChange={(e) => setEventForm(prev => ({ ...prev, event_date: e.target.value }))}
                  onClick={(e) => {
                    if (e.currentTarget.showPicker) {
                      e.currentTarget.showPicker();
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IconClock size={16} className="inline mr-1" />
                  Start Time *
                </label>
                <input
                  type="time"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={eventForm.start_time}
                  onChange={(e) => setEventForm(prev => ({ ...prev, start_time: e.target.value }))}
                  onClick={(e) => {
                    if (e.currentTarget.showPicker) {
                      e.currentTarget.showPicker();
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IconClock size={16} className="inline mr-1" />
                  End Time
                </label>
                <input
                  type="time"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={eventForm.end_time}
                  onChange={(e) => setEventForm(prev => ({ ...prev, end_time: e.target.value }))}
                  onClick={(e) => {
                    if (e.currentTarget.showPicker) {
                      e.currentTarget.showPicker();
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IconUsers size={16} className="inline mr-1" />
                  Max Capacity
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-200 rounded-lg"
                  placeholder="No limit"
                  value={eventForm.max_capacity || ''}
                  onChange={(e) => setEventForm(prev => ({ ...prev, max_capacity: e.target.value ? parseInt(e.target.value) : undefined }))}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IconMapPin size={16} className="inline mr-1" />
                Location
              </label>
              <TextInput
                placeholder="e.g. Bike Kitchen, Science Park"
                value={eventForm.location}
                onChange={(value) => setEventForm(prev => ({ ...prev, location: value }))}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IconBrandWhatsapp size={16} className="inline mr-1" />
                WhatsApp Group Link
              </label>
              <TextInput
                placeholder="https://chat.whatsapp.com/..."
                value={eventForm.whatsapp_link}
                onChange={(value) => setEventForm(prev => ({ ...prev, whatsapp_link: value }))}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IconPhoto size={16} className="inline mr-1" />
                Event Poster
              </label>
              
              {!posterPreview && !eventForm.poster_url ? (
                <label className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors">
                  <IconUpload size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload poster</span>
                  <span className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP (max 5MB)</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePosterSelect}
                  />
                </label>
              ) : (
                <div className="space-y-2">
                  <div className="relative w-full bg-gray-50 rounded-lg p-2">
                    <div className="relative w-full max-w-sm mx-auto" style={{ aspectRatio: '17/22', maxHeight: '400px' }}>
                      <Image 
                        src={posterPreview || eventForm.poster_url || ''} 
                        alt="Poster preview"
                        fill
                        className="rounded object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removePoster}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <IconX size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    {posterFile ? `New file: ${posterFile.name}` : 'Current poster'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="publish"
                checked={eventForm.is_published}
                onChange={(e) => setEventForm(prev => ({ ...prev, is_published: e.target.checked }))}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="publish" className="text-sm font-medium text-gray-700">
                Publish immediately (visible to members)
              </label>
            </div>
          </div>

          <PrimaryButton
            onClick={handleCreateSubmit}
            fullWidth
            disabled={saving || !eventForm.title || !eventForm.event_date || !eventForm.start_time}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <IconLoader2 className="animate-spin" size={20} />
                Creating...
              </span>
            ) : (
              'Create Event'
            )}
          </PrimaryButton>
        </div>
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Edit Event"
        scrollable={true}
        maxHeight="85vh"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IconCalendarEvent size={16} className="inline mr-1" />
                Event Title *
              </label>
              <TextInput
                placeholder="e.g. Weekly Ride Out"
                value={eventForm.title}
                onChange={(value) => setEventForm(prev => ({ ...prev, title: value }))}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg resize-none"
                rows={3}
                placeholder="Event details..."
                value={eventForm.description}
                onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IconCalendarEvent size={16} className="inline mr-1" />
                  Date *
                </label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={eventForm.event_date}
                  onChange={(e) => setEventForm(prev => ({ ...prev, event_date: e.target.value }))}
                  onClick={(e) => {
                    if (e.currentTarget.showPicker) {
                      e.currentTarget.showPicker();
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IconClock size={16} className="inline mr-1" />
                  Start Time *
                </label>
                <input
                  type="time"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={eventForm.start_time}
                  onChange={(e) => setEventForm(prev => ({ ...prev, start_time: e.target.value }))}
                  onClick={(e) => {
                    if (e.currentTarget.showPicker) {
                      e.currentTarget.showPicker();
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IconClock size={16} className="inline mr-1" />
                  End Time
                </label>
                <input
                  type="time"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={eventForm.end_time}
                  onChange={(e) => setEventForm(prev => ({ ...prev, end_time: e.target.value }))}
                  onClick={(e) => {
                    if (e.currentTarget.showPicker) {
                      e.currentTarget.showPicker();
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IconUsers size={16} className="inline mr-1" />
                  Max Capacity
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-200 rounded-lg"
                  placeholder="No limit"
                  value={eventForm.max_capacity || ''}
                  onChange={(e) => setEventForm(prev => ({ ...prev, max_capacity: e.target.value ? parseInt(e.target.value) : undefined }))}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IconMapPin size={16} className="inline mr-1" />
                Location
              </label>
              <TextInput
                placeholder="e.g. Bike Kitchen, Science Park"
                value={eventForm.location}
                onChange={(value) => setEventForm(prev => ({ ...prev, location: value }))}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IconBrandWhatsapp size={16} className="inline mr-1" />
                WhatsApp Group Link
              </label>
              <TextInput
                placeholder="https://chat.whatsapp.com/..."
                value={eventForm.whatsapp_link}
                onChange={(value) => setEventForm(prev => ({ ...prev, whatsapp_link: value }))}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IconPhoto size={16} className="inline mr-1" />
                Event Poster
              </label>
              
              {!posterPreview && !eventForm.poster_url ? (
                <label className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors">
                  <IconUpload size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload poster</span>
                  <span className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP (max 5MB)</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePosterSelect}
                  />
                </label>
              ) : (
                <div className="space-y-2">
                  <div className="relative w-full bg-gray-50 rounded-lg p-2">
                    <div className="relative w-full max-w-sm mx-auto" style={{ aspectRatio: '17/22', maxHeight: '400px' }}>
                      <Image 
                        src={posterPreview || eventForm.poster_url || ''} 
                        alt="Poster preview"
                        fill
                        className="rounded object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removePoster}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <IconX size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    {posterFile ? `New file: ${posterFile.name}` : 'Current poster'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="publish-edit"
                checked={eventForm.is_published}
                onChange={(e) => setEventForm(prev => ({ ...prev, is_published: e.target.checked }))}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="publish-edit" className="text-sm font-medium text-gray-700">
                Published (visible to members)
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <PrimaryButton
              onClick={handleEditSubmit}
              fullWidth
              disabled={saving || !eventForm.title || !eventForm.event_date || !eventForm.start_time}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <IconLoader2 className="animate-spin" size={20} />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </PrimaryButton>
            <SecondaryButton
              onClick={() => setShowDeleteConfirm(true)}
              fullWidth
              disabled={saving}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <IconTrash size={18} />
              Delete
            </SecondaryButton>
          </div>
        </div>
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        title="Event Preview"
        scrollable={true}
        maxHeight='80vh'
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedEvent.title}
              </h3>
              {selectedEvent.description && (
                <p className="text-gray-600 mb-2">{selectedEvent.description}</p>
              )}
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">
                  <IconCalendarEvent size={16} className="inline mr-1" />
                  {format(parseISO(selectedEvent.event_date), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-gray-600">
                  <IconClock size={16} className="inline mr-1" />
                  {selectedEvent.start_time.slice(0, 5)}
                  {selectedEvent.end_time && ` - ${selectedEvent.end_time.slice(0, 5)}`}
                </p>
                {selectedEvent.location && (
                  <p className="text-gray-600">
                    <IconMapPin size={16} className="inline mr-1" />
                    {selectedEvent.location}
                  </p>
                )}
                {selectedEvent.max_capacity && (
                  <p className="text-gray-600">
                    <IconUsers size={16} className="inline mr-1" />
                    Max capacity: {selectedEvent.max_capacity}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedEvent.is_published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedEvent.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>

            {selectedEvent.poster_url && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Event Poster:</p>
                <div className="relative w-full max-w-md mx-auto" style={{ aspectRatio: '17/22', maxHeight: '500px' }}>
                  <Image 
                    src={selectedEvent.poster_url} 
                    alt={selectedEvent.title}
                    fill
                    className="rounded-lg object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23f3f4f6" width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af"%3EPoster not available%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
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
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Event"
      >
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            {selectedEvent && (
              <p className="text-red-700 mt-2 font-medium">
                Event: {selectedEvent.title}
              </p>
            )}
          </div>
          
          <div className="flex gap-3">
            <SecondaryButton
              onClick={() => setShowDeleteConfirm(false)}
              fullWidth
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={handleDeleteEvent}
              fullWidth
              disabled={saving}
              className="bg-red-600 hover:bg-red-700"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <IconLoader2 className="animate-spin" size={20} />
                  Deleting...
                </span>
              ) : (
                <>
                  <IconTrash size={18} className="mr-2" />
                  Delete Event
                </>
              )}
            </PrimaryButton>
          </div>
        </div>
      </BottomSheetDialog>

      <HelpDialog 
        isOpen={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)} 
        pageName="Events Management" 
      />
    </AppLayout>
  );
}