import { createClient } from '@/lib/supabase/client';
import { Event, CreateEventInput, UpdateEventInput } from '@/types/events';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export class EventsAPI {
  private supabase = createClient();

  /**
   * Get all events (published only for non-admins)
   */
  async getEvents(onlyPublished = true): Promise<Event[]> {
    let query = this.supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (onlyPublished) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get events for a specific date range
   */
  async getEventsByDateRange(startDate: Date, endDate: Date, onlyPublished = true): Promise<Event[]> {
    let query = this.supabase
      .from('events')
      .select('*')
      .gte('event_date', format(startDate, 'yyyy-MM-dd'))
      .lte('event_date', format(endDate, 'yyyy-MM-dd'))
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (onlyPublished) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching events by date range:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get events for a specific month
   */
  async getMonthEvents(date: Date, onlyPublished = true): Promise<Event[]> {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return this.getEventsByDateRange(start, end, onlyPublished);
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(limit = 10, onlyPublished = true): Promise<Event[]> {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    let query = this.supabase
      .from('events')
      .select('*')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(limit);

    if (onlyPublished) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get a single event by ID
   */
  async getEvent(eventId: string): Promise<Event | null> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new event
   */
  async createEvent(event: CreateEventInput): Promise<Event> {
    const { data: user } = await this.supabase.auth.getUser();
    
    const { data, error } = await this.supabase
      .from('events')
      .insert({
        ...event,
        created_by: user?.user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update an existing event
   */
  async updateEvent(update: UpdateEventInput): Promise<Event> {
    const { id, ...updateData } = update;
    
    const { data, error } = await this.supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      throw error;
    }

    return data;
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string): Promise<void> {
    const { error } = await this.supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  /**
   * Toggle event published status
   */
  async togglePublishStatus(eventId: string): Promise<Event> {
    // First get the current status
    const event = await this.getEvent(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Toggle the status
    return this.updateEvent({
      id: eventId,
      is_published: !event.is_published
    });
  }
}