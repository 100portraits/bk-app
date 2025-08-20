'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/singleton-client';
import { Event } from '@/types/events';
import { useAuth } from '@/contexts/AuthContext';

export function useEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true })
          .order('start_time', { ascending: true });

        if (isCancelled) return;
        if (eventsError) throw eventsError;

        setEvents(eventsData || []);
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch events'));
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isCancelled = true;
    };
  }, [user?.id]);

  // Note: Event signup functionality would require an event_signups table
  // which doesn't exist in the current database schema

  const createEvent = async (event: Omit<Event, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    
    setEvents(prev => [...prev, data].sort((a, b) => 
      a.event_date.localeCompare(b.event_date) || a.start_time.localeCompare(b.start_time)
    ));
    
    return data;
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    setEvents(prev => prev.map(e => e.id === id ? data : e));
    return data;
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const refresh = async () => {
    const { data, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (fetchError) throw fetchError;
    
    setEvents(data || []);
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refresh
  };
}