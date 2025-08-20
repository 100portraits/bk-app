'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/singleton-client';
import { Event, EventSignup } from '@/types/events';
import { useAuth } from '@/contexts/AuthContext';

export function useEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [signups, setSignups] = useState<EventSignup[]>([]);
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
          .order('date', { ascending: true })
          .order('start_time', { ascending: true });

        if (isCancelled) return;
        if (eventsError) throw eventsError;

        // Fetch signups if user is logged in
        let signupsData: EventSignup[] = [];
        if (user) {
          const { data, error: signupsError } = await supabase
            .from('event_signups')
            .select('*')
            .eq('user_id', user.id);
          
          if (signupsError) throw signupsError;
          signupsData = data || [];
        }

        setEvents(eventsData || []);
        setSignups(signupsData);
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

  const signUpForEvent = async (eventId: string) => {
    if (!user) throw new Error('Must be logged in to sign up');

    const { data, error } = await supabase
      .from('event_signups')
      .insert({
        event_id: eventId,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    setSignups(prev => [...prev, data]);
    
    // Update event participant count
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, current_participants: (e.current_participants || 0) + 1 }
        : e
    ));
    
    return data;
  };

  const cancelSignup = async (eventId: string) => {
    if (!user) throw new Error('Must be logged in');

    const { error } = await supabase
      .from('event_signups')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) throw error;

    setSignups(prev => prev.filter(s => s.event_id !== eventId));
    
    // Update event participant count
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, current_participants: Math.max(0, (e.current_participants || 0) - 1) }
        : e
    ));
  };

  const createEvent = async (event: Omit<Event, 'id' | 'created_at' | 'current_participants'>) => {
    const { data, error } = await supabase
      .from('events')
      .insert({ ...event, current_participants: 0 })
      .select()
      .single();

    if (error) throw error;
    
    setEvents(prev => [...prev, data].sort((a, b) => 
      a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time)
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
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (fetchError) throw fetchError;
    
    setEvents(data || []);
    
    if (user) {
      const { data: signupsData, error: signupsError } = await supabase
        .from('event_signups')
        .select('*')
        .eq('user_id', user.id);
      
      if (signupsError) throw signupsError;
      setSignups(signupsData || []);
    }
  };

  const isSignedUp = (eventId: string) => {
    return signups.some(s => s.event_id === eventId);
  };

  return {
    events,
    signups,
    loading,
    error,
    signUpForEvent,
    cancelSignup,
    createEvent,
    updateEvent,
    deleteEvent,
    isSignedUp,
    refresh
  };
}